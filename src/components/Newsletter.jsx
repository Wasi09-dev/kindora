"use client";

// Client component: the newsletter form holds local state, validates the
// email address and shows feedback (inline message + toast) on submit.

import { CircleCheck, Mail } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

// Basic email shape check — no backend involved yet.
const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Please enter a valid email address.");
      setSubscribed(false);
      return;
    }

    // Success: clear the form, show an inline confirmation and a toast.
    setError("");
    setSubscribed(true);
    toast.add({
      type: "success",
      title: "You're subscribed!",
      description: `Kindora updates will be sent to ${email.trim()}.`,
    });
    setEmail("");
  }

  return (
    <section
      id="newsletter"
      aria-labelledby="newsletter-heading"
      className="bg-muted/40 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Card className="border-0 bg-gradient-to-br from-card via-card to-teal-50/60 shadow-xl ring-1 ring-border dark:to-teal-950/30">
          <CardHeader className="items-center text-center">
            <span
              aria-hidden="true"
              className="mb-2 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary"
            >
              <Mail className="size-6" />
            </span>
            <CardTitle
              id="newsletter-heading"
              className="text-2xl font-semibold sm:text-3xl"
            >
              Stay Connected with Kindora
            </CardTitle>
            <CardDescription className="text-base">
              Subscribe to get updates on upcoming events and community stories.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <Input
                id="newsletter-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (error) setError("");
                }}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "newsletter-error" : undefined}
                className="h-11 flex-1 bg-background/80"
              />
              <Button type="submit" size="lg" className="h-11 px-6">
                Subscribe
              </Button>
            </form>

            {/* Inline feedback for screen readers and visual users alike */}
            {error ? (
              <p
                id="newsletter-error"
                role="alert"
                className="mt-3 text-center text-sm text-destructive sm:text-left"
              >
                {error}
              </p>
            ) : null}

            {subscribed && !error ? (
              <output
                htmlFor="newsletter-email"
                className="mt-3 flex items-center justify-center gap-1.5 text-center text-sm text-primary sm:justify-start sm:text-left"
              >
                <CircleCheck className="size-4" aria-hidden="true" />
                You're on the list! Watch your inbox for a welcome note.
              </output>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
