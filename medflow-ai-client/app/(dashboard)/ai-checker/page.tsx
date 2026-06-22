"use client";

import { useState } from "react";
import {
  aiChips,
  aiStarterMessages,
  type MessageItem,
} from "@/lib/medflow-ai-data";
import { useRequireRole } from "@/hooks/useRequireAuth";
import { AiCheckerScreen } from "@/components/modules/dashboard/ai-checker-screen";

export default function AiCheckerPage() {
  useRequireRole(["patient"]);

  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState<MessageItem[]>([
    ...aiStarterMessages,
  ]);

  const sendAiMessage = () => {
    const value = aiInput.trim();
    if (!value) return;

    setAiMessages((prev) => [
      ...prev,
      { role: "user", text: value, meta: "You · now" },
      {
        role: "ai",
        text: "Thanks. I've added that to your symptom log. Based on this updated input, I'd recommend hydration, rest, and a doctor consultation if symptoms persist or worsen.",
        meta: "MedflowAI · now",
      },
    ]);
    setAiInput("");
  };

  return (
    <AiCheckerScreen
      aiMessages={aiMessages}
      aiInput={aiInput}
      onAiInputChange={setAiInput}
      onAiSubmit={sendAiMessage}
      onChipClick={setAiInput}
      onBook={() => {}}
    />
  );
}
