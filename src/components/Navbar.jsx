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
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
    { href: "/add-event", label: "Add Event" },
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
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left: logo */}
        <Logo />

        {/* Center: desktop links in a pill container */}
        <nav
          className="hidden items-center gap-5 ml-20 bg-muted/50 p-1 md:flex"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => {
            const active = isActiveLink(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-5 py-1.5 text-sm font-medium transition-all",
                  active
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: theme toggle, desktop buttons, mobile menu */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/login"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              Log in
            </Link>
            <Link
              href="/register"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Register
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
                {navLinks.map((link) => {
                  const active = isActiveLink(pathname, link.href);
                  return (
                    <SheetClose
                      key={link.href}
                      render={
                        <Link
                          href={link.href}
                          className={cn(
                            "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                            active
                              ? "bg-muted text-primary"
                              : "text-muted-foreground"
                          )}
                        />
                      }
                    >
                      {link.label}
                    </SheetClose>
                  );
                })}
              </div>

              <div className="mt-auto flex flex-col gap-2 px-4 pb-4">
                <SheetClose
                  render={
                    <Link
                      href="/login"
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full"
                      )}
                    />
                  }
                >
                  Log in
                </SheetClose>
                <SheetClose
                  render={
                    <Link
                      href="/register"
                      className={cn(buttonVariants(), "w-full")}
                    />
                  }
                >
                  Register
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}