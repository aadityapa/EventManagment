"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StitchGlowCardProps {
  children: ReactNode;
  className?: string;
  hover3d?: boolean;
}

export function StitchGlowCard({ children, className, hover3d = true }: StitchGlowCardProps) {
  return (
    <motion.div
      whileHover={hover3d ? { y: -6, scale: 1.01 } : undefined}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "glass-card group relative overflow-hidden rounded-xl border border-primary/15 transition-shadow duration-500 hover:border-primary/30 hover:shadow-glow-lg",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute -inset-px bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
      </div>
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
