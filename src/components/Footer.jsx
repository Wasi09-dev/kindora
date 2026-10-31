import { Heart } from "lucide-react";
import Link from "next/link";

// Quick link groups
const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const supportLinks = [
  { href: "/faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
];

// lucide-react v1 removed brand icons, so the social glyphs are drawn inline
// with the same 24x24 stroke style lucide uses.
const socialLinks = [
  {
    href: "https://facebook.com",
    label: "Kindora on Facebook",
    icon: (
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    ),
  },
  {
    href: "https://x.com",
    label: "Kindora on X (Twitter)",
    icon: (
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    ),
  },
  {
    href: "https://instagram.com",
    label: "Kindora on Instagram",
    icon: (
      <>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </>
    ),
  },
  {
    href: "https://linkedin.com",
    label: "Kindora on LinkedIn",
    icon: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label="Kindora — go to homepage"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Heart className="size-4" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              Kindora
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Kindora brings people together around social development events —
            volunteering drives, community cleanups, education campaigns, health
            camps, and charity fundraisers.
          </p>
        </div>

        {/* Quick links */}
        <nav aria-label="Quick links">
          <h2 className="text-sm font-semibold">Quick Links</h2>
          <ul className="mt-4 space-y-2.5">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Support */}
        <nav aria-label="Support">
          <h2 className="text-sm font-semibold">Support</h2>
          <ul className="mt-4 space-y-2.5">
            {supportLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social */}
        <div>
          <h2 className="text-sm font-semibold">Follow Us</h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Stay in the loop with community stories and event highlights.
          </p>
          <ul className="mt-4 flex items-center gap-2">
            {socialLinks.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-9 items-center justify-center rounded-lg border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                >
                  <span className="sr-only">{social.label}</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-4"
                    aria-hidden="true"
                  >
                    {social.icon}
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© 2026 Kindora. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made with
            <Heart
              className="size-4 fill-primary text-primary"
              aria-hidden="true"
            />
            for communities everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
