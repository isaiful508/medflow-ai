"use client";

import { Provider as ReduxProvider } from "react-redux";
import { Toaster } from "sonner";
import UserProvider from "@/context/UserContext";
import { store } from "@/store/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <UserProvider>
        {children}
        <Toaster position="top-right" richColors />
      </UserProvider>
    </ReduxProvider>
  );
}
