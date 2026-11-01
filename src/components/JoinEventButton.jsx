"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function JoinEventButton({ eventId, eventName }) {
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

        const events = await res.json();
        setJoined(events.some((event) => event._id === eventId));
      } catch (error) {
        console.error("Failed to check joined status:", error);
      }
    }

    checkJoined();
  }, [email, eventId]);

  async function handleJoin() {
    // Only logged-in users can join an event
    if (!email) {
      toast.error("Please log in to join this event");
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/join-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId, userEmail: email }),
      });
      const data = await res.json();

      if (data.acknowledged) {
        setJoined(true);
        toast.success(`You joined "${eventName}"!`);
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