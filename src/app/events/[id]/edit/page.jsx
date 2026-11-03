import { notFound } from "next/navigation";

import EventForm from "@/components/EventForm";
import { Suspense } from "react";

async function getEvent(id) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return { event: null, status: res.status };
    return { event: await res.json(), status: 200 };
  } catch (error) {
    console.error("Failed to load event:", error);
    return { event: null, status: 0 };
  }
}
async function EditEventContent({ params }) {
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

  return <EventForm event={event} />;
}
export default function EditEventPage({ params }) {
  return ( 
    <Suspense fallback={<p className="text-center text-muted-foreground">Loading...</p>}>
      <EditEventContent params={params} />
    </Suspense>
  );
} 
  