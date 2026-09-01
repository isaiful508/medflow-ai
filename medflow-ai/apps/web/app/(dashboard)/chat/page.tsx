"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChatScreen } from "@/components/modules/dashboard/chat-screen";

export default function ChatPage() {
  const router = useRouter();
  const [selectedConversation, setSelectedConversation] = useState(0);

  return (
    <ChatScreen
      selectedConversation={selectedConversation}
      onConversationSelect={setSelectedConversation}
      onStartVideo={() => router.push("/video-call")}
    />
  );
}
