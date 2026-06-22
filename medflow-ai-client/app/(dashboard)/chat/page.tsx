"use client";

import { useState } from "react";
import { useRequireRole } from "@/hooks/useRequireAuth";
import { ChatScreen } from "@/components/modules/dashboard/chat-screen";

export default function ChatPage() {
  useRequireRole(["patient", "doctor"]);

  const [selectedConversation, setSelectedConversation] = useState(0);

  return (
    <ChatScreen
      selectedConversation={selectedConversation}
      onConversationSelect={setSelectedConversation}
      onStartVideo={() => {}}
    />
  );
}
