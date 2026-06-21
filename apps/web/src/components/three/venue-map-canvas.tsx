"use client";

import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const PINS = [
  { city: "Jaipur", x: 42, y: 38 },
  { city: "Udaipur", x: 38, y: 48 },
  { city: "Mumbai", x: 28, y: 62 },
  { city: "Goa", x: 22, y: 72 },
  { city: "Pune", x: 32, y: 58 },
] as const;

type VenueMapCanvasProps = {
  activeCity?: string;
  onSelect?: (city: string) => void;
  className?: string;
};

/** Lightweight 2D destination map — lazy, no WebGL. */
export function VenueMapCanvas({ activeCity, onSelect, className }: VenueMapCanvasProps) {
  return (
    <div
      className={cn(
        "relative aspect-[16/10] overflow-hidden rounded-[var(--v4-radius-xl)] border border-[var(--v4-glass-border)] bg-[var(--v5-obsidian,#050505)]/5",
        className
      )}
      role="img"
      aria-label="Interactive map of venue destinations across India"
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full opacity-30" aria-hidden>
        <path
          d="M15 70 Q30 55 45 45 T75 25 T88 40 T70 80 T35 85 Z"
          fill="none"
          stroke="var(--glitz-gold)"
          strokeWidth="0.3"
          strokeDasharray="1 1"
        />
      </svg>
      {PINS.map((pin) => (
        <button
          key={pin.city}
          type="button"
          onClick={() => onSelect?.(pin.city)}
          className={cn(
            "absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 transition-transform hover:scale-110",
            activeCity === pin.city && "scale-110"
          )}
          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          aria-label={`Filter venues in ${pin.city}`}
          aria-pressed={activeCity === pin.city}
        >
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-sm",
              activeCity === pin.city
                ? "border-[var(--glitz-gold)] bg-[var(--glitz-gold)]/20 shadow-[var(--v4-glow-gold-sm)]"
                : "border-[var(--glitz-gold)]/40 bg-[var(--glitz-glass)]"
            )}
          >
            <MapPin className="h-4 w-4 text-[var(--glitz-gold)]" aria-hidden />
          </span>
          <span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
            {pin.city}
          </span>
        </button>
      ))}
    </div>
  );
}
