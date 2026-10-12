/**
 * One-shot celebration for a sent inquiry (V8 décor). Client-only and always
 * loaded on demand — callers `import("@/components/decor/confetti")` at the
 * moment of success, so none of this is in any initial bundle.
 *
 * Follows the site motion level (html[data-motion]):
 *   full   → a canvas-2D burst of ~140 gold / ivory / blush / purple foil,
 *            ribbon and star pieces from the origin, ~2.6 s, then the canvas
 *            removes itself;
 *   gentle → a soft champagne glow with a few still-ish sparkles at the
 *            origin (no flying pieces), ~1.6 s;
 *   off    → nothing.
 * Decorative only: aria-hidden, pointer-events none, never blocks input.
 */
import { getMotionMode } from "@/components/motion/motion-mode";

export interface ConfettiOptions {
  /** Viewport coordinates (px) the burst starts from; default: centre, 60% down. */
  origin?: { x: number; y: number };
}

const DURATION = 2600;
const FADE = 700;
const Z_INDEX = "960"; // above toasts (950) and the header (900)

/** Gold and champagne lead; ivory, blush and the brand purples accent. */
const COLORS: Array<[string, number]> = [
  ["#d8b26a", 0.28],
  ["#f4d08d", 0.22],
  ["#f6eadf", 0.16],
  ["#e9b7b9", 0.14],
  ["#b47cff", 0.12],
  ["#8b4dff", 0.08],
];

const STAR =
  "M10 0C10.6 6.6 13.4 9.4 20 10C13.4 10.6 10.6 13.4 10 20C9.4 13.4 6.6 10.6 0 10C6.6 9.4 9.4 6.6 10 0Z";

type Kind = "foil" | "ribbon" | "star";

interface Piece {
  kind: Kind;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  tilt: number;
  vt: number;
  wob: number;
  size: number;
  len: number;
}

function pickColor(): string {
  const roll = Math.random();
  let acc = 0;
  for (const [hex, w] of COLORS) {
    acc += w;
    if (roll < acc) return hex;
  }
  return COLORS[0][0];
}

let live = 0;

export function burstConfetti(opts: ConfettiOptions = {}): void {
  if (typeof window === "undefined" || document.hidden) return;
  const mode = getMotionMode();
  if (mode === "off") return;
  const origin = opts.origin ?? { x: window.innerWidth / 2, y: window.innerHeight * 0.6 };
  if (mode === "gentle") glow(origin);
  else if (live < 2) burst(origin);
}

function burst(origin: { x: number; y: number }) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: Z_INDEX,
  });
  document.body.appendChild(canvas);
  live += 1;

  const phone = w < 640;
  const count = phone ? 90 : 140;
  const power = phone ? 0.8 : 1;
  const pieces: Piece[] = Array.from({ length: count }, () => {
    const roll = Math.random();
    const kind: Kind = roll < 0.56 ? "foil" : roll < 0.8 ? "ribbon" : "star";
    // An upward fan, a little wider than it is tall.
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.8;
    const speed = (480 + Math.random() * 640) * power;
    return {
      kind,
      color: kind === "star" ? (Math.random() < 0.7 ? "#f4d08d" : "#f6eadf") : pickColor(),
      x: origin.x + (Math.random() - 0.5) * 24,
      y: origin.y + (Math.random() - 0.5) * 12,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 9,
      tilt: Math.random() * Math.PI * 2,
      vt: 5 + Math.random() * 8,
      wob: Math.random() * Math.PI * 2,
      size: kind === "star" ? 5 + Math.random() * 4 : 6 + Math.random() * 4,
      len: 16 + Math.random() * 12,
    };
  });

  const starPath = new Path2D(STAR);
  let start = 0;
  let last = 0;
  let raf = 0;
  let done = false;

  const cleanup = () => {
    if (done) return;
    done = true;
    cancelAnimationFrame(raf);
    canvas.remove();
    live = Math.max(0, live - 1);
  };
  // A hidden tab pauses rAF; never leave the canvas behind.
  const safety = window.setTimeout(cleanup, DURATION + 1500);

  const draw = (p: Piece, alpha: number) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    const face = Math.cos(p.tilt);
    if (p.kind === "foil") {
      // A foil square turning in 3D: it narrows and dims edge-on, glints face-on.
      ctx.scale(1, face);
      ctx.globalAlpha = alpha * (0.5 + 0.5 * Math.abs(face));
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size * 0.7, p.size, p.size * 1.4);
      if (face > 0.88) {
        ctx.globalAlpha = alpha * 0.55;
        ctx.fillStyle = "#fffaf0";
        ctx.fillRect(-p.size / 2, -p.size * 0.7, p.size * 0.4, p.size * 1.4);
      }
    } else if (p.kind === "ribbon") {
      ctx.globalAlpha = alpha * 0.9;
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2.2;
      ctx.lineCap = "round";
      ctx.beginPath();
      for (let k = 0; k <= 6; k += 1) {
        const px = (k / 6 - 0.5) * p.len;
        const py = Math.sin(k * 1.15 + p.wob) * 3.2 * face;
        if (k) ctx.lineTo(px, py);
        else ctx.moveTo(px, py);
      }
      ctx.stroke();
    } else {
      const s = (p.size / 20) * (0.75 + 0.25 * Math.abs(face));
      ctx.scale(s, s);
      ctx.translate(-10, -10);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.fill(starPath);
    }
    ctx.restore();
  };

  const tick = (now: number) => {
    if (done) return;
    if (!start) start = last = now;
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    const elapsed = now - start;
    if (elapsed > DURATION) {
      window.clearTimeout(safety);
      cleanup();
      return;
    }
    const alpha = elapsed < DURATION - FADE ? 1 : Math.max(0, (DURATION - elapsed) / FADE);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    for (const p of pieces) {
      // Air drag, stronger for flat foil once it falls (it flutters down).
      const drag = p.kind === "foil" && p.vy > 0 ? 3.1 : p.kind === "ribbon" ? 2.2 : 1.6;
      const k = Math.exp(-drag * dt);
      p.vx *= k;
      p.vy = p.vy * k + 1250 * dt;
      p.wob += dt * 6;
      p.x += (p.vx + Math.sin(p.wob) * (p.kind === "star" ? 10 : 34)) * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
      p.tilt += p.vt * dt;
      if (p.y < h + 40) draw(p, alpha);
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
}

/** Gentle level: a soft champagne bloom and four slow sparkles, nothing flies. */
function glow(origin: { x: number; y: number }) {
  const host = document.createElement("div");
  host.setAttribute("aria-hidden", "true");
  Object.assign(host.style, {
    position: "fixed",
    left: `${origin.x}px`,
    top: `${origin.y}px`,
    width: "0",
    height: "0",
    pointerEvents: "none",
    zIndex: Z_INDEX,
  });
  const bloom = document.createElement("div");
  Object.assign(bloom.style, {
    position: "absolute",
    left: "-120px",
    top: "-120px",
    width: "240px",
    height: "240px",
    borderRadius: "50%",
    background: "radial-gradient(closest-side, rgb(244 208 141 / 0.34), rgb(216 178 106 / 0.12) 55%, transparent)",
    opacity: "0",
  });
  host.appendChild(bloom);

  const spots: Array<[number, number, number]> = [
    [-70, -26, 14],
    [64, -40, 11],
    [-34, 38, 9],
    [84, 22, 12],
  ];
  const stars = spots.map(([x, y, size]) => {
    const star = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    star.setAttribute("viewBox", "0 0 20 20");
    star.setAttribute("width", String(size));
    star.setAttribute("height", String(size));
    Object.assign(star.style, { position: "absolute", left: `${x - size / 2}px`, top: `${y - size / 2}px`, opacity: "0" });
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", STAR);
    path.setAttribute("fill", "#f4d08d");
    star.appendChild(path);
    host.appendChild(star);
    return star;
  });
  document.body.appendChild(host);

  if (typeof bloom.animate !== "function") {
    host.remove();
    return;
  }
  const ease = "cubic-bezier(0.22, 1, 0.36, 1)";
  const anim = bloom.animate(
    [
      { opacity: 0, transform: "scale(0.7)" },
      { opacity: 1, transform: "scale(1)", offset: 0.35 },
      { opacity: 0, transform: "scale(1.08)" },
    ],
    { duration: 1600, easing: ease, fill: "forwards" },
  );
  stars.forEach((star, i) =>
    star.animate(
      [
        { opacity: 0, transform: "scale(0.4) rotate(0deg)" },
        { opacity: 0.95, transform: "scale(1) rotate(30deg)", offset: 0.45 },
        { opacity: 0, transform: "scale(0.5) rotate(60deg)" },
      ],
      { duration: 1400, delay: 120 + i * 90, easing: ease, fill: "both" },
    ),
  );
  anim.finished.then(
    () => window.setTimeout(() => host.remove(), 500),
    () => host.remove(),
  );
}
