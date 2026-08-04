"use client";

import { Toaster} from "sonner";
import UserProvider from "@/context/UserContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      {children}
      <Toaster position="top-right" richColors />
    </UserProvider>
  );
}
