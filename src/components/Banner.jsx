import { CalendarDays, HandHeart, MapPin, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Small impact numbers shown below the call-to-action buttons.
const stats = [
  { icon: CalendarDays, value: "500+", label: "Events" },
  { icon: HandHeart, value: "10K+", label: "Volunteers" },
  { icon: MapPin, value: "50+", label: "Communities" },
];

// Free Unsplash photo: a group of volunteers stacking their hands together.
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1400&q=80";

export default function Banner() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-emerald-50 to-sky-100 dark:from-teal-950/40 dark:via-emerald-950/30 dark:to-sky-950/40"
      aria-labelledby="hero-heading"
    >
      {/* Decorative blurred shapes (purely visual). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-24 size-96 rounded-full bg-teal-400/30 blur-3xl" />
        <div className="absolute top-1/3 -right-24 size-[28rem] rounded-full bg-sky-400/25 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 size-80 rounded-full bg-emerald-300/25 blur-3xl" />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-28">
        {/* Left column: copy + call to action */}
        <div className="flex flex-col items-start gap-6">
          <Badge
            variant="secondary"
            className="h-7 gap-1.5 rounded-full px-3 text-sm"
          >
            <Sparkles aria-hidden="true" />
            Together We Make a Difference
          </Badge>

          <h1
            id="hero-heading"
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Small Acts of Kindness,{" "}
            <span className="bg-gradient-to-r from-teal-600 to-sky-600 bg-clip-text text-transparent dark:from-teal-300 dark:to-sky-300">
              Big Waves of Change
            </span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Join Kindora to discover meaningful social events near you.
            Volunteer, donate, and connect with people who care about building a
            better tomorrow.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
           <Button nativeButton={false} render={<Link href="/events" />}>
  Explore Events
</Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 px-6 text-base"
              render={<Link href="#newsletter" />}
            >
              Learn More
            </Button>
          </div>

          {/* Impact stats */}
          <div className="mt-2 flex flex-wrap gap-x-10 gap-y-6 border-t border-foreground/10 pt-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <stat.icon className="size-5" aria-hidden="true" />
                </span>
                <p className="text-sm text-muted-foreground">
                  <span className="block text-xl font-bold text-foreground">
                    {stat.value}
                  </span>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: hero image (stacked below the copy on mobile) */}
        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/50 shadow-2xl shadow-teal-900/15 ring-1 ring-border">
            <Image
              src={HERO_IMAGE}
              alt="Volunteers stacking their hands together in a circle as a sign of unity"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              loading="eager"
              fetchPriority="high"
            />
          </div>

          {/* Small floating card for extra warmth */}
          <div className="absolute -bottom-5 left-4 flex max-w-xs items-center gap-3 rounded-xl border bg-card/95 p-3 shadow-lg backdrop-blur sm:left-8">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <HandHeart className="size-5" aria-hidden="true" />
            </span>
            <p className="text-sm">
              <span className="block font-semibold">10,000+ kind hearts</span>
              <span className="text-muted-foreground">
                volunteering across 50+ communities
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
