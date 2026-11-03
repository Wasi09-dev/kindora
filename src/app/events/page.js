import { CalendarDays, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import JoinEventButton from "@/components/JoinEventButton";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
// Fetch all events from the Express server
async function getEvents() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
      // Always get fresh data so new events show up
      cache: "no-store",
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Failed to load events:", error);
    return null;
  }
}

// Turns "2026-11-20" into "Nov 20, 2026"
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page heading */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Upcoming Events
        </h1>
        <p className="mt-2 text-muted-foreground">
          Find a cause you care about and be part of the change
        </p>
      </div>

      {/* Server not reachable */}
      {events === null && (
        <p className="text-center text-destructive" role="alert">
          Could not load events. Make sure the server is running.
        </p>
      )}

      {/* No events yet */}
      {events && events.length === 0 && (
        <p className="text-center text-muted-foreground">
          No events yet. Be the first to add one!
        </p>
      )}

      {/* Event cards */}
      {events && events.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event._id} className="overflow-hidden pt-0">
              {/* Event image */}
              <div className="aspect-video w-full bg-muted">
                <img
                  src={event.image}
                  alt={event.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <CardHeader>
                <Badge variant="secondary" className="w-fit">
                  {event.type}
                </Badge>
                <CardTitle className="text-lg">{event.name}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {event.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  {formatDate(event.date)}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="size-4" aria-hidden="true" />
                  {event.location}
                </p>
              </CardContent>
<CardFooter>
  <Link
    href={`/events/${event._id}`}
    className={buttonVariants({ className: "w-full" })}
  >
    Join Event
  </Link>
</CardFooter>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}