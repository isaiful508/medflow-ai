"use client";

import { useState } from "react";
import { useRequireRole } from "@/hooks/useRequireAuth";
import { ProfileScreen } from "@/components/modules/dashboard/profile-screen";

export default function ProfilePage() {
  useRequireRole(["patient", "doctor", "admin"]);

  const [profileTab, setProfileTab] = useState<"info" | "history" | "vitals">(
    "info",
  );

  return (
    <ProfileScreen profileTab={profileTab} onTabChange={setProfileTab} />
  );
}
