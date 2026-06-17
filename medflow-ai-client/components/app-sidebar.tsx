"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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

import { logout } from "@/service/AuthService";
import { useUser } from "@/context/UserContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { navItems } from "@/lib/medflow-ai-data";

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
  screen,
  setScreen,
  collapsed,
  setCollapsed,
}: {
  screen: string;
  setScreen: (id: string) => void;
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}) {
  const router = useRouter();
  const { user, setUser, isLoading } = useUser();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const userName = useMemo(() => {
    if (!user || typeof user !== "object") return "Member";
    const payload = user as Record<string, unknown>;
    const fullName = payload.fullName || payload.name || payload.email || "Member";
    return String(fullName).trim() || "Member";
  }, [user]);

  const userRole = useMemo(() => {
    if (!user || typeof user !== "object") return "Patient";
    const payload = user as Record<string, unknown>;
    const rawRole = String(payload.role || payload.userRole || payload.access || "Patient").trim();
    return rawRole ? `${rawRole.charAt(0).toUpperCase()}${rawRole.slice(1)}` : "Patient";
  }, [user]);

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
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-sky-400">
          <HeartPulse className="size-4 text-white" />
        </div>
        {!collapsed ? (
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-wide">
              Medflow<span className="text-sky-400">AI</span>
            </p>
            <p className="text-[11px] text-white/40">Telemedicine Platform</p>
          </div>
        ) : null}
        <SidebarTrigger onClick={() => setCollapsed((prev) => !prev)}>
          <Menu className="size-4" />
        </SidebarTrigger>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {navItems.map((item) => {
            const Icon = navIcons[item.id];
            return (
              <SidebarMenuItem
                key={item.id}
                active={item.id === screen}
                onClick={() => setScreen(item.id)}
              >
                <Icon className="size-4 shrink-0" />
                {!collapsed ? <span>{item.label}</span> : null}
                {!collapsed && item.badge ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
              </SidebarMenuItem>
            );
          })}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {!isLoading && !user ? (
          <Link
            href="/login"
            className={`group relative flex items-center gap-3 rounded-2xl border border-white/15 bg-linear-to-br from-white/8 to-white/3 px-3 py-3 text-sm text-white/75 transition duration-300 hover:border-white/25 hover:bg-linear-to-br hover:from-white/12 hover:to-white/6 hover:text-white hover:shadow-lg hover:shadow-blue-500/10 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <div className="relative">
              <CircleUserRound className="size-5 text-white/70 transition group-hover:text-white" />
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
                  : "border-white/15 bg-linear-to-br from-white/8 to-white/3 hover:border-white/25 hover:bg-linear-to-br hover:from-white/12 hover:to-white/6 hover:shadow-lg hover:shadow-blue-500/10"
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
                  <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 via-blue-600 to-cyan-500 font-semibold text-white shadow-lg shadow-blue-500/30 ring-1 ring-white/20 transition group-hover:shadow-blue-500/50 group-hover:ring-white/40">
                    <span className="text-sm">{userInitials}</span>
                  </div>
                )}
                {!collapsed ? (
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{userName}</p>
                    <p className="text-[11px] text-white/50 transition group-hover:text-white/70">{userRole}</p>
                  </div>
                ) : null}
                {!collapsed ? (
                  <div className="flex items-center justify-center rounded-lg bg-white/5 p-1.5 transition group-hover:bg-white/10">
                    <Menu className="size-4 text-white/50 transition group-hover:text-white/70" />
                  </div>
                ) : null}
              </div>
            </button>

            {userMenuOpen ? (
              <div className="absolute left-0 bottom-full mb-3 w-full space-y-1 overflow-hidden rounded-2xl border border-white/15 bg-linear-to-b from-slate-900/80 to-slate-950/90 p-2 shadow-2xl shadow-slate-900/50 backdrop-blur-xl">
                <button
                  type="button"
                  onClick={() => {
                    setScreen("profile");
                    setUserMenuOpen(false);
                  }}
                  className="group/item flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-white/75 transition duration-300 hover:bg-linear-to-r hover:from-blue-500/20 hover:to-blue-600/10 hover:text-white"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 transition group-hover/item:bg-blue-500/30">
                    <CircleUserRound className="size-4 text-blue-300" />
                  </div>
                  <span className="font-medium">View Profile</span>
                </button>
                <div className="my-1 h-px bg-linear-to-r from-white/0 via-white/10 to-white/0" />
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    setUser(null);
                    setUserMenuOpen(false);
                    router.push("/login");
                  }}
                  className="group/item flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-white/75 transition duration-300 hover:bg-linear-to-r hover:from-red-500/20 hover:to-rose-600/10 hover:text-red-200"
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
