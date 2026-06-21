"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { MediaAsset } from "@/lib/media/types";
import { MEDIA_CATEGORY_LABELS } from "@/lib/media/categories";
import { OptimizedMediaImage } from "./optimized-media-image";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import { staggerParent, staggerItem, EASE, DUR } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  assets: MediaAsset[];
  className?: string;
  hrefBase?: string;
  columns?: 2 | 3;
};

/** Editorial portfolio grid — Louis Vuitton / Four Seasons pacing */
export function PortfolioGrid({ assets, className, hrefBase = "/portfolio", columns = 3 }: Props) {
  if (!assets.length) return null;

  const colClass =
    columns === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <motion.div
      className={cn("grid gap-5 md:gap-6", colClass, className)}
      variants={staggerParent}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.08 }}
    >
      {assets.map((asset, i) => (
        <motion.div key={asset.id} variants={staggerItem}>
          <Link
            href={`${hrefBase}?highlight=${asset.id}`}
            className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glitz-gold)]"
          >
            <GlassPanel
              liquid={false}
              className="overflow-hidden p-0 transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[var(--v4-glow-gold)]"
            >
              <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[3/4]">
                <OptimizedMediaImage
                  asset={asset}
                  fill
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  targetWidth={828}
                  className="transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--glitz-gold)]">
                      {MEDIA_CATEGORY_LABELS[asset.category]}
                    </span>
                    <p className="mt-1 truncate font-[family-name:var(--font-playfair)] text-lg font-semibold text-white">
                      {asset.title}
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--glitz-gold)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </GlassPanel>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
