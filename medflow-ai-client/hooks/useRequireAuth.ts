"use client";

import { useUser } from "@/context/UserContext";

/**
 * Returns the current user and loading state.
 * Middleware handles auth redirects server-side;
 * this hook is a lightweight client-side convenience.
 */
export function useRequireAuth() {
  const { user, isLoading } = useUser();
  return { user, isLoading };
}

/**
 * Client-side role check — middleware is the primary guard.
 * This is a defense-in-depth safety net for role-specific pages.
 */
export function useRequireRole(_allowedRoles: string[]) {
  const { user, isLoading } = useUser();
  return { user, isLoading };
}
