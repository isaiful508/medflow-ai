"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { Navbar } from "@/components/shared/navbar";
import { navItems } from "@/lib/medflow-ai-data";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isLoading } = useRequireAuth();

  const currentNav = navItems.find((item) => item.href === pathname);
  const pageTitle = currentNav?.label ?? "Dashboard";

  if (isLoading) {
    return (
      <div className="medflow-ai-shell flex min-h-screen items-center justify-center overflow-x-hidden text-white">
        <div className="medflow-ai-bg pointer-events-none fixed inset-0 opacity-100">
          <div className="medflow-ai-orbs absolute inset-0" />
          <div className="medflow-ai-grid absolute inset-0 bg-[size:40px_40px]" />
        </div>
        <div className="relative z-10">Loading...</div>
      </div>
    );
  }

  return (
    <main className="medflow-ai-shell flex min-h-screen overflow-x-hidden text-white">
      <div className="medflow-ai-bg pointer-events-none fixed inset-0 opacity-100">
        <div className="medflow-ai-orbs absolute inset-0" />
        <div className="medflow-ai-grid absolute inset-0 bg-[size:40px_40px]" />
      </div>

      <AppSidebar />

      <section className="relative z-10 flex min-h-screen flex-1 flex-col overflow-hidden">
        <Navbar pageTitle={pageTitle} />

        <div className="flex-1 overflow-y-auto px-4 py-5 md:px-6">
          {children}
        </div>
      </section>
    </main>
  );
}
