"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Menu,
  CircleUserRound,
  HeartPulse,
  LayoutDashboard,
  Bot,
  Calendar,
  Video,
  MessageSquare,
  ChartNoAxesColumn,
} from "lucide-react";

import { logout } from "@/services/AuthService";
import { useUser } from "@/context/UserContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuBadge,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getVisibleNavItems } from "@/lib/navConfig";

const navIcons = {
  dashboard: LayoutDashboard,
  "ai-checker": Bot,
  appointments: Calendar,
  "video-call": Video,
  chat: MessageSquare,
  profile: CircleUserRound,
  analytics: ChartNoAxesColumn,
} as const;

export function AppSidebar({
  collapsed: initialCollapsed,
}: {
  collapsed?: boolean;
} = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser, isLoading } = useUser();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(initialCollapsed ?? false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const userName = useMemo(() => {
    if (!user || typeof user !== "object") return "Member";
    const payload = user as Record<string, unknown>;
    const fullName = payload.fullName || payload.name || payload.email || "Member";
    return String(fullName).trim() || "Member";
  }, [user]);

  const userRole = useMemo(() => {
    if (!user || typeof user !== "object") return "patient";
    const payload = user as Record<string, unknown>;
    return String(payload.role || "patient").toLowerCase().trim() || "patient";
  }, [user]);

  const visibleNavItems = useMemo(() => {
    return getVisibleNavItems(userRole);
  }, [userRole]);

  const userAvatar = useMemo(() => {
    if (!user || typeof user !== "object") return "";
    const payload = user as Record<string, unknown>;
    return String(payload.avatar || payload.avatarUrl || payload.image || payload.photo || "").trim();
  }, [user]);

  const userInitials = useMemo(() => {
    const name = userName.trim();
    if (!name) return "ME";
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((segment) => segment[0].toUpperCase())
      .join("");
  }, [userName]);

  useEffect(() => {
    if (!userMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  return (
    <Sidebar collapsed={collapsed}>
      <SidebarHeader>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "linear-gradient(135deg, var(--medflow-primary-600), var(--mc-accent))" }}>
          <HeartPulse className="size-4 text-white" />
        </div>
        {!collapsed ? (
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-wide">
              Medflow<span style={{ color: "var(--mc-accent)" }}>AI</span>
            </p>
            <p className="text-[11px] text-(--mc-text-40)">Telemedicine Platform</p>
          </div>
        ) : null}
        <SidebarTrigger onClick={() => setCollapsed((prev) => !prev)}>
          <Menu className="size-4" />
        </SidebarTrigger>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {visibleNavItems.map((item) => {
            const Icon = navIcons[item.id];
            const isActive = pathname === item.href;
            return (
              <li key={item.id} className="list-none">
                <Link
                  href={item.href}
                  className={`group/nav relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 ease-out ${
                    isActive
                      ? "bg-(--mc-accent) text-(--mc-fg) shadow-sm shadow-(--mc-accent)/15"
                      : "text-(--mc-text-60) hover:bg-(--mc-soft) hover:text-(--mc-fg) hover:translate-x-0.5"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full" style={{ background: "var(--mc-accent)" }} />
                  )}
                  <span className={`flex size-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-(--mc-accent)/20 text-(--mc-accent) shadow-sm shadow-(--mc-accent)/20"
                      : "bg-(--mc-soft) text-(--mc-text-50) group-hover/nav:bg-(--mc-accent)/15 group-hover/nav:text-(--mc-accent) group-hover/nav:shadow-sm group-hover/nav:shadow-(--mc-accent)/10"
                  }`}>
                    <Icon className="size-4" />
                  </span>
                  {!collapsed ? <span>{item.label}</span> : null}
                  {!collapsed && item.badge ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
                </Link>
              </li>
            );
          })}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {!isLoading && !user ? (
          <Link
            href="/login"
            className={`group relative flex items-center gap-3 rounded-2xl border border-(--mc-border) bg-(--mc-soft) px-3 py-3 text-sm text-(--mc-text-70) transition duration-300 hover:border-(--mc-accent)/25 hover:bg-(--mc-accent)/10 hover:text-(--mc-fg) hover:shadow-lg hover:shadow-blue-500/10 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <div className="relative">
              <CircleUserRound className="size-5 text-(--mc-text-70) transition group-hover:text-(--mc-fg)" />
            </div>
            {!collapsed ? <span className="font-medium">Sign in</span> : null}
          </Link>
        ) : (
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen((prev) => !prev)}
              className={`group relative w-full overflow-hidden rounded-2xl border transition duration-300 ${
                userMenuOpen
                  ? "border-blue-400/30 bg-linear-to-br from-blue-500/20 to-blue-600/10 shadow-lg shadow-blue-500/20"
                  : "border-(--mc-border) bg-(--mc-soft) hover:border-(--mc-accent)/25 hover:bg-(--mc-accent)/10 hover:shadow-lg hover:shadow-blue-500/10"
              }`}
            >
              <div className="flex items-center gap-3 px-3 py-3 text-left">
                {userAvatar ? (
                  <Image
                    src={userAvatar}
                    alt={userName}
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-xl object-cover ring-2 ring-white/10 transition group-hover:ring-white/20"
                  />
                ) : (
                  <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 via-blue-600 to-cyan-500 font-semibold text-white shadow-lg shadow-blue-500/30 ring-1 ring-(--mc-accent)/20 transition group-hover:shadow-blue-500/50 group-hover:ring-(--mc-accent)/40">
                    <span className="text-sm">{userInitials}</span>
                  </div>
                )}
                {!collapsed ? (
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-(--mc-fg)">{userName}</p>
                    <p className="text-[11px] text-(--mc-text-50) transition group-hover:text-(--mc-text-70)">{userRole.charAt(0).toUpperCase()}{userRole.slice(1)}</p>
                  </div>
                ) : null}
                {!collapsed ? (
                  <div className="flex items-center justify-center rounded-lg bg-(--mc-soft) p-1.5 transition group-hover:bg-(--mc-accent)/10">
                    <Menu className="size-4 text-(--mc-text-50) transition group-hover:text-(--mc-text-70)" />
                  </div>
                ) : null}
              </div>
            </button>

            {userMenuOpen ? (
              <div className="absolute left-0 bottom-full mb-3 w-full space-y-1 overflow-hidden rounded-2xl border border-(--mc-border) bg-(--mc-card) p-2 shadow-2xl shadow-black/50 backdrop-blur-xl">
                <Link
                  href="/profile"
                  onClick={() => setUserMenuOpen(false)}
                  className="group/item flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-(--mc-text-70) transition duration-300 hover:bg-(--mc-accent)/15 hover:text-(--mc-fg)"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 transition group-hover/item:bg-blue-500/30">
                    <CircleUserRound className="size-4 text-blue-300" />
                  </div>
                  <span className="font-medium">View Profile</span>
                </Link>
                <div className="my-1 h-px bg-linear-to-r from-transparent via-(--mc-border) to-transparent" />
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    setUser(null);
                    setUserMenuOpen(false);
                    router.push("/login");
                  }}
                  className="group/item flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-(--mc-text-70) transition duration-300 hover:bg-red-500/15 hover:text-red-300"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20 transition group-hover/item:bg-red-500/30">
                    <span className="text-xs font-bold text-red-300">⎋</span>
                  </div>
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            ) : null}
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
