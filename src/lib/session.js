// Minimal, dependency-free session storage for the Kindora demo.
//
// There is no backend yet, so the signed-in user is kept in localStorage.
// To plug in your own auth (NextAuth, Firebase, a custom API, …) replace the
// bodies of these four functions — every component (Navbar, LoginForm,
// SignupForm) only talks to this module, so your implementation drops
// straight in without touching the UI.

const USER_KEY = "kindora:user";

// Fired on `window` whenever the session changes, so the Navbar can re-render
// without any React context or provider.
export const AUTH_EVENT = "kindora:auth-change";

function notify() {
  window.dispatchEvent(new Event(AUTH_EVENT));
}

/** Returns the signed-in user ({ name, email, photo }) or null. */
export function getSession() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(window.localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

/** Saves the session and notifies listeners. */
export function saveSession(user) {
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  notify();
}

/** Clears the session and notifies listeners. */
export function clearSession() {
  window.localStorage.removeItem(USER_KEY);
  notify();
}

/** "Ada Lovelace" -> "AL" (used by the avatar fallback). */
export function getInitials(name = "") {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
  return initials || "K";
}
