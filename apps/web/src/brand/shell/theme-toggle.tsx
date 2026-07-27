"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   Nexyyra theme menu — one dropdown for day/night mode + curated palettes.
   Persisted as "mode|palette" in localStorage; a no-flash inline script in
   layout.tsx applies the saved value before first paint.
--------------------------------------------------------------------------- */

const STORAGE_KEY = "nexyyra-theme";

type Mode = "dark" | "light";
type PaletteId = "champagne" | "royal" | "emerald" | "rose";

const PALETTES: { id: PaletteId; label: string; swatch: [string, string] }[] = [
  { id: "champagne", label: "Champagne Gold", swatch: ["#d8b26a", "#8b4dff"] },
  { id: "royal", label: "Royal Amethyst", swatch: ["#b998ff", "#6f42ff"] },
  { id: "emerald", label: "Emerald Luxe", swatch: ["#57d6a4", "#0ea777"] },
  { id: "rose", label: "Rose Gold", swatch: ["#e8a7a2", "#d96e8f"] },
];

const MODES: { id: Mode; label: string }[] = [
  { id: "light", label: "Day" },
  { id: "dark", label: "Night" },
];

function readStored(): { mode: Mode; palette: PaletteId } {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const [m, p] = raw.split("|");
      return {
        mode: m === "light" ? "light" : "dark",
        palette: (PALETTES.some((x) => x.id === p) ? p : "champagne") as PaletteId,
      };
    }
  } catch {
    /* storage unavailable */
  }
  return { mode: "dark", palette: "champagne" };
}

/** Apply theme to <html> synchronously. Never throws. */
function applyTheme(mode: Mode, palette: PaletteId) {
  const el = document.documentElement;
  el.classList.remove("dark", "light");
  el.classList.add(mode);
  if (palette === "champagne") el.removeAttribute("data-palette");
  else el.setAttribute("data-palette", palette);
  try {
    window.localStorage.setItem(STORAGE_KEY, `${mode}|${palette}`);
  } catch {
    /* private mode */
  }
}

/** Brief global color transition so mode changes feel crafted, not abrupt. */
function withSmoothTransition(change: () => void, origin?: HTMLElement | null) {
  const el = document.documentElement;

  const reduced =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced) {
    change();
    return;
  }

  // Progressive enhancement: circular reveal where View Transitions exist.
  type VTDoc = Document & {
    startViewTransition?: (cb: () => void) => { ready: Promise<void> };
  };
  const vtStart = (document as VTDoc).startViewTransition?.bind(document);

  if (vtStart) {
    try {
      const rect = origin?.getBoundingClientRect();
      const x = rect ? rect.left + rect.width / 2 : window.innerWidth - 40;
      const y = rect ? rect.top + rect.height / 2 : 40;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );
      const vt = vtStart(change);
      vt.ready
        .then(() => {
          el.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
            { duration: 600, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" }
          );
        })
        .catch(() => undefined);
      return;
    } catch {
      /* fall through to CSS fallback */
    }
  }

  // Fallback: short global color transition.
  el.classList.add("theme-switching");
  change();
  window.setTimeout(() => el.classList.remove("theme-switching"), 450);
}

export function ThemeToggle({ className }: { className?: string }) {
  const [mode, setMode] = useState<Mode>("dark");
  const [palette, setPalette] = useState<PaletteId>("champagne");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Sync with whatever the no-flash script applied — and re-apply defensively
  // in case the inline bootstrap was stripped from the layout.
  useEffect(() => {
    const stored = readStored();
    setMode(stored.mode);
    setPalette(stored.palette);
    applyTheme(stored.mode, stored.palette);
  }, []);

  // Outside click / Escape closes the menu.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selectMode = useCallback(
    (next: Mode) => {
      if (next === mode) return;
      setMode(next);
      withSmoothTransition(() => applyTheme(next, palette), btnRef.current);
    },
    [mode, palette]
  );

  const selectPalette = useCallback(
    (next: PaletteId) => {
      setPalette(next);
      withSmoothTransition(() => applyTheme(mode, next), btnRef.current);
    },
    [mode]
  );

  const isDark = mode === "dark";

  return (
    <div ref={wrapRef} className={cn("theme-toggle-wrap", className)}>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="theme-toggle tap-target"
        aria-label="Theme settings"
        aria-expanded={open}
        aria-haspopup="true"
        data-mode={mode}
      >
        <span className="theme-toggle__stack" aria-hidden="true">
          <Sun className="theme-toggle__icon theme-toggle__icon--sun" />
          <Moon className="theme-toggle__icon theme-toggle__icon--moon" />
        </span>
        <ChevronDown
          className={cn("theme-toggle__chevron", open && "is-open")}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="theme-pop" role="menu" aria-label="Theme settings">
          <p className="theme-pop__label" aria-hidden="true">Appearance</p>
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              role="menuitemradio"
              aria-checked={mode === m.id}
              onClick={() => selectMode(m.id)}
              className={cn("theme-pop__item tap-target", mode === m.id && "is-active")}
            >
              {m.id === "light" ? (
                <Sun className="theme-pop__mode-icon" aria-hidden="true" />
              ) : (
                <Moon className="theme-pop__mode-icon" aria-hidden="true" />
              )}
              {m.label}
              {mode === m.id && <Check className="theme-pop__check" aria-hidden="true" />}
            </button>
          ))}

          <p className="theme-pop__label" aria-hidden="true">Color Theme</p>
          {PALETTES.map((p) => (
            <button
              key={p.id}
              type="button"
              role="menuitemradio"
              aria-checked={palette === p.id}
              onClick={() => selectPalette(p.id)}
              className={cn("theme-pop__item tap-target", palette === p.id && "is-active")}
            >
              <span
                className="theme-pop__swatch"
                style={{
                  background: `linear-gradient(135deg, ${p.swatch[0]} 0%, ${p.swatch[0]} 48%, ${p.swatch[1]} 52%, ${p.swatch[1]} 100%)`,
                }}
                aria-hidden="true"
              />
              {p.label}
              {palette === p.id && <Check className="theme-pop__check" aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Kept for compatibility with earlier imports. */
export { ThemeToggle as ThemeMenu };
