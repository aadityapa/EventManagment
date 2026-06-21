"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import type { MediaAsset } from "@/lib/media/types";
import { OptimizedMediaImage } from "./optimized-media-image";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import { ScrollReveal, staggerParent, staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  assets: MediaAsset[];
  className?: string;
  locationLabel?: string;
};

/** Venue showcase — spacious Four Seasons grid */
export function VenueGallery({ assets, className, locationLabel }: Props) {
  if (!assets.length) return null;

  const featured = assets[0];
  const rest = assets.slice(1, 5);

  return (
    <div className={cn("space-y-5 md:space-y-6", className)}>
      {featured && (
        <ScrollReveal preset="reveal">
          <GlassPanel className="relative overflow-hidden p-0">
            <div className="relative aspect-[16/9] min-h-[220px] w-full sm:min-h-[320px]">
              <OptimizedMediaImage
                asset={featured}
                fill
                priority
                sizes="100vw"
                targetWidth={1920}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--glitz-gold)]">
                  Signature Venue
                </p>
                <h3 className="mt-2 font-[family-name:var(--font-playfair)] text-2xl font-semibold text-white sm:text-3xl">
                  {featured.title}
                </h3>
                {locationLabel && (
                  <p className="mt-2 flex items-center gap-2 text-sm text-white/80">
                    <MapPin className="h-4 w-4 text-[var(--glitz-gold)]" aria-hidden />
                    {locationLabel}
                  </p>
                )}
              </div>
            </div>
          </GlassPanel>
        </ScrollReveal>
      )}

      {rest.length > 0 && (
        <motion.div
          className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {rest.map((asset) => (
            <motion.div key={asset.id} variants={staggerItem}>
              <GlassPanel className="relative aspect-[4/5] overflow-hidden p-0">
                <OptimizedMediaImage
                  asset={asset}
                  fill
                  sizes="(max-width:640px) 50vw, 25vw"
                  targetWidth={640}
                  className="transition-transform duration-700 hover:scale-[1.04]"
                />
              </GlassPanel>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
