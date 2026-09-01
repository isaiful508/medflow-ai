"use client";

import { useState } from "react";
import { ProfileScreen } from "@/components/modules/dashboard/profile-screen";

export default function ProfilePage() {
  const [profileTab, setProfileTab] = useState<"info" | "history" | "vitals">(
    "info",
  );

  return (
    <ProfileScreen profileTab={profileTab} onTabChange={setProfileTab} />
  );
}
