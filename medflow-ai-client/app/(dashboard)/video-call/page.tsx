"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VideoCallScreen } from "@/components/modules/dashboard/video-call-screen";

export default function VideoCallPage() {
  const router = useRouter();
  const [micMuted, setMicMuted] = useState(true);
  const [camOff, setCamOff] = useState(false);

  return (
    <VideoCallScreen
      micMuted={micMuted}
      camOff={camOff}
      onMicToggle={() => setMicMuted((prev) => !prev)}
      onCamToggle={() => setCamOff((prev) => !prev)}
      onEnd={() => router.push("/dashboard")}
    />
  );
}
