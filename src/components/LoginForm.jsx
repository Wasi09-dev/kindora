"use client";


import { ArrowRight, Eye, EyeOff, Heart, Lock, Mail } from "lucide-react";
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

/** Multi-colour Google "G" (lucide dropped brand icons in v1). */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="size-4" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};
    if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (!password) {
      nextErrors.password = "Please enter your password.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const session = login({ email: email.trim(), password });
    if (!session) {
      setErrors({
        form: "We couldn't find an account with those details. Try registering first.",
      });
      return;
    }

    toast.add({
      type: "success",
      title: `Welcome back, ${session.name.split(" ")[0]}!`,
      description: "You're signed in to Kindora.",
    });
    router.push("/");
  }

  return (
    <section
      aria-labelledby="login-heading"
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
            id="login-heading"
            className="text-2xl font-bold sm:text-3xl"
          >
            Welcome Back
          </CardTitle>
          <CardDescription className="text-base">
            Sign in to organize and join community drives
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-sm font-medium">
                Email
              </label>
              <InputGroup className="h-11">
                <InputGroupAddon>
                  <Mail aria-hidden="true" />
                </InputGroupAddon>
                <InputGroupInput
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (errors.email || errors.form) {
                      setErrors((prev) => ({
                        ...prev,
                        email: undefined,
                        form: undefined,
                      }));
                    }
                  }}
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={
                    errors.email ? "login-email-error" : undefined
                  }
                />
              </InputGroup>
              {errors.email ? (
                <p
                  id="login-email-error"
                  role="alert"
                  className="text-xs text-destructive"
                >
                  {errors.email}
                </p>
              ) : null}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="login-password" className="text-sm font-medium">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() =>
                    toast.add({
                      type: "info",
                      title: "Password reset coming soon",
                      description:
                        "We'll email you a reset link in a future release.",
                    })
                  }
                  className="text-xs font-medium text-primary underline-offset-4 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <InputGroup className="h-11">
                <InputGroupAddon>
                  <Lock aria-hidden="true" />
                </InputGroupAddon>
                <InputGroupInput
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (errors.password) {
                      setErrors((prev) => ({ ...prev, password: undefined }));
                    }
                  }}
                  aria-invalid={errors.password ? true : undefined}
                  aria-describedby={
                    errors.password ? "login-password-error" : undefined
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
              {errors.password ? (
                <p
                  id="login-password-error"
                  role="alert"
                  className="text-xs text-destructive"
                >
                  {errors.password}
                </p>
              ) : null}
            </div>

            {/* Whole-form error */}
            {errors.form ? (
              <p
                role="alert"
                className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {errors.form}
              </p>
            ) : null}

            <Button type="submit" size="lg" className="h-11 w-full text-base">
              Sign In
              <ArrowRight aria-hidden="true" />
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium tracking-wider text-muted-foreground">
              OR CONTINUE WITH
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button
            variant="outline"
            size="lg"
            className="h-11 w-full text-base"
            onClick={() =>
              toast.add({
                type: "info",
                title: "Google sign-in coming soon",
                description: "Social login will land in a future release.",
              })
            }
          >
            <GoogleIcon />
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Register here
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
