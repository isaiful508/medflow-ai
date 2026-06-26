"use client";

import { useState } from "react";
import { Bell, Moon, Search, SunMedium } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export function Navbar({ pageTitle }: { pageTitle: string }) {
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState("");

  return (
    <header className="medflow-ai-topbar flex h-14 items-center gap-4 border-b border-white/10 px-4 backdrop-blur-2xl md:px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-medium md:text-base text-white">{pageTitle}</h1>
      </div>

      <div className="medflow-ai-input ml-auto flex w-full max-w-sm items-center gap-2 rounded-full border border-white/10 px-4 py-2">
        <Search className="size-4 text-white/35" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search doctors, records, patients..."
          className="w-full bg-transparent text-sm text-white/80 outline-none placeholder:text-white/35"
        />
      </div>

      <button
        type="button"
        onClick={toggleTheme}
        className="medflow-ai-toggle relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/70 transition hover:text-white"
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        {theme === "dark" ? (
          <SunMedium className="size-4" />
        ) : (
          <Moon className="size-4" />
        )}
      </button>

      <button type="button" className="relative text-white/60 hover:text-white">
        <Bell className="size-5" />
        <span className="medflow-ai-notif-ring absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full border-2 bg-rose-500" />
      </button>
    </header>
  );
}
