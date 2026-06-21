"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { motion, type MotionValue, useTransform } from "framer-motion";
import { useTheme } from "next-themes";

const GoldParticles = dynamic(
  () => import("@/components/effects/gold-particles").then((m) => m.GoldParticles),
  { ssr: false }
);

type Props = {
  active: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
};

export function HeroCinematicFx({ active, mouseX, mouseY }: Props) {
  const { resolvedTheme } = useTheme();
  const reducedMotion = useReducedMotion();
  const isDark = resolvedTheme === "dark";

  const spotlightX = useTransform(mouseX, (v) => `${50 + v * 18}%`);
  const spotlightY = useTransform(mouseY, (v) => `${38 + v * 12}%`);

  return (
    <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
      {/* Dynamic mouse spotlight */}
      <motion.div
          className="absolute h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            left: spotlightX,
            top: spotlightY,
            background: isDark
              ? "radial-gradient(circle, rgba(212,175,55,0.16) 0%, transparent 68%)"
              : "radial-gradient(circle, rgba(201,162,39,0.22) 0%, transparent 68%)",
        }}
      />

      {/* Gold light rays */}
      <motion.div
        className="absolute -left-[10%] top-0 h-full w-[55%]"
        style={{
          background: isDark
            ? "linear-gradient(108deg, transparent 0%, rgba(212,175,55,0.14) 40%, rgba(255,215,0,0.06) 58%, transparent 80%)"
            : "linear-gradient(108deg, transparent 0%, rgba(230,198,122,0.22) 38%, rgba(201,162,39,0.1) 55%, transparent 78%)",
        }}
        animate={reducedMotion ? undefined : { opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Lens flare */}
      <motion.div
        className="absolute left-[18%] top-[22%] h-32 w-32 rounded-full blur-3xl md:h-48 md:w-48"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(255,215,0,0.18) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(230,198,122,0.28) 0%, transparent 70%)",
        }}
        animate={reducedMotion ? undefined : { opacity: [0.3, 0.6, 0.3], scale: [1, 1.08, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Glass shimmer band */}
      <motion.div
        className="absolute inset-x-0 top-[18%] h-px opacity-60"
        style={{
          background: isDark
            ? "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)"
            : "linear-gradient(90deg, transparent, rgba(201,162,39,0.45), transparent)",
        }}
        animate={reducedMotion ? undefined : { x: ["-20%", "20%"] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />

      {/* Sweeping arc */}
      <motion.div
        key={active}
        className="absolute right-[-10%] top-[15%] h-[90vmin] w-[90vmin] rounded-full opacity-20"
        style={{
          background: isDark
            ? "conic-gradient(from 0deg, transparent, rgba(212,175,55,0.12), transparent)"
            : "conic-gradient(from 0deg, transparent, rgba(201,162,39,0.15), transparent)",
        }}
        animate={reducedMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
      />

      {/* Particles — lazy-loaded canvas, skipped when reduced motion */}
      {!reducedMotion && (
        <div className={isDark ? "absolute inset-0 opacity-35" : "absolute inset-0 opacity-20"}>
          <GoldParticles className="h-full w-full" />
        </div>
      )}
    </div>
  );
}
