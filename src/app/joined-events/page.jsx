"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function JoinedEventsPage() {
  const { data: session, isPending } = authClient.useSession();
  const email = session?.user?.email;


  const [events, setEvents] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!email) return;

    async function loadJoinedEvents() {
      try {
        const res = await fetch(
          `http://localhost:5000/joined-events?email=${encodeURIComponent(email)}`
        );
        if (!res.ok) throw new Error("Request failed");

        setEvents(await res.json());
      } catch (err) {
        console.error("Failed to load joined events:", err);
        setError(true);
      }
    }

    loadJoinedEvents();
  }, [email]);

  let content;

  if (isPending || (email && events === null && !error)) {
    content = <p className="text-center text-muted-foreground">Loading...</p>;
  } else if (!email) {
    content = (
      <p className="text-center text-muted-foreground">
        Please{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          log in
        </Link>{" "}
        to see the events you joined.
      </p>
    );
  } else if (error) {
    content = (
      <p className="text-center text-destructive" role="alert">
        Could not load your events. Make sure the server is running.
      </p>
    );
  } else if (events.length === 0) {
    content = (
      <p className="text-center text-muted-foreground">
        You have not joined any events yet.{" "}
        <Link href="/events" className="font-medium text-primary hover:underline">
          Explore events
        </Link>
      </p>
    );
  } else {
    content = (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event._id} className="overflow-hidden pt-0">
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
                className={buttonVariants({
                  variant: "outline",
                  className: "w-full",
                })}
              >
                View Details
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Joined Events
        </h1>
        <p className="mt-2 text-muted-foreground">
          The events you are part of
        </p>
      </div>

      {content}
    </section>
  );
}