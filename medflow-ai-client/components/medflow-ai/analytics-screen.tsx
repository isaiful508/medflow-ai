"use client";

import { type PatientItem } from "@/lib/medflow-ai-data";
import { CardHeader, GlassCard } from "./ui-helpers";

export function AnalyticsScreen({
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
                    className={`h-2 rounded-full ${specialty.tone === "blue"
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
                      className={`rounded-full px-3 py-1 text-xs ${patient.status === "Active"
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
