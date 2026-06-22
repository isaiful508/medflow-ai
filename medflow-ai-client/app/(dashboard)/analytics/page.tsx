"use client";

import { recentPatients } from "@/lib/medflow-ai-data";
import { useRequireRole } from "@/hooks/useRequireAuth";
import { AnalyticsScreen } from "@/components/modules/dashboard/analytics-screen";

export default function AnalyticsPage() {
  useRequireRole(["doctor", "admin"]);

  return <AnalyticsScreen patients={recentPatients} />;
}
