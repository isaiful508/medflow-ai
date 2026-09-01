import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth-server";
import { recentPatients } from "@/lib/medflow-ai-data";
import { AnalyticsScreen } from "@/components/modules/dashboard/analytics-screen";

export default async function AnalyticsPage() {
  const user = await getServerUser();
  if (!user || (user.role !== "doctor" && user.role !== "admin")) {
    redirect("/dashboard");
  }

  return <AnalyticsScreen patients={recentPatients} />;
}
