"use client";

import { useCallback, useEffect, useId, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Star } from "lucide-react";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import { testimonials } from "@/data/cms";
import { ScrollReveal } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** V5 Ch.7 — Voices: video-story style testimonial carousel. */
export function HomeTestimonialsV5() {
  const carouselId = useId();
  const [active, setActive] = useState(0);
  const t = testimonials[active];

  const prev = useCallback(() => {
    setActive((i) => (i - 1 + testimonials.length) % testimonials.length);
  }, []);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    const id = window.setInterval(next, 8000);
    return () => window.clearInterval(id);
  }, [next]);

  return (
    <section id="voices" className="v4-section v4-dune-glow relative bg-[var(--glitz-bg)]" aria-labelledby="voices-heading">
      <div className="brand-container">
        <ScrollReveal preset="reveal">
          <span className="v4-kicker mb-6">Voices</span>
        </ScrollReveal>
        <ScrollReveal preset="reveal" delay={0.08}>
          <h2 id="voices-heading" className="v4-display max-w-xl">
            Stories They <span className="v4-gold-text">Inherit</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal preset="fade" delay={0.12} className="mt-12">
          <GlassPanel glow variant="commission" className="relative mx-auto max-w-4xl overflow-hidden px-8 py-12 sm:px-14 sm:py-16">
            <div
              id={carouselId}
              role="region"
              aria-roledescription="carousel"
              aria-label="Client testimonial"
              aria-live="polite"
            >
              <div className="mb-8 flex items-center gap-4">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--glitz-gold)]/40 bg-[var(--glitz-gold)]/10"
                  aria-hidden
                >
                  <Play className="h-5 w-5 text-[var(--glitz-gold)]" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--glitz-gold)]">
                    Client Story
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">{t?.role}</p>
                </div>
              </div>

              <blockquote className="font-[family-name:var(--font-cormorant)] text-2xl italic leading-snug text-[var(--text-primary)] sm:text-3xl lg:text-4xl">
                &ldquo;{t?.content}&rdquo;
              </blockquote>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="mb-1 flex gap-0.5" aria-label={`${t?.rating ?? 5} out of 5 stars`}>
                    {Array.from({ length: t?.rating ?? 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[var(--glitz-gold)] text-[var(--glitz-gold)]" aria-hidden />
                    ))}
                  </div>
                  <p className="font-semibold text-[var(--text-primary)]">{t?.name}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={prev}
                    aria-controls={carouselId}
                    aria-label="Previous testimonial"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--v4-glass-border)] text-[var(--glitz-gold)] transition-colors hover:bg-[var(--glitz-gold)]/10"
                  >
                    <ChevronLeft aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-controls={carouselId}
                    aria-label="Next testimonial"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--v4-glass-border)] text-[var(--glitz-gold)] transition-colors hover:bg-[var(--glitz-gold)]/10"
                  >
                    <ChevronRight aria-hidden />
                  </button>
                </div>
              </div>

              <div className="mt-6 flex justify-center gap-1.5" aria-hidden>
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
        </ScrollReveal>

        <ScrollReveal preset="fade" delay={0.16} className="mt-8 text-center">
          <Link href="/testimonials" className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--glitz-gold)] hover:text-[var(--glitz-gold-light)]">
            All Client Stories →
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
