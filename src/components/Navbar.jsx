"use client";

import { Heart, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
];

function isActiveLink(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="Kindora home">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Heart className="size-4" aria-hidden="true" />
      </span>
      <span className="text-lg font-semibold tracking-tight">Kindora</span>
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop links */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => {
            const active = isActiveLink(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                  active ? "bg-muted text-primary" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop buttons */}
        <div className="hidden items-center gap-2 md:flex">
          <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Log in
          </Link>
          <Link href="/signup" className={buttonVariants({ variant: "outline", size: "sm" })}>
            Sign Up
          </Link>
          <Link href="/events" className={buttonVariants({ size: "sm" })}>
            Explore Events
          </Link>
        </div>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              />
            }
          >
            <Menu className="size-5" aria-hidden="true" />
          </SheetTrigger>

          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-1 px-4">
              {navLinks.map((link) => (
                <SheetClose
                  key={link.href}
                  render={
                    <Link
                      href={link.href}
                      className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                    />
                  }
                >
                  {link.label}
                </SheetClose>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-2 px-4 pb-4">
              <SheetClose
                render={
                  <Link
                    href="/login"
                    className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                  />
                }
              >
                Log in
              </SheetClose>
              <SheetClose
                render={
                  <Link href="/signup" className={cn(buttonVariants(), "w-full")} />
                }
              >
                Sign Up
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
