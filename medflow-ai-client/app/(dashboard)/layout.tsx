"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardTopbar } from "@/components/dashboard-topbar";
import { navItems } from "@/lib/medflow-ai-data";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { isRouteAllowed } from "@/lib/navConfig";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isLoading } = useRequireAuth();

  // Get page title from nav items
  const currentNav = navItems.find((item) => item.href === pathname);
  const pageTitle = currentNav?.label ?? "Dashboard";

  if (isLoading) {
    return (
      <div className="medflow-ai-shell flex min-h-screen items-center justify-center text-white">
        <div className="medflow-ai-bg pointer-events-none fixed inset-0 opacity-100">
          <div className="medflow-ai-orbs absolute inset-0" />
          <div className="medflow-ai-grid absolute inset-0 bg-[size:40px_40px]" />
        </div>
        <div className="relative z-10">Loading...</div>
      </div>
    );
  }

  // Role-based route protection at layout level
  if (user && !isRouteAllowed(user?.role, pathname)) {
    return (
      <div className="medflow-ai-shell flex min-h-screen items-center justify-center text-white">
        <div className="medflow-ai-bg pointer-events-none fixed inset-0 opacity-100">
          <div className="medflow-ai-orbs absolute inset-0" />
          <div className="medflow-ai-grid absolute inset-0 bg-[size:40px_40px]" />
        </div>
        <div className="relative z-10 text-center">
          <h2 className="text-lg font-semibold">Access Denied</h2>
          <p className="mt-2 text-sm text-white/60">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="medflow-ai-shell flex min-h-screen text-white">
      <div className="medflow-ai-bg pointer-events-none fixed inset-0 opacity-100">
        <div className="medflow-ai-orbs absolute inset-0" />
        <div className="medflow-ai-grid absolute inset-0 bg-[size:40px_40px]" />
      </div>

      <AppSidebar />

      <section className="relative z-10 flex min-h-screen flex-1 flex-col overflow-hidden">
        <DashboardTopbar pageTitle={pageTitle} />

        <div className="flex-1 overflow-y-auto px-4 py-5 md:px-6">
          {children}
        </div>
      </section>
    </main>
  );
}
