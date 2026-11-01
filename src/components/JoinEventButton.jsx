"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function JoinEventButton({ eventName }) {
  const router = useRouter();

  // Current logged-in session
  const { data: session } = authClient.useSession();

  function handleJoin() {
    // Only logged-in users can join an event
    if (!session?.user) {
      toast.error("Please log in to join this event");
      router.push("/login");
      return;
    }

    // TODO: save the join to the database
    toast.success(`You joined "${eventName}"!`);
  }

  return (
    <Button className="w-full" onClick={handleJoin}>
      Join Event
    </Button>
  );
}