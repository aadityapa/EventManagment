"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { applyWorldPreset, clearWorldPreset, type WorldPresetId, WORLD_PRESETS } from "@/lib/adaptive-theme/world-presets";
import { EASE, DUR } from "./easing";

const VALID_WORLDS = new Set<string>(Object.keys(WORLD_PRESETS));

/**
 * V5 world-entry portal overlay — triggered by `?world=` query param.
 */
export function PortalTransition() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reduced = useReducedMotion();
  const worldParam = searchParams.get("world");
  const world =
    worldParam && VALID_WORLDS.has(worldParam) ? (worldParam as WorldPresetId) : null;

  useEffect(() => {
    if (!world) {
      clearWorldPreset();
      return;
    }
    applyWorldPreset(world);
  }, [world, pathname]);

  if (reduced || !world) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={`${pathname}-${world}`}
        className="pointer-events-none fixed inset-0 z-[85] flex items-center justify-center bg-[var(--v5-obsidian,#050505)]"
        initial={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
        animate={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
        exit={{ opacity: 0 }}
        transition={{ duration: DUR.cinematic, ease: EASE.drama }}
        aria-hidden
      >
        <motion.p
          className="font-[family-name:var(--font-cinzel)] text-sm uppercase tracking-[0.35em] text-[var(--glitz-gold)]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DUR.base, ease: EASE.luxe }}
        >
          Entering {WORLD_PRESETS[world]?.label ?? "World"}
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}
