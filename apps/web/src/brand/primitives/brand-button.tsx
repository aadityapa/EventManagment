"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface BrandButtonProps {
  href: string;
  children: ReactNode;
  variant?: "gold" | "outline";
  className?: string;
}

export function BrandButton({ href, children, variant = "gold", className }: BrandButtonProps) {
  return (
    <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.98 }}>
      <Link
        href={href}
        className={cn(
          "relative inline-flex min-h-[48px] min-w-[200px] items-center justify-center gap-2 overflow-hidden rounded-lg px-8 py-3 text-sm font-semibold tracking-wide",
          variant === "gold"
            ? "btn-gold-metallic"
            : "border border-[var(--glitz-gold)]/45 bg-[var(--glitz-glass)] text-[var(--glitz-text)] backdrop-blur-sm hover:border-[var(--glitz-gold)]/70 hover:bg-[var(--glitz-gold)]/8 hover:shadow-[var(--glitz-glow)]",
          className
        )}
      >
        {variant === "gold" && (
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        )}
        <span className="relative z-10">{children}</span>
      </Link>
    </motion.div>
  );
}
