"use client";

import {
  CalendarCheck,
  ChevronDown,
  CirclePlus,
  Heart,
  LogOut,
  Menu,
  Settings2,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ThemeToggle from "./ThemeToggle";

// Main navigation links
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/add-event", label: "Add Event" },
];

// Links shown inside the profile dropdown
const accountLinks = [
  { href: "/add-event", label: "Create Event", icon: CirclePlus },
  { href: "/manage-events", label: "Manage Events", icon: Settings2 },
  { href: "/joined-events", label: "Joined Events", icon: CalendarCheck },
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

// User photo, or the first letter of the name when there is no photo
function UserAvatar({ user }) {
  const initial = user.name?.charAt(0).toUpperCase() || "U";
  return (
    <Avatar>
      {user.image ? (
        <AvatarImage
          src={user.image}
          alt={`${user.name}'s profile photo`}
          referrerPolicy="no-referrer"
        />
      ) : null}
      <AvatarFallback className="bg-primary/10 font-semibold text-primary">
        {initial}
      </AvatarFallback>
    </Avatar>
  );
}

// Avatar button that opens the dropdown
function UserMenu({ user, onLogout }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 px-1.5"
            aria-label="Open account menu"
          />
        }
      >
        <UserAvatar user={user} />
        <ChevronDown
          className="size-3.5 text-muted-foreground"
          aria-hidden="true"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        {/* Name and email */}
        <div className="px-1.5 py-1.5">
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
        <DropdownMenuSeparator />

        {accountLinks.map((link) => (
          <DropdownMenuItem key={link.href} render={<Link href={link.href} />}>
            <link.icon aria-hidden="true" />
            {link.label}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={onLogout}>
          <LogOut aria-hidden="true" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Logged-in session (user is undefined when logged out)
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  async function handleLogout() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Center: desktop links in a pill container */}
        <nav
          className="hidden items-center gap-5 ml-10  bg-muted/50 p-1 md:flex"
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

        {/* Right: theme toggle, auth area, mobile menu */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <div className="hidden items-center gap-2 md:flex">
            {/* Logged in: profile dropdown and logout button */}
            {!isPending && user && (
              <>
                <UserMenu user={user} onLogout={handleLogout} />
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={handleLogout}
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  Logout
                </Button>
              </>
            )}

            {/* Logged out: login and register */}
            {!isPending && !user && (
              <>
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
              </>
            )}
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
                {!isPending && user && (
                  <>
                    <div className="flex items-center gap-2.5 pb-2">
                      <UserAvatar user={user} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {accountLinks.map((link) => (
                      <SheetClose
                        key={link.href}
                        render={
                          <Link
                            href={link.href}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          />
                        }
                      >
                        <link.icon className="size-4" aria-hidden="true" />
                        {link.label}
                      </SheetClose>
                    ))}

                    <SheetClose
                      render={
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={handleLogout}
                        />
                      }
                    >
                      Logout
                    </SheetClose>
                  </>
                )}

                {!isPending && !user && (
                  <>
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
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}