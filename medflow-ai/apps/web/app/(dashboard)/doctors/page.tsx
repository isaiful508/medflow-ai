import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth-server";
import { Doctors } from "@/components/modules/dashboard/admin/doctors";

export default async function DoctorsPage() {
  const user = await getServerUser();
  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  return <Doctors />;
}
