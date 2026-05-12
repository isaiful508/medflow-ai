"use client";

import {
  Activity,
  Bell,
  Bot,
  Calendar,
  Camera,
  ChartNoAxesColumn,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Clock3,
  FileText,
  HeartPulse,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Mic,
  MicOff,
  Moon,
  MonitorUp,
  MoreVertical,
  Phone,
  Search,
  Send,
  Star,
  Stethoscope,
  SunMedium,
  Thermometer,
  Video,
  VideoOff,
} from "lucide-react";
import { startTransition, useEffect, useMemo, useState } from "react";

import {
  aiChips,
  aiStarterMessages,
  appointments,
  assessmentSummary,
  calendarDays,
  chatConversations,
  chatMessages,
  daysWithSlots,
  doctors,
  navItems,
  notifications,
  profileVitals,
  recentPatients,
  statCards,
  timeSlotsByDay,
  type DoctorItem,
  type MessageItem,
  type PatientItem,
  type ScreenId,
} from "@/lib/mediconnect-data";

const navIcons = {
  dashboard: LayoutDashboard,
  "ai-checker": Bot,
  appointments: Calendar,
  "video-call": Video,
  chat: MessageSquare,
  profile: CircleUserRound,
  analytics: ChartNoAxesColumn,
} as const;

const toneClass = {
  blue: "bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30",
  green: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30",
  amber: "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30",
  purple: "bg-violet-500/15 text-violet-400 ring-1 ring-violet-500/30",
  red: "bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30",
} as const;

const avatarTone = {
  blue: "from-blue-500 to-sky-400",
  green: "from-emerald-500 to-lime-400",
  amber: "from-orange-500 to-amber-400",
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

  const confirmDoctor = doctors[selectedDoctor] ?? doctors[0];

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    window.localStorage.setItem("mediconnect-theme", nextTheme);
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
        meta: "MediAI · now",
      },
    ]);
    setAiInput("");
  };

  return (
    <main
      data-theme={theme}
      className="mediconnect-shell flex min-h-screen text-white"
    >
      <div className="mediconnect-bg pointer-events-none fixed inset-0 opacity-100">
        <div className="mediconnect-orbs absolute inset-0" />
        <div className="mediconnect-grid absolute inset-0 bg-[size:40px_40px]" />
      </div>

      <aside
        className={`mediconnect-sidebar relative z-10 hidden shrink-0 border-r border-white/10 backdrop-blur-2xl transition-all duration-300 md:flex md:flex-col ${
          collapsed ? "w-[72px]" : "w-[240px]"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-sky-400">
            <HeartPulse className="size-4" />
          </div>
          {!collapsed ? (
            <div className="min-w-0">
              <p className="text-sm font-semibold tracking-wide">Medi<span className="text-sky-400">Connect</span></p>
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
          <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-white/5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-indigo-400 text-xs font-semibold">
              SJ
            </div>
            {!collapsed ? (
              <div>
                <p className="text-sm font-medium">Sarah Johnson</p>
                <p className="text-[11px] text-white/40">Patient</p>
              </div>
            ) : null}
          </div>
        </div>
      </aside>

      <section className="relative z-10 flex min-h-screen flex-1 flex-col overflow-hidden">
        <header className="mediconnect-topbar flex h-14 items-center gap-4 border-b border-white/10 px-4 backdrop-blur-2xl md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCollapsed((prev) => !prev)}
              className="rounded-lg p-2 text-white/60 hover:bg-white/5 hover:text-white md:hidden"
            >
              <Menu className="size-4" />
            </button>
            <h1 className="text-sm font-medium md:text-base">{pageTitle}</h1>
          </div>

          <div className="mediconnect-input ml-auto flex w-full max-w-sm items-center gap-2 rounded-full border border-white/10 px-4 py-2">
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
            className="mediconnect-toggle relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/70 transition hover:text-white"
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
            <span className="mediconnect-notif-ring absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full border-2 bg-rose-500" />
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

function DashboardScreen({
  onQuickAction,
}: {
  onQuickAction: (screen: ScreenId) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 xl:grid-cols-4">
        {statCards.map((card) => (
          <GlassCard key={card.label} className="p-5">
            <div className="flex items-center gap-3">
              <div className={`rounded-xl p-3 ${toneClass[card.tone]}`}>
                <StatIcon tone={card.tone} />
              </div>
              <p className="text-sm text-white/60">{card.label}</p>
            </div>
            <p className="mt-4 text-3xl font-semibold">{card.value}</p>
            <p className="mt-2 text-xs text-white/50">{card.change}</p>
          </GlassCard>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.55fr_1fr]">
        <GlassCard>
          <CardHeader title="Upcoming Appointments" action="See all →" />
          <div className="space-y-3 p-5">
            {appointments.map((appointment) => (
              <div
                key={`${appointment.doctor}-${appointment.time}`}
                className="flex items-center gap-4 border-b border-white/8 pb-3 last:border-b-0 last:pb-0"
              >
                <div className="min-w-14">
                  <p className="text-sm font-medium">{appointment.time}</p>
                  <p className="text-xs text-white/40">{appointment.day}</p>
                </div>
                <Avatar initials={appointment.initials} tone={appointment.tone} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{appointment.doctor}</p>
                  <p className="text-xs text-white/45">{appointment.specialty}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs ${toneClass[appointment.tone]}`}>
                  {appointment.mode}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="space-y-4">
          <GlassCard className="p-5">
            <p className="mb-4 text-sm font-medium">Quick Actions</p>
            <div className="grid grid-cols-2 gap-3">
              <QuickActionButton
                label="AI Check"
                tone="blue"
                onClick={() => onQuickAction("ai-checker")}
              />
              <QuickActionButton
                label="Book Appt"
                tone="green"
                onClick={() => onQuickAction("appointments")}
              />
              <QuickActionButton
                label="Video Call"
                tone="purple"
                onClick={() => onQuickAction("video-call")}
              />
              <QuickActionButton
                label="Records"
                tone="amber"
                onClick={() => onQuickAction("profile")}
              />
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <p className="text-sm font-medium">Health Score</p>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex h-18 w-18 items-center justify-center rounded-full border-4 border-emerald-400/50 text-lg font-semibold text-emerald-400">
                87
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-400">Good Health</p>
                <p className="text-xs text-white/40">Updated today</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {profileVitals.map((vital) => (
                <div key={vital.label} className="flex items-center gap-3 border-t border-white/8 pt-3">
                  <div className={`rounded-lg p-2 ${toneClass[vital.tone]}`}>
                    <VitalIcon tone={vital.tone} />
                  </div>
                  <p className="flex-1 text-sm text-white/65">{vital.label}</p>
                  <p className="text-sm font-medium">{vital.value}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      <GlassCard>
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <p className="text-sm font-medium">Recent Notifications</p>
          <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs text-blue-400 ring-1 ring-blue-500/30">
            4 new
          </span>
        </div>
        <div className="grid gap-4 p-5 xl:grid-cols-3">
          {notifications.map((item) => (
            <div key={item.body} className="flex gap-3">
              <div
                className={`mt-1 h-2.5 w-2.5 rounded-full ${
                  item.tone === "blue"
                    ? "bg-blue-500"
                    : item.tone === "green"
                      ? "bg-emerald-500"
                      : "bg-amber-500"
                }`}
              />
              <div>
                <p className="text-sm leading-6 text-white/65">
                  <strong className="font-semibold text-white">{item.title}</strong>{" "}
                  {item.body}
                </p>
                <p className="mt-1 text-xs text-white/35">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function AiCheckerScreen({
  aiMessages,
  aiInput,
  onAiInputChange,
  onAiSubmit,
  onChipClick,
  onBook,
}: {
  aiMessages: MessageItem[];
  aiInput: string;
  onAiInputChange: (value: string) => void;
  onAiSubmit: () => void;
  onChipClick: (value: string) => void;
  onBook: () => void;
}) {
  return (
    <div className="grid h-[calc(100vh-7.5rem)] gap-4 xl:grid-cols-[1fr_240px]">
      <GlassCard className="flex min-h-0 flex-col overflow-hidden">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <div className="rounded-full bg-blue-500/20 p-3 text-blue-400">
            <Bot className="size-4" />
          </div>
          <div>
            <p className="text-sm font-medium">MediAI Assistant</p>
            <p className="text-xs text-emerald-400">Online · HIPAA compliant</p>
          </div>
          <span className="ml-auto rounded-full bg-blue-500/15 px-3 py-1 text-xs text-blue-400 ring-1 ring-blue-500/30">
            AI powered
          </span>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {aiMessages.map((message, index) => (
            <div
              key={`${message.meta}-${index}`}
              className={`flex flex-col gap-1 ${
                message.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.role === "user"
                    ? "rounded-br-sm bg-blue-600 text-white"
                    : "rounded-bl-sm bg-white/8 text-white/85"
                }`}
              >
                {message.text}
              </div>
              <p className="text-[11px] text-white/35">{message.meta}</p>
            </div>
          ))}
          <div className="inline-flex items-center gap-2 rounded-2xl rounded-bl-sm bg-white/8 px-4 py-3">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40 [animation-delay:120ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40 [animation-delay:240ms]" />
          </div>
        </div>

        <div className="border-t border-white/10 px-4 py-3">
          <div className="mb-3 flex flex-wrap gap-2">
            {aiChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => onChipClick(chip)}
                className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10"
              >
                {chip}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="rounded-full p-2 text-white/50 hover:bg-white/5 hover:text-white">
              <Mic className="size-4" />
            </button>
            <input
              value={aiInput}
              onChange={(event) => onAiInputChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") onAiSubmit();
              }}
              placeholder="Describe your symptoms..."
              className="h-11 flex-1 rounded-full border border-white/10 bg-white/6 px-4 text-sm text-white outline-none placeholder:text-white/35"
            />
            <button
              type="button"
              onClick={onAiSubmit}
              className="rounded-full bg-blue-600 p-3 text-white shadow-lg shadow-blue-950/60"
            >
              <Send className="size-4" />
            </button>
          </div>
        </div>
      </GlassCard>

      <div className="space-y-4">
        <GlassCard className="p-5">
          <p className="mb-4 text-sm font-medium">Assessment Summary</p>
          <div className="space-y-4">
            {assessmentSummary.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>{item.label}</span>
                  <span className="text-white/45">{item.value}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/8">
                  <div
                    className={`h-1.5 rounded-full ${
                      item.tone === "amber"
                        ? "bg-amber-400"
                        : item.tone === "red"
                          ? "bg-rose-400"
                          : "bg-blue-500"
                    }`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-5">
          <p className="text-sm font-medium text-amber-300">Urgency: Moderate</p>
          <p className="mt-2 text-sm leading-6 text-amber-100/75">
            Monitor symptoms. See a doctor if no improvement in 3 days.
          </p>
        </div>

        <GlassCard className="p-5">
          <p className="mb-4 text-sm font-medium">Symptoms Logged</p>
          <div className="space-y-2 text-sm text-white/65">
            {["Persistent headache", "Fatigue", "Light sensitivity", "Temple pain"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-emerald-500/15 text-center text-xs leading-5 text-emerald-400">
                  ✓
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <button
          type="button"
          onClick={onBook}
          className="w-full rounded-xl bg-linear-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-medium shadow-lg shadow-blue-950/60"
        >
          Book Specialist →
        </button>
      </div>
    </div>
  );
}

function AppointmentsScreen({
  doctorsList,
  selectedDoctor,
  onDoctorSelect,
  selectedDay,
  onDaySelect,
  selectedTime,
  onTimeSelect,
  confirmDoctor,
  timeSlots,
}: {
  doctorsList: DoctorItem[];
  selectedDoctor: number;
  onDoctorSelect: (id: number) => void;
  selectedDay: string;
  onDaySelect: (day: string) => void;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  confirmDoctor: DoctorItem;
  timeSlots: { label: string; taken?: boolean }[];
}) {
  return (
    <div className="space-y-4">
      <GlassCard>
        <CardHeader title="Find a Doctor" />
        <div className="grid gap-3 p-5 md:grid-cols-2 xl:grid-cols-3">
          {doctorsList.map((doctor) => (
            <button
              key={doctor.id}
              type="button"
              onClick={() => onDoctorSelect(doctor.id)}
              className={`relative rounded-2xl border px-5 py-5 text-center transition ${
                selectedDoctor === doctor.id
                  ? "border-blue-500 bg-blue-500/12"
                  : "border-white/10 bg-white/3 hover:border-blue-500/40 hover:bg-blue-500/5"
              }`}
            >
              {selectedDoctor === doctor.id ? (
                <span className="absolute top-3 right-3 rounded-full bg-blue-600 p-1 text-white">
                  <CheckMini />
                </span>
              ) : null}
              <Avatar initials={doctor.initials} tone={doctor.tone} size="md" center />
              <p className="mt-3 text-sm font-medium">{doctor.name}</p>
              <p className="text-xs text-white/45">{doctor.specialty}</p>
              <div className="mt-3 flex items-center justify-center gap-1 text-amber-300">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className="size-3 fill-current"
                    opacity={index < doctor.rating ? 1 : 0.25}
                  />
                ))}
              </div>
              <p className="mt-2 text-xs text-emerald-400">{doctor.availability}</p>
            </button>
          ))}
        </div>
      </GlassCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <GlassCard>
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <button type="button" className="text-white/50 hover:text-white">
              <ChevronLeft className="size-4" />
            </button>
            <p className="text-sm font-medium">April 2026</p>
            <button type="button" className="text-white/50 hover:text-white">
              <ChevronRight className="size-4" />
            </button>
          </div>
          <div className="p-5">
            <div className="mb-3 grid grid-cols-7 gap-2 text-center text-xs text-white/35">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, index) =>
                day ? (
                  <button
                    key={`${day}-${index}`}
                    type="button"
                    onClick={() => {
                      if (daysWithSlots.has(day)) onDaySelect(day);
                    }}
                    className={`relative rounded-lg px-2 py-2 text-sm transition ${
                      selectedDay === day
                        ? "bg-blue-600 text-white"
                        : daysWithSlots.has(day)
                          ? "bg-white/4 text-white/80 hover:bg-blue-500/12 hover:text-blue-300"
                          : "bg-transparent text-white/25"
                    }`}
                  >
                    {day}
                    {daysWithSlots.has(day) ? (
                      <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-emerald-400" />
                    ) : null}
                  </button>
                ) : (
                  <span key={`empty-${index}`} />
                ),
              )}
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-white/35">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Available slots
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <CardHeader title={`Available Times — Apr ${selectedDay}`} />
          <div className="p-5">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {timeSlots.map((slot) => (
                <button
                  key={slot.label}
                  type="button"
                  onClick={() => {
                    if (!slot.taken) onTimeSelect(slot.label);
                  }}
                  className={`rounded-xl border px-3 py-2 text-sm transition ${
                    slot.taken
                      ? "cursor-not-allowed border-white/5 bg-white/3 text-white/20 line-through"
                      : selectedTime === slot.label
                        ? "border-blue-500 bg-blue-600 text-white"
                        : "border-white/10 bg-white/4 text-white/70 hover:border-blue-500/50 hover:text-blue-300"
                  }`}
                >
                  {slot.label}
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-blue-500/30 bg-blue-500/12 p-4">
              <p className="text-xs text-white/45">Selected appointment</p>
              <p className="mt-1 text-sm font-medium">{confirmDoctor.name}</p>
              <p className="text-sm text-blue-300">{`Tue, Apr ${selectedDay} · ${selectedTime} · Video Call`}</p>
            </div>

            <button
              type="button"
              className="mt-5 w-full rounded-xl bg-linear-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-medium shadow-lg shadow-blue-950/60"
            >
              Confirm Booking →
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function VideoCallScreen({
  micMuted,
  camOff,
  onMicToggle,
  onCamToggle,
  onEnd,
}: {
  micMuted: boolean;
  camOff: boolean;
  onMicToggle: () => void;
  onCamToggle: () => void;
  onEnd: () => void;
}) {
  return (
    <div className="grid h-[calc(100vh-7.5rem)] gap-4 xl:grid-cols-[1fr_240px]">
      <div className="overflow-hidden rounded-3xl border border-white/10">
        <div className="relative flex h-full min-h-[560px] flex-col items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.2),transparent_35%),linear-gradient(180deg,#0f172a_0%,#020617_100%)]">
          <Avatar initials="PK" tone="green" size="xl" center />
          <p className="mt-4 text-lg font-medium text-white/80">Dr. Priya Kapoor</p>
          <p className="text-sm text-white/35">Neurologist · Connected</p>
          <div className="absolute top-5 right-5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-rose-500" />
            08:24
          </div>
          <div className="absolute right-5 bottom-28 rounded-2xl border border-white/10 bg-white/8 p-3">
            <Avatar initials="SJ" tone="blue" size="sm" center />
          </div>
          <div className="absolute bottom-6 flex items-center gap-3">
            <CircleButton
              tone={micMuted ? "danger" : "normal"}
              onClick={onMicToggle}
              icon={micMuted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
            />
            <CircleButton
              tone="normal"
              onClick={onCamToggle}
              icon={camOff ? <VideoOff className="size-4" /> : <Camera className="size-4" />}
            />
            <CircleButton tone="normal" icon={<MonitorUp className="size-4" />} />
            <CircleButton tone="normal" icon={<MessageSquare className="size-4" />} />
            <CircleButton tone="end" onClick={onEnd} icon={<Phone className="size-4" />} />
          </div>
        </div>
      </div>

      <GlassCard className="flex min-h-0 flex-col overflow-hidden bg-[#060d1f]/90">
        <div className="border-b border-white/10 px-4 py-4 text-sm font-medium text-white/70">
          In-call Chat
        </div>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
          <p className="text-center text-xs text-white/30">Session started</p>
          <MiniChatBubble who="Dr. Kapoor" text="Good morning Sarah! How are you feeling today?" />
          <MiniChatBubble who="You" text="Hi Doctor! The headache is a bit better today." self />
          <MiniChatBubble who="Dr. Kapoor" text="I'll share your scan results on screen shortly." />
        </div>
        <div className="flex items-center gap-2 border-t border-white/10 px-4 py-3">
          <input
            placeholder="Message..."
            className="h-10 flex-1 rounded-full border border-white/10 bg-white/6 px-4 text-sm outline-none placeholder:text-white/30"
          />
          <button type="button" className="rounded-full bg-blue-600 p-3 text-white">
            <Send className="size-4" />
          </button>
        </div>
      </GlassCard>
    </div>
  );
}

function ChatScreen({
  selectedConversation,
  onConversationSelect,
  onStartVideo,
}: {
  selectedConversation: number;
  onConversationSelect: (id: number) => void;
  onStartVideo: () => void;
}) {
  return (
    <div className="grid h-[calc(100vh-7.5rem)] gap-4 xl:grid-cols-[240px_1fr]">
      <GlassCard className="flex min-h-0 flex-col overflow-hidden">
        <div className="border-b border-white/10 px-4 py-4 text-sm font-medium text-white/70">
          Messages
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {chatConversations.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              onClick={() => onConversationSelect(conversation.id)}
              className={`flex w-full items-center gap-3 border-b border-white/6 px-4 py-4 text-left transition last:border-b-0 ${
                selectedConversation === conversation.id
                  ? "bg-blue-500/12"
                  : "hover:bg-white/4"
              }`}
            >
              <div className="relative">
                <Avatar initials={conversation.initials} tone={conversation.tone} size="sm" center />
                {conversation.online ? (
                  <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-[#060d1f] bg-emerald-400" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{conversation.name}</p>
                <p className="truncate text-xs text-white/45">{conversation.preview}</p>
              </div>
              {conversation.unread ? (
                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                  {conversation.unread}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="flex min-h-0 flex-col overflow-hidden">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <div className="relative">
            <Avatar initials="PK" tone="green" size="sm" center />
            <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-[#060d1f] bg-emerald-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Dr. Priya Kapoor</p>
            <p className="text-xs text-emerald-400">Online</p>
          </div>
          <button type="button" className="text-white/55 hover:text-white">
            <Phone className="size-4" />
          </button>
          <button type="button" onClick={onStartVideo} className="text-white/55 hover:text-white">
            <Video className="size-4" />
          </button>
          <button type="button" className="text-white/55 hover:text-white">
            <MoreVertical className="size-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <p className="mb-4 text-center text-xs text-white/30">Today · Apr 19</p>
          {chatMessages.map((message, index) => (
            <div
              key={`${message.meta}-${index}`}
              className={`mb-4 flex flex-col gap-1 ${
                message.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.role === "user"
                    ? "rounded-br-sm bg-blue-600"
                    : "rounded-bl-sm bg-white/8 text-white/85"
                }`}
              >
                {message.text}
              </div>
              <p className="text-[11px] text-white/35">{message.meta}</p>
            </div>
          ))}
          <div className="inline-flex items-center gap-2 rounded-2xl rounded-bl-sm bg-white/8 px-4 py-3 text-sm text-white/45">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40 [animation-delay:120ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40 [animation-delay:240ms]" />
            <span className="ml-1 text-[11px]">Dr. Kapoor is typing...</span>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-white/10 px-4 py-3">
          <button type="button" className="rounded-full p-2 text-white/50 hover:bg-white/5 hover:text-white">
            <FileText className="size-4" />
          </button>
          <input
            placeholder="Type a message..."
            className="h-11 flex-1 rounded-full border border-white/10 bg-white/6 px-4 text-sm outline-none placeholder:text-white/30"
          />
          <button type="button" className="rounded-full bg-blue-600 p-3 text-white">
            <Send className="size-4" />
          </button>
        </div>
      </GlassCard>
    </div>
  );
}

function ProfileScreen({
  profileTab,
  onTabChange,
}: {
  profileTab: "info" | "history" | "vitals";
  onTabChange: (tab: "info" | "history" | "vitals") => void;
}) {
  return (
    <div className="space-y-4">
      <GlassCard className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Avatar initials="SJ" tone="blue" size="lg" center />
          <div className="flex-1">
            <h2 className="text-xl font-semibold">Sarah Johnson</h2>
            <p className="mt-1 text-sm text-white/45">
              Patient ID: #MED-2024-00142 · DOB: Mar 15, 1988
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-400 ring-1 ring-emerald-500/30">
                A+ Blood Type
              </span>
              <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs text-blue-400 ring-1 ring-blue-500/30">
                No Allergies
              </span>
              <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs text-violet-400 ring-1 ring-violet-500/30">
                Non-smoker
              </span>
            </div>
          </div>
          <button type="button" className="rounded-xl border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/70">
            Edit Profile
          </button>
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden">
        <div className="flex border-b border-white/10">
          {[
            { id: "info", label: "Personal Information" },
            { id: "history", label: "Medical History" },
            { id: "vitals", label: "Latest Vitals" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id as "info" | "history" | "vitals")}
              className={`border-b-2 px-5 py-4 text-sm transition ${
                profileTab === tab.id
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-white/50 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {profileTab === "info" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <ProfileField label="Full Name" value="Sarah Johnson" />
              <ProfileField label="Email" value="sarah.johnson@example.com" />
              <ProfileField label="Phone" value="+1 (555) 302-1123" />
              <ProfileField label="Address" value="742 Evergreen Terrace, Denver, CO" />
            </div>
          ) : null}

          {profileTab === "history" ? (
            <div className="space-y-4">
              <HistoryItem title="Recurring migraines" desc="Observed over the last 8 months. Managed with hydration and rest guidance." />
              <HistoryItem title="Annual physical completed" desc="Most recent physical: March 2026. All base panels within normal range." />
              <HistoryItem title="Medications" desc="Paracetamol as needed, Vitamin D supplements." />
            </div>
          ) : null}

          {profileTab === "vitals" ? (
            <div className="space-y-4">
              {profileVitals.map((vital) => (
                <div key={vital.label} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/4 px-4 py-4">
                  <div className={`rounded-xl p-3 ${toneClass[vital.tone]}`}>
                    <VitalIcon tone={vital.tone} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white/55">{vital.label}</p>
                    <p className="text-lg font-semibold">{vital.value}</p>
                  </div>
                  <p className="text-xs text-white/30">Apr 19, 2026</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </GlassCard>
    </div>
  );
}

function AnalyticsScreen({
  patients,
}: {
  patients: PatientItem[];
}) {
  const bars = [48, 62, 55, 80, 72, 66, 74];
  const specialties = [
    { label: "Neurology", value: 42, tone: "blue" },
    { label: "Cardiology", value: 31, tone: "green" },
    { label: "Dermatology", value: 27, tone: "amber" },
  ] as const;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <GlassCard>
          <CardHeader title="Consultations — Last 7 Days" />
          <div className="flex h-72 items-end gap-3 px-5 pt-6 pb-5">
            {bars.map((value, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-3">
                <div className="w-full rounded-t-2xl bg-linear-to-t from-blue-700 to-sky-400" style={{ height: `${value * 2.2}px` }} />
                <span className="text-xs text-white/35">{["M", "T", "W", "T", "F", "S", "S"][index]}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <p className="text-sm font-medium">By Specialty</p>
          <div className="mt-5 space-y-4">
            {specialties.map((specialty) => (
              <div key={specialty.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>{specialty.label}</span>
                  <span className="text-white/45">{specialty.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/8">
                  <div
                    className={`h-2 rounded-full ${
                      specialty.tone === "blue"
                        ? "bg-blue-500"
                        : specialty.tone === "green"
                          ? "bg-emerald-500"
                          : "bg-amber-400"
                    }`}
                    style={{ width: `${specialty.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <p className="text-sm font-medium">Recent Patients</p>
          <span className="text-xs text-white/35">Search filters this list</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="text-xs text-white/35">
              <tr>
                <th className="px-5 py-4 font-medium">Patient</th>
                <th className="px-5 py-4 font-medium">Issue</th>
                <th className="px-5 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.name} className="border-t border-white/8">
                  <td className="px-5 py-4">{patient.name}</td>
                  <td className="px-5 py-4 text-white/60">{patient.issue}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        patient.status === "Active"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : patient.status === "Pending"
                            ? "bg-amber-500/15 text-amber-400"
                            : "bg-white/8 text-white/60"
                      }`}
                    >
                      {patient.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mediconnect-card rounded-3xl border border-white/10 bg-white/6 backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

function CardHeader({
  title,
  action,
}: {
  title: string;
  action?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
      <p className="text-sm font-medium">{title}</p>
      {action ? <button className="text-xs text-blue-400">{action}</button> : null}
    </div>
  );
}

function QuickActionButton({
  label,
  tone,
  onClick,
}: {
  label: string;
  tone: keyof typeof toneClass;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl px-3 py-4 text-sm font-medium transition hover:scale-[1.01] ${toneClass[tone]}`}
    >
      {label}
    </button>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-white/35">{label}</p>
      <p className="mt-2 text-sm text-white/85">{value}</p>
    </div>
  );
}

function HistoryItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-2 text-sm leading-6 text-white/55">{desc}</p>
    </div>
  );
}

function MiniChatBubble({
  who,
  text,
  self,
}: {
  who: string;
  text: string;
  self?: boolean;
}) {
  return (
    <div className={self ? "text-right" : ""}>
      <p className={`mb-1 text-[11px] ${self ? "text-white/35" : "text-blue-300"}`}>
        {who}
      </p>
      <div
        className={`inline-block max-w-full rounded-2xl px-3 py-2 text-sm leading-6 ${
          self ? "bg-blue-600 text-white" : "bg-white/8 text-white/80"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

function CircleButton({
  icon,
  tone = "normal",
  onClick,
}: {
  icon: React.ReactNode;
  tone?: "normal" | "danger" | "end";
  onClick?: () => void;
}) {
  const toneStyles =
    tone === "danger"
      ? "bg-rose-500/15 text-rose-400"
      : tone === "end"
        ? "bg-rose-500 text-white"
        : "bg-white/10 text-white/80";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-11 w-11 items-center justify-center rounded-full transition hover:scale-[1.03] ${toneStyles}`}
    >
      {icon}
    </button>
  );
}

function Avatar({
  initials,
  tone,
  size,
  center,
}: {
  initials: string;
  tone: keyof typeof avatarTone;
  size: "sm" | "md" | "lg" | "xl";
  center?: boolean;
}) {
  const sizes = {
    sm: "h-9 w-9 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-16 w-16 text-lg",
    xl: "h-20 w-20 text-2xl",
  };

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-linear-to-br ${avatarTone[tone]} font-semibold text-white ${sizes[size]} ${center ? "mx-auto" : ""}`}
    >
      {initials}
    </div>
  );
}

function CheckMini() {
  return (
    <svg viewBox="0 0 12 12" className="h-3 w-3 fill-none stroke-current stroke-[2.5]">
      <path d="M2 6l2.2 2.2L10 3.5" />
    </svg>
  );
}

function StatIcon({ tone }: { tone: keyof typeof toneClass }) {
  if (tone === "blue") return <Calendar className="size-4" />;
  if (tone === "green") return <Activity className="size-4" />;
  if (tone === "amber") return <Clock3 className="size-4" />;
  return <FileText className="size-4" />;
}

function VitalIcon({ tone }: { tone: "red" | "blue" | "amber" }) {
  if (tone === "red") return <HeartPulse className="size-4" />;
  if (tone === "blue") return <Stethoscope className="size-4" />;
  return <Thermometer className="size-4" />;
}
