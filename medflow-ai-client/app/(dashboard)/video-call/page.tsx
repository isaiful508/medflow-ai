"use client";

import { useState } from "react";
import { useRequireRole } from "@/hooks/useRequireAuth";
import { VideoCallScreen } from "@/components/modules/dashboard/video-call-screen";

export default function VideoCallPage() {
  useRequireRole(["patient", "doctor"]);

  const [micMuted, setMicMuted] = useState(true);
  const [camOff, setCamOff] = useState(false);

  return (
    <VideoCallScreen
      micMuted={micMuted}
      camOff={camOff}
      onMicToggle={() => setMicMuted((prev) => !prev)}
      onCamToggle={() => setCamOff((prev) => !prev)}
      onEnd={() => {}}
    />
  );
}
