import { useState, useEffect, useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to the `data-theme` attribute on `<html>` and localStorage changes.
 * Returns the current theme ("light" | "dark").
 *
 * The initial value is read from the DOM in `useEffect` so that the first
 * server-rendered frame never mismatches the client — the DOM attribute is
 * set by the blocking script in `layout.tsx` before React hydrates.
 */
function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  window.addEventListener("storage", callback);
  return () => {
    observer.disconnect();
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): "light" | "dark" {
  if (typeof document === "undefined") return "dark";
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "light" || attr === "dark" ? attr : "dark";
}

function getServerSnapshot(): "light" | "dark" {
  return "dark";
}

/**
 * Reusable theme hook that syncs with the global `data-theme` attribute
 * on `<html>` and persists changes to `localStorage`.
 *
 * Usage:
 *   const { theme, isDark, toggleTheme } = useTheme();
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = useCallback(() => {
    const next: "light" | "dark" = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("medflow-ai-theme", next);
    } catch {}
  }, [theme]);

  return {
    theme,
    isDark: theme === "dark",
    toggleTheme,
  } as const;
}
