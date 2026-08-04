"use client";

import { AlertTriangle, Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

export type OneTimeCredentials = {
  email: string;
  password: string;
};

interface CredentialsRevealModalProps {
  credentials: OneTimeCredentials;
  roleLabel: string; // e.g. "doctor", "patient" — used in copy text only
  // Parent should set credentials state back to null here,
  // so this data is unreachable after close — no "view again" path.
  onClose: () => void;
}

export function CredentialsRevealModal({ credentials, roleLabel, onClose }: CredentialsRevealModalProps) {
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleCopy = async () => {
    const text = `Email: ${credentials.email}\nPassword: ${credentials.password}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && confirmed) onClose();
      }}
      title="Save these credentials now"
      description={`This is the only time the ${roleLabel}'s password will be shown. It cannot be retrieved again — only reset.`}
      footer={
        <Button type="button" className="w-full" disabled={!confirmed} onClick={onClose} variant="outline">
          Done — close and clear
        </Button>
      }
    >
      <div className="mt-4 flex items-center gap-2 text-amber-500">
        <AlertTriangle className="size-4" />
        <span className="text-xs font-medium">Copy this now — it won&apos;t be shown again</span>
      </div>

      <div className="mt-3 space-y-2 rounded-xl border border-(--mc-border) bg-black/5 p-3 text-sm">
        <div className="flex justify-between gap-2">
          <span className="text-(--mc-text-40)">Email</span>
          <span className="font-mono">{credentials.email}</span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-(--mc-text-40)">Password</span>
          <span className="font-mono">{credentials.password}</span>
        </div>
      </div>

      <Button type="button" className="mt-4 w-full" onClick={handleCopy} variant={copied ? "outline" : "default"}>
        {copied ? (
          <>
            <Check className="size-4" /> Copied
          </>
        ) : (
          <>
            <Copy className="size-4" /> Copy email & password
          </>
        )}
      </Button>

      <label className="mt-4 flex items-start gap-2 text-xs text-(--mc-text-40)">
        <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-0.5" />
        I&apos;ve copied and securely saved these credentials.
      </label>
    </Dialog>
  );
}