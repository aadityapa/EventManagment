"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MediaAsset } from "@/lib/media/types";
import { MEDIA_CATEGORY_LABELS } from "@/lib/media/categories";
import { OptimizedMediaImage } from "./optimized-media-image";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import { EASE, DUR } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  assets: MediaAsset[];
  className?: string;
};

/** Story-driven editorial gallery — horizontal scroll on mobile, focus panel on desktop */
export function StoryGallery({ assets, className }: Props) {
  const [active, setActive] = useState(0);
  if (!assets.length) return null;

  const current = assets[active] ?? assets[0];

  return (
    <div className={cn("grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-10", className)}>
      <div className="order-2 lg:order-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: DUR.base, ease: EASE.luxe }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--glitz-gold)]">
              {MEDIA_CATEGORY_LABELS[current.category]}
            </span>
            <h3 className="mt-3 font-[family-name:var(--font-playfair)] text-2xl font-semibold sm:text-3xl">
              {current.title}
            </h3>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted sm:text-base">
              A curated moment from the Nexyyra Events archive — crafted with cinematic precision and timeless luxury.
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {assets.map((asset, i) => (
            <button
              key={asset.id}
              type="button"
              onClick={() => setActive(i)}
              aria-current={i === active}
              className={cn(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border transition-all sm:h-20 sm:w-28",
                i === active
                  ? "border-[var(--glitz-gold)] ring-2 ring-[var(--glitz-gold)]/30"
                  : "border-[var(--glitz-border)] opacity-70 hover:opacity-100"
              )}
            >
              <OptimizedMediaImage asset={asset} fill sizes="112px" targetWidth={320} />
            </button>
          ))}
        </div>
      </div>

      <GlassPanel className="relative order-1 aspect-[4/5] overflow-hidden p-0 sm:aspect-[3/4] lg:order-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: EASE.luxe }}
          >
            <OptimizedMediaImage
              asset={current}
              fill
              priority={active === 0}
              sizes="(max-width:1024px) 100vw, 50vw"
              targetWidth={1200}
            />
          </motion.div>
        </AnimatePresence>
      </GlassPanel>
    </div>
  );
}
