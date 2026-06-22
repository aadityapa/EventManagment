"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

function subscribe() {
  return () => {};
}

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={mounted ? (isDark ? "Switch to light theme" : "Switch to dark theme") : "Theme"}
      aria-hidden={!mounted}
      tabIndex={mounted ? 0 : -1}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "tap-target flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--gold)] transition-[opacity,transform,border-color,box-shadow] hover:border-[var(--gold)]/50 hover:shadow-[var(--glitz-glow)]",
        className
      )}
    >
      <span className="inline-flex h-4 w-4 items-center justify-center" aria-hidden>
        {mounted ? (isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />) : null}
      </span>
    </button>
  );
}
