// Server component — no "use client". Gold filigree in the engraved-hairline
// style of the icon set (src/components/icons): round caps and joins, ~1px
// strokes in currentColor, arcs and scrolls only, and the solid gold jewel
// dot at the focal point. Every stroke carries pathLength="1" so decor.css can
// draw it in on the ornament's own view timeline (motion "full"), fade it in
// ("gentle") or leave it drawn ("off", no JS, no scroll timelines).
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type FiligreeKind = "divider" | "corner" | "crest";

export type FiligreeProps = {
  /** `divider` marks a section boundary, `corner` dresses a frame or panel corner, `crest` crowns a centred statement. */
  kind: FiligreeKind;
  /** Mirror horizontally (e.g. a top-right corner). */
  flip?: boolean;
  className?: string;
};

/** One hairline; pathLength normalises the dash so every stroke draws in on the same 0–1 scale. */
function Line({ d, faint = false }: { d: string; faint?: boolean }) {
  return <path d={d} pathLength={1} className={faint ? "nx-filigree__line nx-filigree__line--faint" : "nx-filigree__line"} />;
}

function Jewel({ cx, cy, r = 1.5 }: { cx: number; cy: number; r?: number }) {
  return <circle cx={cx} cy={cy} r={r} className="nx-filigree__jewel" />;
}

/** Left half of the divider; the right half is the same group mirrored about x = 120. */
const DIVIDER_HALF = (
  <>
    <Line d="M113.5 12C108.5 12 105.5 8.5 101.5 8.5C97.5 8.5 96 12.5 98.5 14.5C100.5 16 103 14.5 102 12.5" />
    <Line d="M104.5 12.5C98.5 18 90.5 18.5 84.5 14" faint />
    <Line d="M98.5 10.5C92.5 5.5 86.5 5.5 81.5 8.5" faint />
    <Line d="M86 12H14" />
    <Jewel cx={10} cy={12} r={0.9} />
  </>
);

const ART: Record<FiligreeKind, { viewBox: string; body: ReactNode }> = {
  divider: {
    viewBox: "0 0 240 24",
    body: (
      <>
        <g>{DIVIDER_HALF}</g>
        <g transform="matrix(-1 0 0 1 240 0)">{DIVIDER_HALF}</g>
        <Line d="M120 5L127 12L120 19L113 12Z" />
        <Jewel cx={120} cy={12} />
      </>
    ),
  },
  corner: {
    viewBox: "0 0 48 48",
    body: (
      <>
        <Line d="M3 45V11C3 6.6 6.6 3 11 3H45" />
        <Line d="M8.5 31V14.5C8.5 11.2 11.2 8.5 14.5 8.5H31" faint />
        <Line d="M17 17C21 18.5 25.5 23 27.5 27.5C23 25.5 18.5 21 17 17Z" />
        <Line d="M14.5 14.5C12.6 12.6 13.4 10.2 15.6 10.6" faint />
        <Jewel cx={17} cy={17} />
        <Jewel cx={8.5} cy={34} r={0.9} />
        <Jewel cx={34} cy={8.5} r={0.9} />
      </>
    ),
  },
  crest: {
    viewBox: "0 0 80 28",
    body: (
      <>
        <Line d="M6 23H74" faint />
        <Line d="M26 23C26 14 32.5 8.5 40 8.5C47.5 8.5 54 14 54 23" />
        <Line d="M31 23C31 17 35 13 40 13C45 13 49 17 49 23" faint />
        <Line d="M26 23C22 23 19 20 20.5 17.5C21.7 15.6 24.5 16.4 24 18.5" />
        <Line d="M54 23C58 23 61 20 59.5 17.5C58.3 15.6 55.5 16.4 56 18.5" />
        <Jewel cx={40} cy={4.5} />
        <Jewel cx={40} cy={18.5} r={0.9} />
      </>
    ),
  },
};

export function Filigree({ kind, flip = false, className }: FiligreeProps) {
  const art = ART[kind];
  return (
    <svg
      viewBox={art.viewBox}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn("nx-filigree", `nx-filigree--${kind}`, flip && "nx-filigree--flip", className)}
    >
      {art.body}
    </svg>
  );
}

/** Four `corner` flourishes dressing a positioned frame or panel (inside its padding). */
export function FiligreeFrame({ className }: { className?: string }) {
  return (
    <span className={cn("nx-corners", className)} aria-hidden="true">
      <Filigree kind="corner" className="nx-corner nx-corner--tl" />
      <Filigree kind="corner" className="nx-corner nx-corner--tr" />
      <Filigree kind="corner" className="nx-corner nx-corner--bl" />
      <Filigree kind="corner" className="nx-corner nx-corner--br" />
    </span>
  );
}
