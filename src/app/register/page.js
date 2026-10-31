"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Eye, EyeOff, Image, Lock, Mail, User, X } from "lucide-react";

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
import { authClient } from "@/lib/auth-client";


// Input with a leading icon (and optional trailing element)
function IconInput({ icon: Icon, trailing, ...props }) {
  return (
    <div className="relative">
      <Icon
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input className="pl-9 pr-10" {...props} />
      {trailing}
    </div>
  );
}

// One line of the password checklist
function Rule({ passed, children }) {
  return (
    <li
      className={cn(
        "flex items-center gap-2 text-xs",
        passed ? "text-primary" : "text-muted-foreground"
      )}
    >
      {passed ? (
        <Check className="size-3.5" aria-hidden="true" />
      ) : (
        <X className="size-3.5" aria-hidden="true" />
      )}
      {children}
    </li>
  );
}

export default function RegisterPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Password rules
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasLength = password.length >= 6;
  const isPasswordValid = hasUpper && hasLower && hasLength;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const user = Object.fromEntries(formData.entries());

    const { data, error } = await authClient.signUp.email({
      ...user,
    });
  };

  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Join the community and start driving social change
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <IconInput
                icon={User}
                id="name"
                name="name"
                type="text"
                placeholder="your name"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <IconInput
                icon={Mail}
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
              />
            </div>

            {/* Profile photo URL (optional) */}
            <div className="space-y-2">
              <Label htmlFor="photo">Profile Photo URL</Label>
              <IconInput
                icon={Image}
                id="photo"
                name="photo"
                type="url"
                placeholder="https://images.unsplash.com/..."
              />
              <p className="text-xs text-muted-foreground">
                Optional: Leave empty for default avatar
              </p>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <IconInput
                icon={Lock}
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                }
              />

              <ul className="space-y-1 pt-1">
                <Rule passed={hasUpper}>At least one uppercase letter (A-Z)</Rule>
                <Rule passed={hasLower}>At least one lowercase letter (a-z)</Rule>
                <Rule passed={hasLength}>Minimum 6 characters length</Rule>
              </ul>
            </div>

            <Button
              type="submit"
              className="w-full gap-2"
              disabled={!isPasswordValid}
            >
              Register
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Login here
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}