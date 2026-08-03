"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
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

const DEFAULT_THEME = { mode: "dark" as Mode, palette: "champagne" as PaletteId };

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

/** Cached so useSyncExternalStore getSnapshot stays referentially stable. */
let cachedThemeRaw: string | null | undefined;
let cachedThemeValue = DEFAULT_THEME;

function readStored(): { mode: Mode; palette: PaletteId } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cachedThemeRaw) return cachedThemeValue;
    cachedThemeRaw = raw;
    if (!raw) {
      cachedThemeValue = DEFAULT_THEME;
      return cachedThemeValue;
    }
    const [mode, palette] = raw.split("|") as [Mode, PaletteId];
    cachedThemeValue = {
      mode: mode === "light" || mode === "dark" ? mode : DEFAULT_THEME.mode,
      palette: PALETTES.some((p) => p.id === palette) ? palette : DEFAULT_THEME.palette,
    };
    return cachedThemeValue;
  } catch {
    return DEFAULT_THEME;
  }
}

function subscribeTheme(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

/** Apply theme to <html> synchronously. Never throws. */
function applyTheme(mode: Mode, palette: PaletteId) {
  const el = document.documentElement;
  el.classList.remove("dark", "light");
  el.classList.add(mode);
  if (palette === "champagne") el.removeAttribute("data-palette");
  else el.setAttribute("data-palette", palette);
  const raw = `${mode}|${palette}`;
  cachedThemeRaw = raw;
  cachedThemeValue = { mode, palette };
  try {
    window.localStorage.setItem(STORAGE_KEY, raw);
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
  const stored = useSyncExternalStore(subscribeTheme, readStored, () => DEFAULT_THEME);
  const [mode, setMode] = useState<Mode | null>(null);
  const [palette, setPalette] = useState<PaletteId | null>(null);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const activeMode = mode ?? stored.mode;
  const activePalette = palette ?? stored.palette;

  // Re-apply when the resolved theme changes (external DOM sync, no setState).
  useEffect(() => {
    applyTheme(activeMode, activePalette);
  }, [activeMode, activePalette]);

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
      if (next === activeMode) return;
      setMode(next);
      withSmoothTransition(() => applyTheme(next, activePalette), btnRef.current);
    },
    [activeMode, activePalette]
  );

  const selectPalette = useCallback(
    (next: PaletteId) => {
      setPalette(next);
      withSmoothTransition(() => applyTheme(activeMode, next), btnRef.current);
    },
    [activeMode]
  );

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
        data-mode={activeMode}
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
              aria-checked={activeMode === m.id}
              onClick={() => selectMode(m.id)}
              className={cn("theme-pop__item tap-target", activeMode === m.id && "is-active")}
            >
              {m.id === "light" ? (
                <Sun className="theme-pop__mode-icon" aria-hidden="true" />
              ) : (
                <Moon className="theme-pop__mode-icon" aria-hidden="true" />
              )}
              {m.label}
              {activeMode === m.id && <Check className="theme-pop__check" aria-hidden="true" />}
            </button>
          ))}

          <p className="theme-pop__label" aria-hidden="true">Color Theme</p>
          {PALETTES.map((p) => (
            <button
              key={p.id}
              type="button"
              role="menuitemradio"
              aria-checked={activePalette === p.id}
              onClick={() => selectPalette(p.id)}
              className={cn("theme-pop__item tap-target", activePalette === p.id && "is-active")}
            >
              <span
                className="theme-pop__swatch"
                style={{
                  background: `linear-gradient(135deg, ${p.swatch[0]} 0%, ${p.swatch[0]} 48%, ${p.swatch[1]} 52%, ${p.swatch[1]} 100%)`,
                }}
                aria-hidden="true"
              />
              {p.label}
              {activePalette === p.id && <Check className="theme-pop__check" aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Kept for compatibility with earlier imports. */
export { ThemeToggle as ThemeMenu };
