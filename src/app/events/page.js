import { CalendarDays } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Events",
  description:
    "Browse upcoming Kindora social development events — volunteering drives, community cleanups, education campaigns, health camps, and charity fundraisers.",
};

// Placeholder listing — replace with real event data (cards/grid) later.
const eventTypes = [
  "Volunteering Drives",
  "Community Cleanups",
  "Education Campaigns",
  "Health Camps",
  "Charity Fundraisers",
];

export default function EventsPage() {
  return (
    <section
      aria-labelledby="events-heading"
      className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-6"
    >
      <Badge variant="secondary" className="h-7 rounded-full px-3 text-sm">
        <CalendarDays aria-hidden="true" />
        Coming Soon
      </Badge>

      <h1
        id="events-heading"
        className="text-3xl font-bold tracking-tight sm:text-4xl"
      >
        Discover events that need you
      </h1>

      <p className="max-w-xl leading-relaxed text-muted-foreground">
        The Kindora event browser is being built. Soon you'll be able to filter
        social development events by cause, place, and date:
      </p>

      <ul className="flex flex-wrap items-center justify-center gap-2">
        {eventTypes.map((type) => (
          <li
            key={type}
            className="rounded-full border bg-muted/50 px-3 py-1 text-sm text-muted-foreground"
          >
            {type}
          </li>
        ))}
      </ul>

      <Button
        size="lg"
        variant="outline"
        className="mt-4 h-11 px-6 text-base"
        render={<Link href="/" />}
      >
        Back to home
      </Button>
    </section>
  );
}
