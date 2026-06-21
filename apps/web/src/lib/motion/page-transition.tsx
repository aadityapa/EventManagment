"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE, DUR } from "./easing";

const EXCLUDED_PREFIXES = ["/dashboard", "/admin", "/api"];

function shouldAnimate(pathname: string) {
  return !EXCLUDED_PREFIXES.some((p) => pathname.startsWith(p));
}

/**
 * V5 route curtain — Framer AnimatePresence fallback for marketing routes.
 * Dashboard/admin routes render without transition overlay.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const animate = shouldAnimate(pathname) && !reduced;

  if (!animate) {
    return <>{children}</>;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DUR.fast, ease: EASE.luxe }}
          className="relative flex-1 flex flex-col"
        >
          {children}
        </motion.div>
      </AnimatePresence>
      <AnimatePresence>
        <RouteCurtain key={`curtain-${pathname}`} />
      </AnimatePresence>
    </>
  );
}

function RouteCurtain() {
  return (
    <motion.div
      className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-0 origin-top bg-[var(--v5-obsidian,#050505)]"
      initial={{ height: 0, opacity: 0 }}
      animate={{
        height: ["0%", "100%", "0%"],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 0.9,
        times: [0, 0.45, 1],
        ease: EASE.drama,
      }}
      aria-hidden
    >
      <motion.div
        className="v5-hairline absolute inset-x-0 top-0"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: DUR.fast, ease: EASE.luxe }}
      />
    </motion.div>
  );
}
