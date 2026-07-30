import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth-server";
import { Doctor } from "@/components/modules/dashboard/admin/doctor";

export default async function DoctorsPage() {
  const user = await getServerUser();
  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  return <Doctor />;
}
