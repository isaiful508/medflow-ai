// Client-side generation is fine for UX (instant, no round-trip),
// but treat this as DISPLAY-ONLY. The backend must independently
// hash whatever password it actually stores — never trust a
// client-generated value as the source of truth for auth.
export function generateSecurePassword(length = 8): string {
  const charset =
    "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
  const values = crypto.getRandomValues(new Uint32Array(length));
  return Array.from(values, (v) => charset[v % charset.length]).join("");
}