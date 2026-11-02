"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Turns "2026-11-20" into "Nov 20, 2026"
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function ManageEventsPage() {
  const { data: session, isPending } = authClient.useSession();
  const email = session?.user?.email;

  // null means the events are still loading
  const [events, setEvents] = useState(null);
  const [error, setError] = useState(false);

  // The event waiting for delete confirmation
  const [eventToDelete, setEventToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // Only logged-in users can manage events
    if (!email) return;

    async function loadEvents() {
      try {
        // Get all events from every user
        const res = await fetch("http://localhost:5000/events");
        if (!res.ok) throw new Error("Request failed");

        setEvents(await res.json());
      } catch (err) {
        console.error("Failed to load events:", err);
        setError(true);
      }
    }

    loadEvents();
  }, [email]);

  async function handleDelete() {
    setDeleting(true);

    try {
      const res = await fetch(
        `http://localhost:5000/events/${eventToDelete._id}`,
        { method: "DELETE" }
      );
      const data = await res.json();

      if (data.deletedCount > 0) {
        // Remove the deleted event from the list on screen
        setEvents((prev) =>
          prev.filter((item) => item._id !== eventToDelete._id)
        );
        toast.success("Event deleted successfully");
      } else {
        toast.error("Could not delete the event");
      }
    } catch (err) {
      console.error("Failed to delete event:", err);
      toast.error("Could not reach the server");
    } finally {
      setDeleting(false);
      setEventToDelete(null);
    }
  }

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
        to manage events.
      </p>
    );
  } else if (error) {
    content = (
      <p className="text-center text-destructive" role="alert">
        Could not load events. Make sure the server is running.
      </p>
    );
  } else if (events.length === 0) {
    content = (
      <p className="text-center text-muted-foreground">
        No events have been added yet.{" "}
        <Link href="/add-event" className="font-medium text-primary hover:underline">
          Add an event
        </Link>
      </p>
    );
  } else {
    content = (
      <div className="space-y-4">
        {events.map((item) => (
          <div
            key={item._id}
            className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-24 w-full rounded-lg bg-muted object-cover sm:h-16 sm:w-24"
            />

            <div className="min-w-0 flex-1">
              <Link
                href={`/events/${item._id}`}
                className="block truncate font-semibold hover:underline"
              >
                {item.name}
              </Link>
              <p className="truncate text-sm text-muted-foreground">
                {formatDate(item.date)} · {item.location}
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/events/${item._id}/edit`}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                <Pencil className="size-4" aria-hidden="true" />
                Edit
              </Link>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setEventToDelete(item)}
              >
                <Trash2 className="size-4" aria-hidden="true" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Manage Events
        </h1>
        <p className="mt-2 text-muted-foreground">
          Edit or delete events on the site
        </p>
      </div>

      {content}

      {/* Delete confirmation dialog */}
      <Dialog
        open={Boolean(eventToDelete)}
        onOpenChange={(value) => {
          if (!value && !deleting) setEventToDelete(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete &quot;{eventToDelete?.name}&quot;.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEventToDelete(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Yes, delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}