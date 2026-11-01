"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

// Options shown in the event type dropdown
const eventTypes = [
  "Donation",
  "Volunteering",
  "Community Cleanup",
  "Education Campaign",
  "Health Camp",
];

// Returns tomorrow's date as YYYY-MM-DD (the earliest allowed date)
function getTomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function AddEventPage() {
  const [minDate, setMinDate] = useState("");
  const [dateError, setDateError] = useState("");
const [status, setStatus] = useState(null);
const [submitting, setSubmitting] = useState(false);
  // Set the minimum date after the page loads (avoids server/client mismatch)
  useEffect(() => {
    setMinDate(getTomorrow());
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Save the form before await (e.currentTarget becomes null afterwards)
  const form = e.currentTarget;
  const eventData = Object.fromEntries(new FormData(form).entries());

  if (eventData.date < minDate) {
    setDateError("Please choose a future date.");
    return;
  }
  setDateError("");
  setStatus(null);
  setSubmitting(true);

  try {
    const res = await fetch("http://localhost:5000/add-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    const data = await res.json();

    if (data.acknowledged) {
      setStatus({ type: "success", text: "Event published successfully!" });
      form.reset();
    } else {
      setStatus({ type: "error", text: "Something went wrong. Please try again." });
    }
  } catch (error) {
    console.error("Failed to add event:", error);
    setStatus({ type: "error", text: "Could not reach the server." });
  } finally {
    setSubmitting(false);
  }
};
  return (
    <section className="flex justify-center px-4 py-12">
      <Card className="w-full max-w-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Add New Event</CardTitle>
          <CardDescription>
            Fill in the details to publish your social development event
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
                  defaultValue="Donation"
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
                className="min-h-28"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Publish Event
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}