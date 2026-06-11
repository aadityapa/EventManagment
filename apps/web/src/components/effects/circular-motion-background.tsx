"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ORBITS = [
  { size: "140vmin", duration: 48, reverse: false, opacity: 0.35 },
  { size: "110vmin", duration: 36, reverse: true, opacity: 0.28 },
  { size: "82vmin", duration: 28, reverse: false, opacity: 0.22 },
  { size: "58vmin", duration: 22, reverse: true, opacity: 0.18 },
] as const;

const STREAKS = [
  { radius: 42, duration: 18, size: 6, delay: 0 },
  { radius: 48, duration: 24, size: 4, delay: 2 },
  { radius: 36, duration: 20, size: 5, delay: 4 },
  { radius: 52, duration: 30, size: 3, delay: 1 },
  { radius: 30, duration: 16, size: 4, delay: 3 },
  { radius: 44, duration: 26, size: 5, delay: 5 },
] as const;

function useReducedMotion() {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);
}

export function CircularMotionBackground({ className }: { className?: string }) {
  const reduced = useReducedMotion();

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      {/* Soft vignette so rings fade at edges */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_0%,rgba(0,0,0,0.55)_72%,rgba(0,0,0,0.85)_100%)]" />

      {/* Rotating concentric rings */}
      <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2">
        {ORBITS.map((orbit, i) => (
          <motion.div
            key={orbit.size}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: orbit.size,
              height: orbit.size,
              opacity: orbit.opacity,
              border: "1px solid rgba(194, 178, 128, 0.22)",
              boxShadow: i === 0 ? "0 0 80px rgba(194, 178, 128, 0.08), inset 0 0 60px rgba(194, 178, 128, 0.04)" : undefined,
              background:
                i % 2 === 0
                  ? "conic-gradient(from 0deg, transparent 0deg, rgba(194,178,128,0.12) 40deg, transparent 80deg, rgba(224,216,191,0.08) 200deg, transparent 280deg)"
                  : undefined,
            }}
            animate={reduced ? undefined : { rotate: orbit.reverse ? -360 : 360 }}
            transition={reduced ? undefined : { duration: orbit.duration, repeat: Infinity, ease: "linear" }}
          />
        ))}

        {/* Dashed accent ring */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[var(--glitz-gold)]/20"
          style={{ width: "96vmin", height: "96vmin" }}
          animate={reduced ? undefined : { rotate: 360 }}
          transition={reduced ? undefined : { duration: 90, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Orbiting gold light streaks */}
      <div className="absolute left-1/2 top-[42%] h-[min(100vw,100vh)] w-[min(100vw,100vh)] -translate-x-1/2 -translate-y-1/2">
        {STREAKS.map((streak, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            animate={reduced ? undefined : { rotate: 360 }}
            transition={
              reduced
                ? undefined
                : { duration: streak.duration, repeat: Infinity, ease: "linear", delay: streak.delay }
            }
          >
            <div
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `rotate(0deg) translateX(${streak.radius}vmin)`,
                transformOrigin: "0 0",
              }}
            >
              <div
                className="rounded-full bg-[var(--glitz-gold)] blur-[2px]"
                style={{
                  width: streak.size,
                  height: streak.size,
                  boxShadow: "0 0 20px rgba(194,178,128,0.9), 0 0 40px rgba(194,178,128,0.4)",
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sweeping light arc */}
      <motion.div
        className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "130vmin",
          height: "130vmin",
          background:
            "conic-gradient(from 0deg, transparent 0deg, rgba(194,178,128,0.14) 8deg, transparent 16deg, transparent 360deg)",
        }}
        animate={reduced ? undefined : { rotate: 360 }}
        transition={reduced ? undefined : { duration: 14, repeat: Infinity, ease: "linear" }}
      />

      {/* Secondary counter-rotating arc */}
      <motion.div
        className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40"
        style={{
          width: "72vmin",
          height: "72vmin",
          background:
            "conic-gradient(from 180deg, transparent 0deg, rgba(224,216,191,0.18) 6deg, transparent 14deg, transparent 360deg)",
        }}
        animate={reduced ? undefined : { rotate: -360 }}
        transition={reduced ? undefined : { duration: 10, repeat: Infinity, ease: "linear" }}
      />

      {/* Pulsing core glow */}
      <motion.div
        className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(194,178,128,0.2),transparent_70%)]"
        style={{ width: "28vmin", height: "28vmin" }}
        animate={reduced ? undefined : { scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={reduced ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
