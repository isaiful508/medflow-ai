"use client";

import { FileText, MoreVertical, Phone, Send, Video } from "lucide-react";
import { chatConversations, chatMessages } from "@/lib/medflow-ai-data";
import { Avatar, GlassCard } from "./ui-helpers";

export function ChatScreen({
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
