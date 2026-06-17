"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Bell,
  Bot,
  Calendar,
  ChartNoAxesColumn,
  CircleUserRound,
  HeartPulse,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Moon,
  Search,
  SunMedium,
  Video,
} from "lucide-react";
import { startTransition, useEffect, useMemo, useRef, useState } from "react";

import {
  aiStarterMessages,
  doctors,
  navItems,
  recentPatients,
  timeSlotsByDay,
  type MessageItem,
  type ScreenId,
} from "@/lib/medflow-ai-data";
import { getCurrentUser, logout } from "@/service/AuthService";

import { DashboardScreen } from "./dashboard-screen";
import { AiCheckerScreen } from "./ai-checker-screen";
import { AppointmentsScreen } from "./appointments-screen";
import { VideoCallScreen } from "./video-call-screen";
import { ChatScreen } from "./chat-screen";
import { ProfileScreen } from "./profile-screen";
import { AnalyticsScreen } from "./analytics-screen";

const navIcons = {
  dashboard: LayoutDashboard,
  "ai-checker": Bot,
  appointments: Calendar,
  "video-call": Video,
  chat: MessageSquare,
  profile: CircleUserRound,
  analytics: ChartNoAxesColumn,
} as const;

export function DashboardShell() {
  const [screen, setScreen] = useState<ScreenId>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [query, setQuery] = useState("");
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState<MessageItem[]>([
    ...aiStarterMessages,
  ]);
  const [selectedDoctor, setSelectedDoctor] = useState(0);
  const [selectedDay, setSelectedDay] = useState("21");
  const [selectedTime, setSelectedTime] = useState("09:30");
  const [micMuted, setMicMuted] = useState(true);
  const [camOff, setCamOff] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(0);
  const [profileTab, setProfileTab] = useState<"info" | "history" | "vitals">(
    "info",
  );

  const pageTitle = navItems.find((item) => item.id === screen)?.label ?? "Dashboard";
  const timeSlots = timeSlotsByDay[selectedDay] ?? timeSlotsByDay["21"];

  const filteredDoctors = useMemo(() => {
    if (!query.trim()) return doctors;
    const q = query.toLowerCase();
    return doctors.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(q) ||
        doctor.specialty.toLowerCase().includes(q),
    );
  }, [query]);

  const filteredPatients = useMemo(() => {
    if (!query.trim()) return recentPatients;
    const q = query.toLowerCase();
    return recentPatients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(q) ||
        patient.issue.toLowerCase().includes(q),
    );
  }, [query]);

  useEffect(() => {
    const attrTheme = document.documentElement.getAttribute("data-theme");
    const resolvedTheme =
      attrTheme === "light" || attrTheme === "dark" ? attrTheme : "dark";

    if (resolvedTheme !== theme) {
      startTransition(() => {
        setTheme(resolvedTheme);
      });
    }
  }, [theme]);

  const router = useRouter();
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
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
    const rawRole = String(payload.role || payload.userRole || payload.access || "Patient")
      .trim();
    return rawRole
      ? `${rawRole.charAt(0).toUpperCase()}${rawRole.slice(1)}`
      : "Patient";
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

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser as Record<string, unknown> | null);
      setLoadingUser(false);
    };

    void loadUser();
  }, []);

  const confirmDoctor = doctors[selectedDoctor] ?? doctors[0];

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    window.localStorage.setItem("medflow-ai-theme", nextTheme);
  };

  const sendAiMessage = () => {
    const value = aiInput.trim();
    if (!value) return;

    setAiMessages((prev) => [
      ...prev,
      { role: "user", text: value, meta: "You · now" },
      {
        role: "ai",
        text: "Thanks. I’ve added that to your symptom log. Based on this updated input, I’d recommend hydration, rest, and a doctor consultation if symptoms persist or worsen.",
        meta: "MedflowAI · now",
      },
    ]);
    setAiInput("");
  };

  return (
    <main
      data-theme={theme}
      className="medflow-ai-shell flex min-h-screen text-white"
    >
      <div className="medflow-ai-bg pointer-events-none fixed inset-0 opacity-100">
        <div className="medflow-ai-orbs absolute inset-0" />
        <div className="medflow-ai-grid absolute inset-0 bg-[size:40px_40px]" />
      </div>

      <aside
        className={`medflow-ai-sidebar relative z-10 hidden shrink-0 border-r border-white/10 backdrop-blur-2xl transition-all duration-300 md:flex md:flex-col ${
          collapsed ? "w-[72px]" : "w-[240px]"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-sky-400">
            <HeartPulse className="size-4 text-white" />
          </div>
          {!collapsed ? (
            <div className="min-w-0">
              <p className="text-sm font-semibold tracking-wide">Medflow<span className="text-sky-400">AI</span></p>
              <p className="text-[11px] text-white/40">Telemedicine Platform</p>
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="ml-auto text-white/55 transition hover:text-white"
          >
            <Menu className="size-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
          {navItems.map((item) => {
            const Icon = navIcons[item.id];
            const active = item.id === screen;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setScreen(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                  active
                    ? "bg-blue-500/15 text-blue-400"
                    : "text-white/60 hover:bg-white/6 hover:text-white"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                {!collapsed ? <span>{item.label}</span> : null}
                {!collapsed && item.badge ? (
                  <span className="ml-auto rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          {!loadingUser ? (
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
        </div>
      </aside>

      <section className="relative z-10 flex min-h-screen flex-1 flex-col overflow-hidden">
        <header className="medflow-ai-topbar flex h-14 items-center gap-4 border-b border-white/10 px-4 backdrop-blur-2xl md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCollapsed((prev) => !prev)}
              className="rounded-lg p-2 text-white/60 hover:bg-white/5 hover:text-white md:hidden"
            >
              <Menu className="size-4" />
            </button>
            <h1 className="text-sm font-medium md:text-base text-white">{pageTitle}</h1>
          </div>

          <div className="medflow-ai-input ml-auto flex w-full max-w-sm items-center gap-2 rounded-full border border-white/10 px-4 py-2">
            <Search className="size-4 text-white/35" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search doctors, records, patients..."
              className="w-full bg-transparent text-sm text-white/80 outline-none placeholder:text-white/35"
            />
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="medflow-ai-toggle relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/70 transition hover:text-white"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <SunMedium className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </button>

          <button type="button" className="relative text-white/60 hover:text-white">
            <Bell className="size-5" />
            <span className="medflow-ai-notif-ring absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full border-2 bg-rose-500" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-5 md:px-6">
          {screen === "dashboard" ? (
            <DashboardScreen onQuickAction={setScreen} />
          ) : null}
          {screen === "ai-checker" ? (
            <AiCheckerScreen
              aiInput={aiInput}
              aiMessages={aiMessages}
              onAiInputChange={setAiInput}
              onAiSubmit={sendAiMessage}
              onChipClick={setAiInput}
              onBook={() => setScreen("appointments")}
            />
          ) : null}
          {screen === "appointments" ? (
            <AppointmentsScreen
              doctorsList={filteredDoctors}
              selectedDoctor={selectedDoctor}
              onDoctorSelect={setSelectedDoctor}
              selectedDay={selectedDay}
              onDaySelect={setSelectedDay}
              selectedTime={selectedTime}
              onTimeSelect={setSelectedTime}
              confirmDoctor={confirmDoctor}
              timeSlots={timeSlots}
            />
          ) : null}
          {screen === "video-call" ? (
            <VideoCallScreen
              micMuted={micMuted}
              camOff={camOff}
              onMicToggle={() => setMicMuted((prev) => !prev)}
              onCamToggle={() => setCamOff((prev) => !prev)}
              onEnd={() => setScreen("dashboard")}
            />
          ) : null}
          {screen === "chat" ? (
            <ChatScreen
              selectedConversation={selectedConversation}
              onConversationSelect={setSelectedConversation}
              onStartVideo={() => setScreen("video-call")}
            />
          ) : null}
          {screen === "profile" ? (
            <ProfileScreen profileTab={profileTab} onTabChange={setProfileTab} />
          ) : null}
          {screen === "analytics" ? (
            <AnalyticsScreen patients={filteredPatients} />
          ) : null}
        </div>
      </section>
    </main>
  );
}
