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

export function useRequireRole(_allowedRoles: string[]) {
  const { user, isLoading } = useUser();
  return { user, isLoading };
}
