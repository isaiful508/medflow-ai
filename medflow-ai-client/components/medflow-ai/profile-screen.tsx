"use client";

import { profileVitals } from "@/lib/medflow-ai-data";
import {
  Avatar,
  GlassCard,
  HistoryItem,
  ProfileField,
  VitalIcon,
  toneClass,
} from "./ui-helpers";

export function ProfileScreen({
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
