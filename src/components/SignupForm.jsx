"use client";

// Registration form ("Create Account"). Client-only: live password rule
// checklist, client-side validation, then a demo signup through AuthProvider.

import {
  ArrowRight,
  Check,
  Circle,
  Eye,
  EyeOff,
  Heart,
  ImageIcon,
  Lock,
  Mail,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";


import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { toast } from "@/components/ui/toast";

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

// The live checklist shown under the password field.
const PASSWORD_RULES = [
  {
    id: "uppercase",
    label: "At least one uppercase letter (A-Z)",
    test: (value) => /[A-Z]/.test(value),
  },
  {
    id: "lowercase",
    label: "At least one lowercase letter (a-z)",
    test: (value) => /[a-z]/.test(value),
  },
  {
    id: "length",
    label: "Minimum 6 characters length",
    test: (value) => value.length >= 6,
  },
];

export default function SignupForm() {
  const router = useRouter();
  const { signup } = useAuth();

  const [form, setForm] = React.useState({
    name: "",
    email: "",
    photo: "",
    password: "",
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};
    if (form.name.trim().length < 2) {
      nextErrors.name = "Please enter your full name.";
    }
    if (!EMAIL_PATTERN.test(form.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (form.photo.trim() && !/^https?:\/\/\S+$/i.test(form.photo.trim())) {
      nextErrors.photo = "Please enter a valid URL (starting with https://).";
    }
    if (!PASSWORD_RULES.every((rule) => rule.test(form.password))) {
      nextErrors.password = "Please meet all password requirements below.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const session = signup({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      photo: form.photo.trim(),
    });

    toast.add({
      type: "success",
      title: "Welcome to Kindora!",
      description: `Account created for ${session.name}. Time to make a difference.`,
    });
    router.push("/");
  }

  return (
    <section
      aria-labelledby="signup-heading"
      className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-gradient-to-br from-teal-50 via-emerald-50 to-sky-100 px-4 py-16 dark:from-teal-950/40 dark:via-emerald-950/30 dark:to-sky-950/40"
    >
      {/* Decorative blurred shapes */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-20 size-80 rounded-full bg-teal-400/30 blur-3xl" />
        <div className="absolute -right-24 bottom-0 size-96 rounded-full bg-sky-400/25 blur-3xl" />
      </div>

      <Card className="relative w-full max-w-md border-0 shadow-xl ring-1 ring-border [--card-spacing:--spacing(6)] sm:[--card-spacing:--spacing(8)]">
        <CardHeader className="items-center text-center">
          <span
            aria-hidden="true"
            className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30"
          >
            <Heart className="size-7" />
          </span>
          <CardTitle
            id="signup-heading"
            className="text-2xl font-bold sm:text-3xl"
          >
            Create Account
          </CardTitle>
          <CardDescription className="text-base">
            Join the community and start driving social change
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Full name */}
            <div className="space-y-1.5">
              <label htmlFor="signup-name" className="text-sm font-medium">
                Full Name
              </label>
              <InputGroup className="h-11">
                <InputGroupAddon>
                  <User aria-hidden="true" />
                </InputGroupAddon>
                <InputGroupInput
                  id="signup-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Ada Lovelace"
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={
                    errors.name ? "signup-name-error" : undefined
                  }
                />
              </InputGroup>
              {errors.name ? (
                <p
                  id="signup-name-error"
                  role="alert"
                  className="text-xs text-destructive"
                >
                  {errors.name}
                </p>
              ) : null}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="signup-email" className="text-sm font-medium">
                Email Address
              </label>
              <InputGroup className="h-11">
                <InputGroupAddon>
                  <Mail aria-hidden="true" />
                </InputGroupAddon>
                <InputGroupInput
                  id="signup-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={
                    errors.email ? "signup-email-error" : undefined
                  }
                />
              </InputGroup>
              {errors.email ? (
                <p
                  id="signup-email-error"
                  role="alert"
                  className="text-xs text-destructive"
                >
                  {errors.email}
                </p>
              ) : null}
            </div>

            {/* Profile photo (optional) */}
            <div className="space-y-1.5">
              <label htmlFor="signup-photo" className="text-sm font-medium">
                Profile Photo URL
              </label>
              <InputGroup className="h-11">
                <InputGroupAddon>
                  <ImageIcon aria-hidden="true" />
                </InputGroupAddon>
                <InputGroupInput
                  id="signup-photo"
                  name="photo"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={form.photo}
                  onChange={(event) => updateField("photo", event.target.value)}
                  aria-invalid={errors.photo ? true : undefined}
                  aria-describedby={
                    errors.photo
                      ? "signup-photo-error signup-photo-hint"
                      : "signup-photo-hint"
                  }
                />
              </InputGroup>
              <p
                id="signup-photo-hint"
                className="text-xs text-muted-foreground"
              >
                Optional. Leave empty for default avatar.
              </p>
              {errors.photo ? (
                <p
                  id="signup-photo-error"
                  role="alert"
                  className="text-xs text-destructive"
                >
                  {errors.photo}
                </p>
              ) : null}
            </div>

            {/* Password + live requirements */}
            <div className="space-y-1.5">
              <label htmlFor="signup-password" className="text-sm font-medium">
                Password
              </label>
              <InputGroup className="h-11">
                <InputGroupAddon>
                  <Lock aria-hidden="true" />
                </InputGroupAddon>
                <InputGroupInput
                  id="signup-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(event) =>
                    updateField("password", event.target.value)
                  }
                  aria-invalid={errors.password ? true : undefined}
                  aria-describedby={
                    errors.password
                      ? "signup-password-error signup-password-rules"
                      : "signup-password-rules"
                  }
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-xs"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? (
                      <EyeOff aria-hidden="true" />
                    ) : (
                      <Eye aria-hidden="true" />
                    )}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>

              <ul
                id="signup-password-rules"
                className="mt-2 space-y-1 text-xs text-muted-foreground"
              >
                {PASSWORD_RULES.map((rule) => {
                  const passed = rule.test(form.password);
                  return (
                    <li
                      key={rule.id}
                      className={
                        passed
                          ? "flex items-center gap-1.5 text-primary"
                          : "flex items-center gap-1.5"
                      }
                    >
                      {passed ? (
                        <Check className="size-3.5" aria-hidden="true" />
                      ) : (
                        <Circle className="size-3.5" aria-hidden="true" />
                      )}
                      <span className={passed ? "font-medium" : undefined}>
                        {rule.label}
                      </span>
                      <span className="sr-only">
                        {passed ? "(met)" : "(not met)"}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {errors.password ? (
                <p
                  id="signup-password-error"
                  role="alert"
                  className="text-xs text-destructive"
                >
                  {errors.password}
                </p>
              ) : null}
            </div>

            <Button type="submit" size="lg" className="h-11 w-full text-base">
              Register
              <ArrowRight aria-hidden="true" />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Login here
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
