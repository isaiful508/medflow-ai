"use client";

import { Bot, Mic, Send } from "lucide-react";
import {
  aiChips,
  assessmentSummary,
  type MessageItem,
} from "@/lib/medflow-ai-data";
import { GlassCard } from "@/components/shared/ui-helpers";

export function AiCheckerScreen({
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
            <p className="text-sm font-medium">MedflowAI Assistant</p>
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
