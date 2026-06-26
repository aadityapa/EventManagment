"use client";

import { Sparkles } from "lucide-react";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import { BRAND_MEDIA } from "@/brand/data/content";
import { ScrollReveal } from "@/lib/motion";

export function HomeMediaCoverage() {
  const mediaItems = [...BRAND_MEDIA, ...BRAND_MEDIA];

  return (
    <section id="media" className="v4-section relative overflow-hidden bg-[var(--glitz-surface)]" aria-labelledby="media-heading">
      <div className="brand-container">
        <ScrollReveal preset="reveal">
          <span className="v4-kicker mb-6">Press</span>
        </ScrollReveal>
        <ScrollReveal preset="reveal" delay={0.08}>
          <h2 id="media-heading" className="v4-display max-w-xl">
            Media <span className="v4-gold-text">Coverage</span>
          </h2>
        </ScrollReveal>
        <ScrollReveal preset="fade" delay={0.14}>
          <p className="v4-standfirst mt-5 max-w-xl">
            Featured in India&apos;s leading lifestyle, wedding, and business publications.
          </p>
        </ScrollReveal>

        <ScrollReveal preset="fade" delay={0.18} className="mt-10">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {BRAND_MEDIA.map((m) => (
              <span
                key={m}
                className="rounded-full border border-[var(--v4-glass-border)] bg-[var(--v4-glass-bg)] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-[var(--text-muted)] backdrop-blur-sm"
              >
                {m}
              </span>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal preset="fade" delay={0.22} className="mt-12">
          <GlassPanel variant="portal" className="mx-auto flex max-w-md items-center gap-4 px-5 py-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--glitz-gold)]/15">
              <Sparkles className="h-6 w-6 text-[var(--glitz-gold)]" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">Editorial Production Archive</p>
              <p className="text-xs text-[var(--text-muted)]">Curated press and post-event documentation available on request</p>
            </div>
          </GlassPanel>
        </ScrollReveal>

        <div className="relative mt-14 overflow-hidden">
          <div className="pointer-events-none absolute left-0 z-10 h-full w-16 bg-gradient-to-r from-[var(--glitz-surface)] to-transparent" aria-hidden />
          <div className="pointer-events-none absolute right-0 z-10 h-full w-16 bg-gradient-to-l from-[var(--glitz-surface)] to-transparent" aria-hidden />
          <div className="brand-marquee gap-12 px-6 opacity-60">
            {mediaItems.map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="flex shrink-0 items-center gap-3 whitespace-nowrap text-sm uppercase tracking-[0.2em] text-[var(--text-muted)]"
              >
                <span className="v5-hairline w-8" aria-hidden />
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
