import { Suspense } from "react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";

import EventActions from "@/components/EventActions";
import JoinEventButton from "@/components/JoinEventButton";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";


async function getEvent(id, token) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return { event: null, status: res.status };
    return { event: await res.json(), status: 200 };
  } catch (error) {
    console.error("Failed to load event:", error);
    return { event: null, status: 0 };
  }
}


async function getToken() {
  try {
    const result = await auth.api.getToken({ headers: await headers() });
    return result?.token ?? null;
  } catch (error) {
    return null;
  }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

async function EventDetails({ params }) {
  const { id } = await params;

  const token = await getToken();
  const { event, status } = await getEvent(id, token);
  if (status === 400 || status === 404) notFound();

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
        <Link
        href="/events"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to events
      </Link>
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-muted">
        <img
          src={event.image}
          alt={event.name}
          className="h-full w-full object-cover"
        />
      </div>

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
            <div className="max-w-xs pt-4">
          <JoinEventButton event={event} />
          <EventActions eventId={event._id} eventName={event.name} />
        </div>
      </div>
    </section>
  );
}

export default function EventDetailPage() {
  return (
    <Suspense
      fallback={
        <p className="py-12 text-center text-muted-foreground">
          Loading event...
        </p>
      }
    >
      <EventDetails/>
    </Suspense>
  );
}