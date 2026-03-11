// ═══════════════════════════════════════════
// BARPHASE — SIMPLE PASSWORD AUTH (no external services)
// ═══════════════════════════════════════════

const STORAGE_KEY = "barphase_auth";

// The password is set via environment variable.
// Fallback to a default for local dev only.
const SITE_PASSWORD = process.env.NEXT_PUBLIC_SITE_PASSWORD || "barphase2026";

export function verifyPassword(input: string): boolean {
  return input === SITE_PASSWORD;
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "true";
}

export function setAuthenticated(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, "true");
}

export function clearAuthenticated(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
