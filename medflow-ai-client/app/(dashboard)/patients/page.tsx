import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth-server";
import { Patients } from "@/components/modules/dashboard/admin/patients";

export default async function PatientsPage() {
  const user = await getServerUser();
  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  return <Patients />;
}
