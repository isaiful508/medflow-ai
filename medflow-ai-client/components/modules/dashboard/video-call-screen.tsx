"use client";

import {
  Camera,
  MessageSquare,
  Mic,
  MicOff,
  MonitorUp,
  Phone,
  Send,
  VideoOff,
} from "lucide-react";
import { Avatar, CircleButton, GlassCard, MiniChatBubble } from "@/components/shared/ui-helpers";

export function VideoCallScreen({
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
