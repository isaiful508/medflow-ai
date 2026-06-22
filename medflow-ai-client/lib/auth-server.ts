import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export interface ServerUser {
  id: string;
  email: string;
  role: "patient" | "doctor" | "admin";
  name?: string;
  iat?: number;
  exp?: number;
}

export async function getServerUser(): Promise<ServerUser | null> {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) return null;

  try {
    const decoded = jwtDecode<ServerUser>(token);
    return decoded;
  } catch {
    return null;
  }
}
