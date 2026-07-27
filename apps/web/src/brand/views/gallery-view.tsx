"use client";

import type { MediaAsset } from "@/lib/media/types";
import { BrandImage } from "@/brand/primitives/brand-image";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import { LuxuryMasonryGallery } from "@/components/media";
import { ScrollReveal } from "@/lib/motion";

type Props = {
  assets: MediaAsset[];
  heroSrc: string;
};

export function GalleryView({ assets, heroSrc }: Props) {
  return (
    <div className="brand-root">
      <section className="relative flex min-h-[68svh] items-end overflow-hidden">
        <BrandImage
          src={heroSrc}
          alt="Luxury event gallery by Nexyyra Events"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/45 to-black/20" />
        <div className="brand-container relative w-full pb-16 pt-32 sm:pb-20">
          <GlassPanel textSafe className="max-w-2xl px-8 py-10 sm:px-10">
            <span className="v4-kicker mb-4">Visual Stories</span>
            <h1 className="v4-display text-white">
              Immersive <span className="v4-gold-text">Gallery</span>
            </h1>
            <p className="v4-standfirst mt-4 text-white/80">
              Editorial frames from our most celebrated weddings, galas, and destination productions.
            </p>
          </GlassPanel>
        </div>
      </section>

      {/* Masonry archive — headline leads straight into the photo wall
          (the old duplicate hero image block created a redundant gap here) */}
      <section className="v4-section">
        <div className="brand-container">
          <ScrollReveal preset="reveal" className="mb-10 text-center">
            <span className="v4-kicker mb-4">Visual Archive</span>
            <h2 className="v4-title [text-wrap:balance]">Behind the Lens</h2>
          </ScrollReveal>
          <LuxuryMasonryGallery assets={assets} />
        </div>
      </section>
    </div>
  );
}
