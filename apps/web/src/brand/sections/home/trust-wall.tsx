"use client";

import { useCallback, useEffect, useId, useState } from "react";
import Link from "next/link";
import { Award, ChevronLeft, ChevronRight, ExternalLink, Shield, Star } from "lucide-react";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import {
  BRAND_AWARDS,
  BRAND_MEDIA,
  BRAND_TRUST,
} from "@/brand/data/content";
import { testimonials } from "@/data/cms";
import { ScrollReveal } from "@/lib/motion";
import { cn } from "@/lib/utils";

const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/search/?api=1&query=Glitz+Events+Pune+reviews";

export function HomeTrustWall() {
  const carouselId = useId();
  const [active, setActive] = useState(0);
  const t = testimonials[active];
  const items = [...BRAND_TRUST, ...BRAND_TRUST];

  const prev = useCallback(() => {
    setActive((i) => (i - 1 + testimonials.length) % testimonials.length);
  }, []);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    const id = window.setInterval(next, 7000);
    return () => window.clearInterval(id);
  }, [next]);

  return (
    <section id="trust" className="v4-section v4-dune-glow relative bg-[var(--glitz-bg)]">
      <div className="brand-container">
        <ScrollReveal preset="reveal">
          <span className="v4-kicker mb-6">Trust & Recognition</span>
        </ScrollReveal>

        {/* Single-focus testimonial */}
        <GlassPanel glow className="relative mx-auto max-w-4xl px-8 py-12 sm:px-14 sm:py-16">
          <div
            id={carouselId}
            role="region"
            aria-roledescription="carousel"
            aria-label="Client testimonial"
          >
            <blockquote className="font-[family-name:var(--font-cormorant)] text-2xl italic leading-snug text-[var(--text-primary)] sm:text-3xl lg:text-4xl">
              &ldquo;{t?.content}&rdquo;
            </blockquote>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="mb-1 flex gap-0.5" aria-label={`${t?.rating} out of 5 stars`}>
                  {Array.from({ length: t?.rating ?? 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-[var(--glitz-gold)] text-[var(--glitz-gold)]"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="font-semibold text-[var(--text-primary)]">{t?.name}</p>
                <p className="text-sm text-[var(--text-secondary)]">{t?.role}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={prev}
                  aria-controls={carouselId}
                  aria-label="Previous testimonial"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--v4-glass-border)] text-[var(--glitz-gold)] transition-colors hover:bg-[var(--glitz-gold)]/10"
                >
                  <ChevronLeft aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-controls={carouselId}
                  aria-label="Next testimonial"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--v4-glass-border)] text-[var(--glitz-gold)] transition-colors hover:bg-[var(--glitz-gold)]/10"
                >
                  <ChevronRight aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="mt-6 flex justify-center gap-1.5" aria-hidden="true">
              {testimonials.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1 rounded-full transition-all duration-500",
                    i === active ? "w-8 bg-[var(--glitz-gold)]" : "w-1.5 bg-[var(--glitz-gold)]/25"
                  )}
                />
              ))}
            </div>
          </div>
        </GlassPanel>

        {/* Awards + media + credentials */}
        <ScrollReveal preset="fade" delay={0.1} className="mt-14">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {BRAND_AWARDS.slice(0, 4).map((a) => (
              <div
                key={a.title}
                className="flex items-center gap-2 rounded-full border border-[var(--v4-glass-border)] bg-[var(--v4-glass-bg)] px-4 py-2 text-xs text-[var(--text-secondary)] backdrop-blur-sm"
              >
                <Award className="h-3.5 w-3.5 shrink-0 text-[var(--glitz-gold)]" aria-hidden="true" />
                {a.title} · {a.year}
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal preset="fade" delay={0.14} className="mt-6 flex flex-wrap justify-center gap-2">
          {BRAND_MEDIA.map((m) => (
            <span
              key={m}
              className="rounded-full border border-[var(--v4-glass-border)] px-3 py-1 text-xs text-[var(--text-muted)]"
            >
              As seen in {m}
            </span>
          ))}
        </ScrollReveal>

        <ScrollReveal preset="fade" delay={0.18} className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-[var(--text-muted)]">
          <span className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-[var(--glitz-gold)]" aria-hidden="true" />
            ISO-aligned processes
          </span>
          <Link
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-[var(--glitz-gold)] hover:underline"
          >
            Google Reviews <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </Link>
          <Link href="/testimonials" className="font-semibold text-[var(--text-secondary)] hover:text-[var(--glitz-gold)]">
            Client Stories →
          </Link>
        </ScrollReveal>

        {/* Partner marquee */}
        <div className="relative mt-14 overflow-hidden">
          <div className="pointer-events-none absolute left-0 z-10 h-full w-16 bg-gradient-to-r from-[var(--glitz-bg)] to-transparent" aria-hidden="true" />
          <div className="pointer-events-none absolute right-0 z-10 h-full w-16 bg-gradient-to-l from-[var(--glitz-bg)] to-transparent" aria-hidden="true" />
          <div className="brand-marquee gap-14 px-6">
            {items.map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="flex shrink-0 items-center gap-3 whitespace-nowrap font-[family-name:var(--font-playfair)] text-sm text-[var(--text-muted)] sm:text-base"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--glitz-gold)]" aria-hidden="true" />
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
