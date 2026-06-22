"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export function useRequireAuth() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) return;
    
    if (!user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  return { user, isLoading };
}

export function useRequireRole(allowedRoles: string[]) {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    const userRole = (user as Record<string, any>)?.role?.toLowerCase() || "patient";
    
    if (!allowedRoles.includes(userRole)) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, allowedRoles, router]);

  return { user, isLoading };
}
