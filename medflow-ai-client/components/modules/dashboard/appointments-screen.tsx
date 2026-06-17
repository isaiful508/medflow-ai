"use client";

import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import {
  calendarDays,
  daysWithSlots,
  type DoctorItem,
} from "@/lib/medflow-ai-data";
import { Avatar, CardHeader, CheckMini, GlassCard } from "@/components/shared/ui-helpers";

export function AppointmentsScreen({
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
