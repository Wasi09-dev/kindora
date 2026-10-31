"use client";

// Dependency-free dark mode toggle: flips the `dark` class on <html> and
// remembers the choice in localStorage. Dark mode itself is applied by CSS —
// automatically via `prefers-color-scheme`, unless the `.dark` / `.light`
// class set here overrides it. No flash, no inline bootstrap script.

import { Moon, Sun } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";

const THEME_KEY = "kindora-theme";

export default function ThemeToggle() {
  const [dark, setDark] = React.useState(false);

  // Sync with what the CSS applied (stored choice, else the OS preference).
  React.useEffect(() => {
    const stored = window.localStorage.getItem(THEME_KEY);
    if (stored === "dark" || stored === "light") {
      setDark(stored === "dark");
    } else {
      setDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    const root = document.documentElement;
    root.classList.toggle("dark", next);
    // An explicit choice always wins over the OS preference below.
    root.classList.toggle("light", !next);
    window.localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    setDark(next);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? (
        <Sun className="size-5" aria-hidden="true" />
      ) : (
        <Moon className="size-5" aria-hidden="true" />
      )}
    </Button>
  );
}
