"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function EventActions({ eventId, eventName }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  // Controls the confirmation dialog
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.deletedCount > 0) {
        toast.success("Event deleted successfully");
        router.push("/events");
        router.refresh();
      } else {
        toast.error("Could not delete the event");
      }
    } catch (error) {
      console.error("Failed to delete event:", error);
      toast.error("Could not reach the server");
    } finally {
      setDeleting(false);
      setOpen(false);
    }
  }

  // Only logged-in users see these buttons
  if (!session?.user) return null;

  return (
    <div className="flex flex-wrap gap-3 border-t pt-6">
      <Link
        href={`/events/${eventId}/edit`}
        className={buttonVariants({ variant: "outline" })}
      >
        <Pencil className="size-4" aria-hidden="true" />
        Edit Event
      </Link>

      {/* This button only opens the dialog */}
      <Button variant="destructive" onClick={() => setOpen(true)}>
        <Trash2 className="size-4" aria-hidden="true" />
        Delete Event
      </Button>

      <Dialog
        open={open}
        onOpenChange={(value) => {
          // Do not allow closing while the delete request is running
          if (!deleting) setOpen(value);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete &quot;{eventName}&quot;. This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
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
    </div>
  );
}