// Server component — no "use client". Tiny four-point champagne stars with a
// 1–3px glow, scattered around the edge of their (absolutely positioned) box
// — never across its middle, where a button or heading sits. Each twinkles on
// its own period (≥ 2.8 s) under motion "full" / "gentle"; still under "off".
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type SparklesProps = {
  className?: string;
  /** 1–8, default 5. */
  count?: number;
};

/** Perimeter positions (% of the box), in the order they are used. */
const SPOTS: Array<[number, number]> = [
  [4, 20],
  [96, 14],
  [14, 98],
  [88, 90],
  [56, -6],
  [-4, 64],
  [104, 52],
  [32, 2],
];

const rand = (n: number) => {
  const s = Math.sin(n * 91.345 + 47.853) * 24634.6345;
  return s - Math.floor(s);
};

export function Sparkles({ className, count = 5 }: SparklesProps) {
  const spots = SPOTS.slice(0, Math.max(1, Math.min(SPOTS.length, Math.round(count))));
  return (
    <span className={cn("nx-sparkles", className)} aria-hidden="true">
      {spots.map(([x, y], i) => {
        const period = 2.8 + rand(i) * 2.4;
        const style = {
          "--x": `${x}%`,
          "--y": `${y}%`,
          "--sz": `${Math.round(8 + rand(i + 3) * 7)}px`,
          "--t": `${period.toFixed(2)}s`,
          "--d": `${(-rand(i + 9) * period).toFixed(2)}s`,
        } as CSSProperties;
        return (
          <span key={i} className="nx-sparkle" style={style}>
            <svg viewBox="0 0 20 20" focusable="false">
              <path d="M10 0C10.6 6.6 13.4 9.4 20 10C13.4 10.6 10.6 13.4 10 20C9.4 13.4 6.6 10.6 0 10C6.6 9.4 9.4 6.6 10 0Z" />
            </svg>
          </span>
        );
      })}
    </span>
  );
}
