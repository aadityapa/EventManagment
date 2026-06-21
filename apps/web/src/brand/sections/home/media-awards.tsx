"use client";

import { Award, Play } from "lucide-react";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import { BRAND_AWARDS, BRAND_MEDIA } from "@/brand/data/content";
import { ScrollReveal } from "@/lib/motion";

/** V5 Ch.8 — Recognition strip: press logos + awards marquee. */
export function HomeMediaAwards() {
  const mediaItems = [...BRAND_MEDIA, ...BRAND_MEDIA];

  return (
    <section id="recognition" className="v4-section relative overflow-hidden bg-[var(--glitz-surface)]" aria-labelledby="recognition-heading">
      <div className="brand-container">
        <ScrollReveal preset="reveal">
          <span className="v4-kicker mb-6">Recognition</span>
        </ScrollReveal>
        <ScrollReveal preset="reveal" delay={0.08}>
          <h2 id="recognition-heading" className="v4-display max-w-xl">
            Media &amp; <span className="v4-gold-text">Awards</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal preset="fade" delay={0.12} className="mt-10">
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

        <ScrollReveal preset="fade" delay={0.16} className="mt-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BRAND_AWARDS.map((a) => (
              <GlassPanel key={a.title} variant="commission" className="px-4 py-4">
                <Award className="mb-2 h-4 w-4 text-[var(--glitz-gold)]" aria-hidden />
                <p className="text-sm font-semibold text-[var(--text-primary)]">{a.title}</p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {a.org} · {a.year}
                </p>
              </GlassPanel>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal preset="fade" delay={0.2} className="mt-12">
          <GlassPanel variant="portal" className="mx-auto flex max-w-md items-center gap-4 px-5 py-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--glitz-gold)]/15">
              <Play className="h-6 w-6 text-[var(--glitz-gold)]" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">Showreel Preview</p>
              <p className="text-xs text-[var(--text-muted)]">15-second highlight — full film on request</p>
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
