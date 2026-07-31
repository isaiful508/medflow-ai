"use client";

import { AlertTriangle, Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { DoctorCredentials } from "./types";

interface DoctorCredentialsModalProps {
  credentials: DoctorCredentials;
  // Parent should set credentials state back to null here,
  // so this data is unreachable after close — no "view again" path.
  onClose: () => void;
}

export function DoctorCredentialsModal({ credentials, onClose }: DoctorCredentialsModalProps) {
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleCopy = async () => {
    const text = `Email: ${credentials.email}\nPassword: ${credentials.password}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-3xl border border-(--mc-border) bg-(--mc-card) p-6 shadow-2xl">
        <div className="flex items-center gap-2 text-amber-500">
          <AlertTriangle className="size-5" />
          <p className="text-sm font-semibold">Save these credentials now</p>
        </div>
        <p className="mt-1 text-sm text-(--mc-text-40)">
          This is the only time the password will be shown. It cannot be retrieved again — only reset.
        </p>

        <div className="mt-4 space-y-2 rounded-xl border border-(--mc-border) bg-black/5 p-3 text-sm">
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
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5"
          />
          I&apos;ve copied and securely saved these credentials.
        </label>

        <Button type="button" className="mt-4 w-full" disabled={!confirmed} onClick={onClose} variant="outline">
          Done — close and clear
        </Button>
      </div>
    </div>
  );
}