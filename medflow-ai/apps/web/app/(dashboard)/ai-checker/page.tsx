import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth-server";
import { AiCheckerClient } from "./ai-checker-client";

export default async function AiCheckerPage() {
  const user = await getServerUser();
  if (!user || user.role !== "patient") {
    redirect("/dashboard");
  }

  return <AiCheckerClient />;
}
