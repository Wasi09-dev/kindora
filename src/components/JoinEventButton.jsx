"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function JoinEventButton({ event }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const email = session?.user?.email;

  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);

  // When the user is logged in, check if they already joined this event
  useEffect(() => {
    if (!email) {
      setJoined(false);
      return;
    }

    async function checkJoined() {
      try {
        const res = await fetch(
          `http://localhost:5000/joined-events?email=${encodeURIComponent(email)}`
        );
        if (!res.ok) return;

        const joins = await res.json();
        setJoined(joins.some((item) => item.eventId === event._id));
      } catch (error) {
        console.error("Failed to check joined status:", error);
      }
    }

    checkJoined();
  }, [email, event._id]);

  async function handleJoin() {
    // Only logged-in users can join an event
    if (!email) {
      toast.error("Please log in to join this event");
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      // Save a copy of the event details with the join.
      // The event's own _id is removed so every join gets its own _id.
      const { _id, ...eventData } = event;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/join-event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...eventData, eventId: _id, userEmail: email }),
      });
      const data = await res.json();

      if (data.acknowledged) {
        setJoined(true);
        toast.success(`You joined "${event.name}"!`);
      } else {
        toast.error(data.message || "Could not join the event");
      }
    } catch (error) {
      console.error("Failed to join event:", error);
      toast.error("Could not reach the server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      className="w-full"
      onClick={handleJoin}
      disabled={joined || loading}
    >
      {joined ? (
        <>
          <Check className="size-4" aria-hidden="true" />
          Joined
        </>
      ) : loading ? (
        "Joining..."
      ) : (
        "Join Event"
      )}
    </Button>
  );
}