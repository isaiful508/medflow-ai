"use client";

import { useRequireRole } from "@/hooks/useRequireAuth";
import { DashboardScreen } from "@/components/modules/dashboard/dashboard-screen";

export default function DashboardPage() {
  useRequireRole(["patient", "doctor", "admin"]);

  return <DashboardScreen onQuickAction={() => {}} />;
}
