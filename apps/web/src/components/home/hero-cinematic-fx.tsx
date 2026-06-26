"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { motion, type MotionValue, useTransform } from "framer-motion";

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
  const reducedMotion = useReducedMotion();
  const isDark = true;

  const spotlightX = useTransform(mouseX, (v) => `calc(-50% + ${v * 18}vmin)`);
  const spotlightY = useTransform(mouseY, (v) => `calc(-50% + ${v * 12}vmin)`);

  return (
    <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
      <motion.div
        className="absolute left-1/2 top-[38%] h-[70vmin] w-[70vmin] rounded-full blur-3xl will-change-transform"
        style={{
          translateX: spotlightX,
          translateY: spotlightY,
          background: isDark
            ? "radial-gradient(circle, rgba(212,175,55,0.14) 0%, transparent 68%)"
            : "radial-gradient(circle, rgba(201,162,39,0.2) 0%, transparent 68%)",
        }}
      />

      <motion.div
        className="absolute left-[18%] top-[22%] h-32 w-32 rounded-full blur-3xl will-change-transform md:h-48 md:w-48"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(255,215,0,0.14) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(230,198,122,0.22) 0%, transparent 70%)",
        }}
        animate={reducedMotion ? undefined : { opacity: [0.25, 0.5, 0.25], scale: [1, 1.06, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        key={active}
        className="absolute right-[-10%] top-[15%] h-[90vmin] w-[90vmin] rounded-full opacity-15 will-change-transform"
        style={{
          background: isDark
            ? "conic-gradient(from 0deg, transparent, rgba(212,175,55,0.1), transparent)"
            : "conic-gradient(from 0deg, transparent, rgba(201,162,39,0.12), transparent)",
        }}
        animate={reducedMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
      />

      {!reducedMotion && (
        <div className={isDark ? "absolute inset-0 opacity-40" : "absolute inset-0 opacity-25"}>
          <GoldParticles className="h-full w-full" />
        </div>
      )}
    </div>
  );
}
