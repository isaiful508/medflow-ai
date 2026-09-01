import { jwtDecode } from "jwt-decode";
import { IUser } from "@/types";

export const getCurrentUserClient = (): IUser | null => {
  if (typeof window === "undefined") return null;
  const accessToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1];
  if (!accessToken) return null;
  try {
    return jwtDecode<IUser>(accessToken);
  } catch {
    return null;
  }
};
