import {
  Activity,
  Calendar,
  Clock3,
  FileText,
  HeartPulse,
  Stethoscope,
  Thermometer,
} from "lucide-react";
import React from "react";

export const toneClass = {
  blue: "bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30",
  green: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30",
  amber: "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30",
  purple: "bg-violet-500/15 text-violet-400 ring-1 ring-violet-500/30",
  red: "bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30",
} as const;

export const avatarTone = {
  blue: "from-blue-500 to-sky-400",
  green: "from-emerald-500 to-lime-400",
  amber: "from-orange-500 to-amber-400",
} as const;

export function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`p-4 rounded-sm border border-(--mc-border) bg-(--mc-card) backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  action,
}: {
  title: string;
  action?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-(--mc-border) px-5 py-4">
      <p className="text-sm font-medium">{title}</p>
      {action ? <button className="text-xs text-(--mc-accent)">{action}</button> : null}
    </div>
  );
}

export function QuickActionButton({
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

export function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-(--mc-border) bg-(--mc-soft) p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-(--mc-text-30)">{label}</p>
      <p className="mt-2 text-sm text-(--mc-text-80)">{value}</p>
    </div>
  );
}

export function HistoryItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-(--mc-border) bg-(--mc-soft) p-4">
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-2 text-sm leading-6 text-(--mc-text-50)">{desc}</p>
    </div>
  );
}

export function MiniChatBubble({
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
      <p className={`mb-1 text-[11px] ${self ? "text-(--mc-text-30)" : "text-(--mc-accent)"}`}>
        {who}
      </p>
      <div
        className={`inline-block max-w-full rounded-2xl px-3 py-2 text-sm leading-6 ${
          self ? "bg-(--mc-accent) text-white" : "bg-(--mc-soft) text-(--mc-text-80)"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

export function CircleButton({
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
        : "bg-(--mc-soft) text-(--mc-text-80)";

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

export function Avatar({
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

export function CheckMini() {
  return (
    <svg viewBox="0 0 12 12" className="h-3 w-3 fill-none stroke-current stroke-[2.5]">
      <path d="M2 6l2.2 2.2L10 3.5" />
    </svg>
  );
}

export function StatIcon({ tone }: { tone: keyof typeof toneClass }) {
  if (tone === "blue") return <Calendar className="size-4" />;
  if (tone === "green") return <Activity className="size-4" />;
  if (tone === "amber") return <Clock3 className="size-4" />;
  return <FileText className="size-4" />;
}

export function VitalIcon({ tone }: { tone: "red" | "blue" | "amber" }) {
  if (tone === "red") return <HeartPulse className="size-4" />;
  if (tone === "blue") return <Stethoscope className="size-4" />;
  return <Thermometer className="size-4" />;
}
