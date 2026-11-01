import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";

import JoinEventButton from "@/components/JoinEventButton";
import { Badge } from "@/components/ui/badge";

// Fetch a single event from the Express server
async function getEvent(id) {
  try {
    const res = await fetch(`http://localhost:5000/events/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) return { event: null, status: res.status };
    return { event: await res.json(), status: 200 };
  } catch (error) {
    console.error("Failed to load event:", error);
    return { event: null, status: 0 };
  }
}

// Turns "2026-11-20" into "Friday, November 20, 2026"
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function EventDetailPage({ params }) {
  const { id } = await params;
  const { event, status } = await getEvent(id);

  // Unknown or invalid id shows the 404 page
  if (status === 400 || status === 404) notFound();

  // Server is not reachable
  if (!event) {
    return (
      <section className="mx-auto w-full max-w-4xl px-4 py-12">
        <p className="text-center text-destructive" role="alert">
          Could not load this event. Make sure the server is running.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
      {/* Back link */}
      <Link
        href="/events"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to events
      </Link>

      {/* Event image */}
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-muted">
        <img
          src={event.image}
          alt={event.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Event info */}
      <div className="mt-6 space-y-4">
        <Badge variant="secondary">{event.type}</Badge>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {event.name}
        </h1>

        <div className="flex flex-col gap-2 text-muted-foreground sm:flex-row sm:gap-6">
          <p className="flex items-center gap-2">
            <CalendarDays className="size-4" aria-hidden="true" />
            {formatDate(event.date)}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="size-4" aria-hidden="true" />
            {event.location}
          </p>
        </div>

        <div className="pt-2">
          <h2 className="mb-2 text-lg font-semibold">About this event</h2>
          <p className="whitespace-pre-line text-muted-foreground">
            {event.description}
          </p>
        </div>

        {/* Join button with toast */}
        <div className="max-w-xs pt-4">
          <JoinEventButton eventName={event.name} />
        </div>
      </div>
    </section>
  );
}