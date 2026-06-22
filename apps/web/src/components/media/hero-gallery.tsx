"use client";

import { useCallback, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { MediaAsset } from "@/lib/media/types";
import { OptimizedMediaImage } from "./optimized-media-image";
import { ScrollReveal, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  assets: MediaAsset[];
  className?: string;
  autoPlayMs?: number;
};

/** Cinematic hero carousel — Apple / Aman inspired fade transitions */
export function HeroGallery({ assets, className }: Props) {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const count = assets.length;

  const go = useCallback(
    (dir: 1 | -1) => {
      if (!count) return;
      setActive((i) => (i + dir + count) % count);
    },
    [count]
  );

  if (!count) return null;

  return (
    <div className={cn("relative overflow-hidden rounded-[var(--v4-radius-lg)]", className)}>
      <div className="relative aspect-[16/10] min-h-[220px] w-full sm:aspect-[21/9] sm:min-h-[280px]">
        {assets.map((asset, i) => (
          <motion.div
            key={asset.id}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: i === active ? 1 : 0, scale: i === active ? 1 : 1.04 }}
            transition={{ duration: reducedMotion ? 0 : 1.1, ease: EASE.luxe }}
            aria-hidden={i !== active}
          >
            <OptimizedMediaImage
              asset={asset}
              alt={asset.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              targetWidth={1920}
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/25" />
          </motion.div>
        ))}

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="tap-target absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-md transition hover:bg-black/55"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="tap-target absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-md transition hover:bg-black/55"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {assets.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Slide ${i + 1}`}
                  aria-current={i === active}
                  onClick={() => setActive(i)}
                  className={cn(
                    "h-1 rounded-full transition-all duration-500",
                    i === active ? "w-8 bg-[var(--glitz-gold)]" : "w-1.5 bg-white/40"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <ScrollReveal preset="fade" className="absolute bottom-6 left-6 z-10 max-w-xs">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--glitz-gold)]">
          {assets[active]?.category.replace(/-/g, " ")}
        </p>
        <p className="mt-1 font-[family-name:var(--font-playfair)] text-lg text-white drop-shadow-md">
          {assets[active]?.title}
        </p>
      </ScrollReveal>
    </div>
  );
}
