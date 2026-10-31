import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";

// Placeholder content for the informational links in the navbar/footer
// (About, Contact, FAQ, Privacy Policy, Terms) so none of them 404 while the
// landing page takes shape. Each one is a short "coming soon" page.
const infoPages = {
  about: {
    title: "About Kindora",
    description:
      "Kindora is a platform where people discover and join social development events — volunteering drives, community cleanups, education campaigns, health camps, and charity fundraisers.",
  },
  contact: {
    title: "Contact Us",
    description:
      "Questions, partnership ideas, or want to list your event? The Kindora team would love to hear from you.",
  },
  faq: {
    title: "Frequently Asked Questions",
    description:
      "Answers to common questions about joining events, volunteering, and donating through Kindora.",
  },
  privacy: {
    title: "Privacy Policy",
    description:
      "How Kindora collects, uses, and protects your personal information.",
  },
  terms: {
    title: "Terms of Service",
    description:
      "The terms and conditions that govern your use of the Kindora platform.",
  },
  "create-event": {
    title: "Create Event",
    description:
      "Post a volunteering drive, community cleanup, education campaign, health camp, or charity fundraiser for others to join.",
  },
  "manage-events": {
    title: "Manage Events",
    description:
      "Edit, publish, and track the events you've organized on Kindora.",
  },
  "joined-events": {
    title: "Joined Events",
    description:
      "Keep track of every Kindora event you've signed up for, all in one place.",
  },
};

export function generateStaticParams() {
  return Object.keys(infoPages).map((info) => ({ info }));
}

export async function generateMetadata({ params }) {
  const { info } = await params;
  const page = infoPages[info];
  return page ? { title: page.title, description: page.description } : {};
}

export default async function InfoPage({ params }) {
  const { info } = await params;
  const page = infoPages[info];

  if (!page) notFound();

  return (
    <section
      aria-labelledby="info-heading"
      className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-6"
    >
      <h1
        id="info-heading"
        className="text-3xl font-bold tracking-tight sm:text-4xl"
      >
        {page.title}
      </h1>

      <p className="leading-relaxed text-muted-foreground">
        {page.description}
      </p>

      <p className="text-sm text-muted-foreground">
        This page is on the way — it's a placeholder for now.
      </p>

      <Button
        size="lg"
        variant="outline"
        className="mt-2 h-11 px-6 text-base"
        render={<Link href="/" />}
      >
        Back to home
      </Button>
    </section>
  );
}
