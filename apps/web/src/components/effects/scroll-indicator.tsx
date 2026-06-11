"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-[var(--glitz-muted)]"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      aria-hidden
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">Scroll</span>
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
        <ChevronDown className="h-5 w-5 text-[var(--glitz-gold-metallic)]" />
      </motion.div>
    </motion.div>
  );
}
