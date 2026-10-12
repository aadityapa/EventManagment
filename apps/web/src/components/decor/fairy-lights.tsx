// Server component — no "use client". Strings of warm fairy lights for the V8
// décor layer: real catenary swags (solved per span on the server), a hairline
// wire drawn in SVG, and bulbs as small HTML spans placed at percentages along
// the same curve so they stay round at any width. Twinkle is staggered CSS
// (src/styles/decor.css) on opacity/scale only, with a different period per
// bulb so the string never pulses in unison; still under motion "off".
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type FairyLightsProps = {
  /** `drape` = deep layered swags (home cover, 404); `line` = a light string along an edge. */
  variant?: "drape" | "line";
  /** Bulbs on the front string (the back string of a drape carries ~60% as many). */
  bulbs?: number;
  tone?: "warm" | "champagne";
  className?: string;
};

/** viewBox units: the strings are drawn in 1000 × 100 and stretched to the box. */
const W = 1000;
const H = 100;

type Swag = { x0: number; x1: number; y: number; sag: number };
type Pt = { x: number; y: number };

/** Catenary parameter `a` for a level span of width `span` hanging `sag` units (bisection). */
function catenaryA(span: number, sag: number): number {
  let lo = span / 200;
  let hi = span * 200;
  for (let i = 0; i < 60; i += 1) {
    const a = (lo + hi) / 2;
    // sag(a) = a·(cosh(span / 2a) − 1) falls as a grows.
    if (a * (Math.cosh(span / (2 * a)) - 1) > sag) lo = a;
    else hi = a;
  }
  return (lo + hi) / 2;
}

/** The swag as a dense polyline, anchors at `y`, lowest point `y + sag` mid-span. */
function swagPoints({ x0, x1, y, sag }: Swag, steps = 20): Pt[] {
  const span = x1 - x0;
  const a = catenaryA(span, sag);
  const mid = x0 + span / 2;
  const top = a * Math.cosh(span / (2 * a));
  return Array.from({ length: steps + 1 }, (_, i) => {
    const x = x0 + (span * i) / steps;
    return { x, y: y + top - a * Math.cosh((x - mid) / a) };
  });
}

const fmt = (n: number) => Math.round(n * 100) / 100;
const fmt1 = (n: number) => Math.round(n * 10) / 10;

/** Deterministic 0..1 per index — stable markup, no hydration or cache churn. */
const rand = (n: number) => {
  const s = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return s - Math.floor(s);
};

interface StringSpec {
  swags: Swag[];
  bulbs: number;
  back: boolean;
}

function layout(spec: StringSpec, salt: number) {
  const pts = spec.swags.flatMap((s, i) => (i === 0 ? swagPoints(s) : swagPoints(s).slice(1)));
  const d = pts.map((p, i) => `${i ? "L" : "M"}${fmt1(p.x)} ${fmt1(p.y)}`).join("");
  // Bulbs evenly by arc length (half-step inset), skipping any beyond the box edges.
  const cum = [0];
  for (let i = 1; i < pts.length; i += 1) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  const total = cum[cum.length - 1];
  const bulbs: Array<Pt & { i: number }> = [];
  let seg = 1;
  for (let b = 0; b < spec.bulbs; b += 1) {
    const at = ((b + 0.5) / spec.bulbs) * total;
    while (seg < cum.length - 1 && cum[seg] < at) seg += 1;
    const t = (at - cum[seg - 1]) / Math.max(cum[seg] - cum[seg - 1], 0.0001);
    const x = pts[seg - 1].x + (pts[seg].x - pts[seg - 1].x) * t;
    const y = pts[seg - 1].y + (pts[seg].y - pts[seg - 1].y) * t;
    if (x > 6 && x < W - 6) bulbs.push({ x, y, i: b + salt });
  }
  return { d, bulbs };
}

function strings(variant: "drape" | "line", count: number): StringSpec[] {
  if (variant === "line") {
    const n = 6;
    const step = (W + 40) / n;
    return [
      {
        swags: Array.from({ length: n }, (_, i) => ({ x0: -20 + i * step, x1: -20 + (i + 1) * step, y: 6, sag: i % 2 ? 40 : 46 })),
        bulbs: count,
        back: false,
      },
    ];
  }
  // A layered canopy: three deep front swags, four shallower ones behind.
  return [
    {
      swags: [
        { x0: -30, x1: 150, y: 2, sag: 30 },
        { x0: 150, x1: 500, y: 2, sag: 38 },
        { x0: 500, x1: 850, y: 2, sag: 40 },
        { x0: 850, x1: 1030, y: 2, sag: 30 },
      ],
      bulbs: Math.round(count * 0.6),
      back: true,
    },
    {
      swags: [
        { x0: -20, x1: 330, y: 4, sag: 66 },
        { x0: 330, x1: 670, y: 4, sag: 74 },
        { x0: 670, x1: 1020, y: 4, sag: 66 },
      ],
      bulbs: count,
      back: false,
    },
  ];
}

export function FairyLights({ variant = "drape", bulbs = 24, tone = "warm", className }: FairyLightsProps) {
  const count = Math.max(4, Math.min(64, Math.round(bulbs)));
  const runs = strings(variant, count).map((spec, i) => ({ ...spec, ...layout(spec, i * 101) }));

  return (
    <div className={cn("nx-fl", `nx-fl--${variant}`, `nx-fl--${tone}`, className)} aria-hidden="true">
      <svg className="nx-fl__wires" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" focusable="false">
        {runs.map((run, i) => (
          <path key={i} d={run.d} className={run.back ? "nx-fl__wire nx-fl__wire--back" : "nx-fl__wire"} vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      {runs.flatMap((run) =>
        run.bulbs.map((b) => {
          const period = 2.6 + rand(b.i) * 2.8; // 2.6–5.4 s: ≤ 0.4 Hz, never a flash
          const style = {
            "--x": `${fmt((b.x / W) * 100)}%`,
            "--y": `${fmt((b.y / H) * 100)}%`,
            "--s": fmt(0.82 + rand(b.i + 7) * 0.32),
            "--t": `${fmt(period)}s`,
            "--d": `${fmt(-rand(b.i + 13) * period)}s`,
          } as CSSProperties;
          return <span key={b.i} className={run.back ? "nx-fl__bulb nx-fl__bulb--back" : "nx-fl__bulb"} style={style} />;
        }),
      )}
    </div>
  );
}
