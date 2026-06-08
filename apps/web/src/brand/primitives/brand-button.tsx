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
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
      <Link
        href={href}
        className={cn(
          "inline-flex min-h-[48px] min-w-[200px] items-center justify-center gap-2 rounded-lg px-8 py-3 text-sm font-semibold tracking-wide transition-colors",
          variant === "gold"
            ? "bg-[var(--glitz-gold)] text-[#0A0A0A] shadow-[var(--glitz-glow)] hover:bg-[var(--glitz-gold-light)]"
            : "border border-[var(--glitz-gold)]/40 bg-transparent text-white hover:bg-[var(--glitz-gold)]/10",
          className
        )}
      >
        {children}
      </Link>
    </motion.div>
  );
}
