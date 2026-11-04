"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";

// Options shown in the event type dropdown
const eventTypes = [
  "Donation",
  "Volunteering",
  "Community Cleanup",
  "Education Campaign",
  "Health Camp",
];

// Returns tomorrow's date as YYYY-MM-DD
function getTomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Used for adding a new event and for editing an existing one.
// Pass the `event` prop to switch to edit mode.
export default function EventForm({ event }) {
  const router = useRouter();
  const isEdit = Boolean(event);
const { data: session } = authClient.useSession();
const email = session?.user?.email;
  const [minDate, setMinDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const tomorrow = getTomorrow();
    // In edit mode, keep the saved date valid even if it is no longer in the future
    setMinDate(event?.date && event.date < tomorrow ? event.date : tomorrow);
  }, [event?.date]);

  async function handleSubmit(e) {
    e.preventDefault();

    // Save the form before await (e.currentTarget becomes null afterwards)
    const form = e.currentTarget;
    const eventData = Object.fromEntries(new FormData(form).entries());
if (!isEdit && !email) {
  toast.error("Please log in to add an event");
  router.push("/login");
  return;
}
   
    if (eventData.date !== event?.date && eventData.date < getTomorrow()) {
      setDateError("Please choose a future date.");
      return;
    }
    setDateError("");
    setSubmitting(true);

    try {
      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_API_URL}/${event._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/add-event`;
const { data: tokenData } = await authClient.token();
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData?.token}`,
    
        },
        body: JSON.stringify(eventData),
      });
      const data = await res.json();

      if (!data.acknowledged) {
        toast.error(
          isEdit ? "Could not update the event" : "Could not publish the event"
        );
        return;
      }

      if (isEdit) {
        toast.success("Event updated successfully");
        router.push(`/events/${event._id}`);
        router.refresh();
      } else {
        toast.success("Event published successfully!");
        form.reset();
      }
    } catch (error) {
      console.error("Failed to save event:", error);
      toast.error("Could not reach the server");
    } finally {
      setSubmitting(false);
    }
  }

  const buttonLabel = submitting
    ? isEdit
      ? "Saving..."
      : "Publishing..."
    : isEdit
      ? "Update Event"
      : "Publish Event";

  return (
    <section className="flex justify-center px-4 py-12">
      <Card className="w-full max-w-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {isEdit ? "Edit Event" : "Add New Event"}
          </CardTitle>
          <CardDescription>
            {isEdit
              ? "Change the details and save your updates"
              : "Fill in the details to publish your social development event"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Event name */}
            <div className="space-y-2">
              <Label htmlFor="name">Event Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. Winter Clothes Donation Drive"
                defaultValue={event?.name}
                required
              />
            </div>

            {/* Event type + date side by side on larger screens */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">Event Type</Label>
                <select
                  id="type"
                  name="type"
                  defaultValue={event?.type ?? "Donation"}
                  required
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  {eventTypes.map((type) => (
                    <option key={type} value={type} className="bg-background">
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Event Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  min={minDate}
                  defaultValue={event?.date}
                  onChange={() => setDateError("")}
                  required
                />
              </div>
            </div>
            {dateError && (
              <p className="text-sm text-destructive" role="alert">
                {dateError}
              </p>
            )}

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                type="text"
                placeholder="e.g. Dhanmondi, Dhaka"
                defaultValue={event?.location}
                required
              />
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                type="url"
                placeholder="https://images.unsplash.com/..."
                defaultValue={event?.image}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Event Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Tell people what this event is about..."
                defaultValue={event?.description}
                className="min-h-28"
                required
              />
            </div>

            <div className="flex gap-3">
              {/* Cancel is shown only when editing */}
              {isEdit && (
                <Link
                  href={`/events/${event._id}`}
                  className={buttonVariants({
                    variant: "outline",
                    className: "flex-1",
                  })}
                >
                  Cancel
                </Link>
              )}
              <Button type="submit" className="flex-1" disabled={submitting}>
                {buttonLabel}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}