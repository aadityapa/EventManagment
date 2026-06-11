"use client";

import { motion } from "framer-motion";
import { GoldParticles } from "@/components/effects/gold-particles";
import { cn } from "@/lib/utils";

type Props = {
  isLight: boolean;
  active: number;
};

export function HeroCinematicFx({ isLight, active }: Props) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden [transform-style:preserve-3d]">
      {/* Gold light rays */}
      <motion.div
        className="absolute -left-1/4 top-0 h-full w-[70%] opacity-40"
        style={{
          background: isLight
            ? "linear-gradient(105deg, transparent 0%, rgba(245,215,110,0.18) 35%, rgba(212,175,55,0.08) 55%, transparent 75%)"
            : "linear-gradient(105deg, transparent 0%, rgba(212,175,55,0.22) 30%, rgba(255,215,0,0.08) 50%, transparent 70%)",
        }}
        animate={{ opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Sweeping gold arc */}
      <motion.div
        key={active}
        className="absolute left-1/2 top-1/3 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30"
        style={{
          background: isLight
            ? "conic-gradient(from 0deg, transparent, rgba(245,215,110,0.15), transparent)"
            : "conic-gradient(from 0deg, transparent, rgba(212,175,55,0.18), transparent)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating decorative shapes */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn(
            "absolute rounded-full border",
            isLight ? "border-[#D4AF37]/25 bg-[#F5D76E]/10" : "border-[#D4AF37]/20 bg-[#D4AF37]/5"
          )}
          style={{
            width: 80 + i * 40,
            height: 80 + i * 40,
            right: `${12 + i * 8}%`,
            top: `${18 + i * 12}%`,
            translateZ: `${40 + i * 20}px`,
          }}
          animate={{ y: [0, -12 - i * 4, 0], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
        />
      ))}

      {/* Particles layer */}
      <div className="absolute inset-0 opacity-50">
        <GoldParticles className="h-full w-full" />
      </div>

      {/* Depth blur edges */}
      <div className="absolute inset-0 backdrop-blur-[1px] [mask-image:linear-gradient(to_right,black,transparent_20%,transparent_80%,black)]" />
    </div>
  );
}
