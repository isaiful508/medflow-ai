"use client";

import { useRouter } from "next/navigation";
import {
  appointments,
  notifications,
  profileVitals,
  statCards,
} from "@/lib/medflow-ai-data";
import {
  Avatar,
  CardHeader,
  GlassCard,
  QuickActionButton,
  StatIcon,
  VitalIcon,
  toneClass,
} from "@/components/shared/ui-helpers";

export function DashboardScreen() {
  const router = useRouter();
  return (
    <div className="space-y-4">
      <div className="grid gap-3 xl:grid-cols-4">
        {statCards.map((card) => (
          <GlassCard key={card.label} className="p-5">
            <div className="flex items-center gap-3">
              <div className={`rounded-xl p-3 ${toneClass[card.tone]}`}>
                <StatIcon tone={card.tone} />
              </div>
              <p className="text-sm text-(--mc-text-60)">{card.label}</p>
            </div>
            <p className="mt-4 text-3xl font-semibold">{card.value}</p>
            <p className="mt-2 text-xs text-(--mc-text-50)">{card.change}</p>
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
                className="flex items-center gap-4 border-b border-(--mc-border) pb-3 last:border-b-0 last:pb-0"
              >
                <div className="min-w-14">
                  <p className="text-sm font-medium">{appointment.time}</p>
                  <p className="text-xs text-(--mc-text-40)">{appointment.day}</p>
                </div>
                <Avatar initials={appointment.initials} tone={appointment.tone} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{appointment.doctor}</p>
                  <p className="text-xs text-(--mc-text-40)">{appointment.specialty}</p>
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
                onClick={() => router.push("/ai-checker")}
              />
              <QuickActionButton
                label="Book Appt"
                tone="green"
                onClick={() => router.push("/appointments")}
              />
              <QuickActionButton
                label="Video Call"
                tone="purple"
                onClick={() => router.push("/video-call")}
              />
              <QuickActionButton
                label="Records"
                tone="amber"
                onClick={() => router.push("/profile")}
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
                <p className="text-xs text-(--mc-text-40)">Updated today</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {profileVitals.map((vital) => (
                <div key={vital.label} className="flex items-center gap-3 border-t border-(--mc-border) pt-3">
                  <div className={`rounded-lg p-2 ${toneClass[vital.tone]}`}>
                    <VitalIcon tone={vital.tone} />
                  </div>
                  <p className="flex-1 text-sm text-(--mc-text-60)">{vital.label}</p>
                  <p className="text-sm font-medium">{vital.value}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      <GlassCard>
        <div className="flex items-center justify-between border-b border-(--mc-border) px-5 py-4">
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
                <p className="text-sm leading-6 text-(--mc-text-60)">
                  <strong className="font-semibold text-(--mc-fg)">{item.title}</strong>{" "}
                  {item.body}
                </p>
                <p className="mt-1 text-xs text-(--mc-text-30)">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
