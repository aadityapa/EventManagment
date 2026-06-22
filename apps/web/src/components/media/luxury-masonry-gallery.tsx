"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { MediaAsset } from "@/lib/media/types";
import {
  GALLERY_FILTER_LABELS,
  MEDIA_CATEGORY_LABELS,
  matchesCategoryFilter,
} from "@/lib/media/categories";
import { masonryHeightForAsset } from "@/lib/media/utils";
import { OptimizedMediaImage } from "./optimized-media-image";
import { BrandLightbox } from "@/brand/primitives/brand-lightbox";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import { staggerParent, staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  assets: MediaAsset[];
  className?: string;
  showFilters?: boolean;
  batchSize?: number;
};

const DEFAULT_BATCH = 24;

function MasonryAssetGrid({
  filtered,
  batchSize,
  reducedMotion,
  onOpenLightbox,
}: {
  filtered: MediaAsset[];
  batchSize: number;
  reducedMotion: boolean | null;
  onOpenLightbox: (index: number) => void;
}) {
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    setVisibleCount((c) => Math.min(c + batchSize, filtered.length));
  }, [batchSize, filtered.length]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || visibleCount >= filtered.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore, visibleCount, filtered.length]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <>
      <motion.div
        className="columns-1 gap-4 sm:columns-2 sm:gap-5 lg:columns-3"
        variants={reducedMotion ? undefined : staggerParent}
        initial={reducedMotion ? false : "hidden"}
        whileInView={reducedMotion ? undefined : "visible"}
        viewport={{ once: true, amount: 0.02 }}
      >
        {visible.map((asset, i) => {
          const h = masonryHeightForAsset(asset, 380);
          return (
            <motion.button
              key={asset.id}
              type="button"
              variants={reducedMotion ? undefined : staggerItem}
              onClick={() => onOpenLightbox(i)}
              className="gallery-masonry-item group relative mb-4 w-full break-inside-avoid cursor-zoom-in overflow-hidden rounded-[var(--v4-radius-lg)] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glitz-gold)] sm:mb-5"
              aria-label={`View ${asset.title}`}
            >
              <GlassPanel
                liquid={false}
                className="overflow-hidden p-0 transition-shadow duration-300 group-hover:shadow-[var(--v4-glow-gold)]"
              >
                <OptimizedMediaImage
                  asset={asset}
                  width={700}
                  height={h}
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  targetWidth={640}
                  quality={75}
                  priority={i < 2}
                  className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:p-5">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--glitz-gold)]">
                      {MEDIA_CATEGORY_LABELS[asset.category]}
                    </span>
                    <p className="mt-1 font-[family-name:var(--font-playfair)] text-base text-white sm:text-lg">
                      {asset.title}
                    </p>
                  </div>
                </div>
              </GlassPanel>
            </motion.button>
          );
        })}
      </motion.div>

      {visibleCount < filtered.length && (
        <div ref={sentinelRef} className="mt-8 flex justify-center py-4" aria-hidden="true">
          <span className="text-xs uppercase tracking-widest text-muted">Loading more…</span>
        </div>
      )}
    </>
  );
}

/** Luxury masonry — Aman Resorts editorial rhythm */
export function LuxuryMasonryGallery({
  assets,
  className,
  showFilters = true,
  batchSize = DEFAULT_BATCH,
}: Props) {
  const [activeFilter, setActiveFilter] = useState<(typeof GALLERY_FILTER_LABELS)[number]>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();

  const filtered = useMemo(
    () =>
      assets.filter((a) =>
        matchesCategoryFilter(a.category, activeFilter)
      ),
    [assets, activeFilter]
  );

  if (!assets.length) return null;

  return (
    <div className={className}>
      {showFilters && (
        <div className="mb-8 flex flex-wrap justify-center gap-2 sm:mb-10">
          {GALLERY_FILTER_LABELS.map((label) => (
            <button
              key={label}
              type="button"
              aria-pressed={activeFilter === label}
              onClick={() => setActiveFilter(label)}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-semibold transition-colors sm:px-5 sm:py-2.5 sm:text-sm",
                activeFilter === label
                  ? "border-[var(--glitz-gold)] bg-[var(--glitz-gold)]/10 text-[var(--glitz-gold)] shadow-[var(--v4-glow-gold)]"
                  : "border-[var(--glitz-border)] text-muted hover:border-[var(--glitz-gold)]/40"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <p className="mb-6 text-center text-sm text-muted">
        {filtered.length} {filtered.length === 1 ? "photo" : "photos"}
        {activeFilter !== "All" ? ` · ${activeFilter}` : ""}
      </p>

      <MasonryAssetGrid
        key={`${activeFilter}-${batchSize}`}
        filtered={filtered}
        batchSize={batchSize}
        reducedMotion={reducedMotion}
        onOpenLightbox={setLightboxIndex}
      />

      <BrandLightbox
        images={filtered.map((a) => ({ src: a.src, alt: a.alt }))}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
        cinematic
      />
    </div>
  );
}
