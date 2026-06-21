"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, MapPin, Play, Users } from "lucide-react";
import { BrandImage } from "@/brand/primitives/brand-image";
import { BRAND_CASE_STUDIES } from "@/brand/data/content";
import { ScrollReveal } from "@/lib/motion";
import { useGsapContext, gsap } from "@/lib/gsap/use-gsap";
import { analytics } from "@/lib/analytics";
import { useReducedMotion } from "framer-motion";

export function HomePortfolioShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGsapContext(sectionRef, () => {
    if (reducedMotion) return;
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;
    if (window.matchMedia("(max-width: 767px)").matches) return;

    const getScrollDistance = () => Math.max(0, track.scrollWidth - section.offsetWidth);

    gsap.to(track, {
      x: () => -getScrollDistance(),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${getScrollDistance() + 240}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="archive"
      className="relative overflow-hidden bg-[var(--glitz-surface)]"
      aria-labelledby="portfolio-heading"
    >
      <div className="brand-container flex min-h-[100svh] flex-col justify-center py-[var(--v4-section)]">
        <ScrollReveal preset="reveal">
          <span className="v4-kicker mb-6">The Archive</span>
        </ScrollReveal>
        <ScrollReveal preset="reveal" delay={0.08}>
          <h2 id="portfolio-heading" className="v4-display max-w-2xl">
            Portfolio <span className="v4-gold-text">Universe</span>
          </h2>
        </ScrollReveal>
        <ScrollReveal preset="fade" delay={0.12}>
          <p className="v4-standfirst mt-5 max-w-xl">
            Every celebration tells a story worth remembering — scroll through our signature productions.
          </p>
        </ScrollReveal>

        <div className="mt-12 overflow-hidden">
          <div
            ref={trackRef}
            className={reducedMotion ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" : "flex gap-6 will-change-transform md:gap-8"}
          >
            {BRAND_CASE_STUDIES.map((cs) => (
              <CaseCard key={cs.id} cs={cs} stacked={!!reducedMotion} />
            ))}
          </div>
        </div>

        <ScrollReveal preset="reveal" delay={0.1} className="mt-12">
          <Link
            href="/portfolio"
            onClick={() => analytics.ctaClick("view_portfolio", "home_portfolio_showcase")}
            className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--glitz-gold)] transition-colors hover:text-[var(--glitz-gold-light)]"
          >
            Enter the Archive
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

function CaseCard({
  cs,
  stacked,
}: {
  cs: (typeof BRAND_CASE_STUDIES)[number];
  stacked: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      data-case-card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={
        stacked
          ? "group overflow-hidden rounded-[var(--v4-radius-lg)]"
          : "group relative w-[85vw] shrink-0 overflow-hidden rounded-[var(--v4-radius-lg)] sm:w-[60vw] lg:w-[42vw]"
      }
    >
      <Link href={`/portfolio/${cs.id}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          <BrandImage
            src={cs.image}
            alt={cs.title}
            fill
            sizes="50vw"
            className="object-cover transition-transform duration-[1.2s] ease-[var(--v4-ease-luxe)] group-hover:scale-105"
          />
          {hovered && !stacked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity" aria-hidden>
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--glitz-gold)]/50 bg-black/50">
                <Play className="h-6 w-6 text-[var(--glitz-gold)]" />
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--glitz-gold)]">
              {cs.category}
            </span>
            <h3 className="mt-2 font-[family-name:var(--font-playfair)] text-2xl font-semibold text-white sm:text-3xl">
              {cs.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-white/75">{cs.story}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-white/60">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-[var(--glitz-gold)]" aria-hidden="true" />
                {cs.venue}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-[var(--glitz-gold)]" aria-hidden="true" />
                {cs.guests} guests
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
