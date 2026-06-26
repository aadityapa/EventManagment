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
          <GlassPanel className="max-w-2xl px-8 py-10 sm:px-10">
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

      <section className="v4-section border-b border-[var(--glitz-border)]">
        <div className="brand-container">
          <ScrollReveal preset="reveal">
            <span className="v4-kicker mb-4">Visual Archive</span>
            <h2 className="v4-title">Behind the Lens</h2>
          </ScrollReveal>
          <ScrollReveal preset="fade" delay={0.12} className="mt-8">
            <GlassPanel className="relative overflow-hidden p-0">
              <div className="relative aspect-[21/9] min-h-[240px] w-full overflow-hidden bg-black">
                <BrandImage
                  src={heroSrc}
                  alt="Nexyyra Events gallery highlight"
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
                <div className="absolute bottom-6 left-6 text-sm text-white/90">
                  Editorial moments from Nexyyra Events
                </div>
              </div>
            </GlassPanel>
          </ScrollReveal>
        </div>
      </section>

      <section className="v4-section">
        <div className="brand-container">
          <LuxuryMasonryGallery assets={assets} />
        </div>
      </section>
    </div>
  );
}
