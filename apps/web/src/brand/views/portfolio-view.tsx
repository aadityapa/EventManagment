"use client";

import { useRef, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MapPin, Users, Clock, LayoutGrid, List, ArrowUpRight, Play } from "lucide-react";
import { BrandImage } from "@/brand/primitives/brand-image";
import { BrandButton } from "@/brand/primitives/brand-button";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import { MagneticButton } from "@/components/effects/magnetic-button";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import { BRAND_CASE_STUDIES } from "@/brand/data/content";
import { ScrollReveal, Parallax, EASE, DUR } from "@/lib/motion";
import { useGsapContext, gsap } from "@/lib/gsap/use-gsap";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const FILTERS = [
  "All",
  "Wedding",
  "Corporate",
  "Concert",
  "Destination",
  "Fashion",
  "Awards",
  "Luxury",
] as const;

type Filter = (typeof FILTERS)[number];

function matchesFilter(cs: (typeof BRAND_CASE_STUDIES)[number], filter: Filter) {
  if (filter === "All") return true;
  if (filter === "Luxury") return cs.budget.includes("Cr");
  if (filter === "Concert") {
    return cs.title.toLowerCase().includes("music") || cs.category.toLowerCase().includes("concert");
  }
  if (filter === "Fashion") return cs.title.toLowerCase().includes("fashion");
  if (filter === "Awards") return cs.title.toLowerCase().includes("award") || cs.category === "Awards";
  return cs.category === filter;
}

export function PortfolioView() {
  const [active, setActive] = useState<Filter>("All");
  const [view, setView] = useState<"grid" | "story">("grid");
  const featuredRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const filtered = useMemo(
    () => BRAND_CASE_STUDIES.filter((c) => matchesFilter(c, active)),
    [active]
  );
  const featured = filtered[0] ?? BRAND_CASE_STUDIES[0];
  const gridItems = filtered.filter((c) => c.id !== featured.id);

  useGsapContext(featuredRef, () => {
    if (reducedMotion) return;
    const section = featuredRef.current;
    if (!section) return;
    const caption = section.querySelector("[data-featured-caption]");
    if (!caption) return;

    gsap.fromTo(
      caption,
      { y: 40, opacity: 0.6 },
      {
        y: 0,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=60%",
          pin: true,
          scrub: 1,
        },
      }
    );
  }, [reducedMotion, featured.id]);

  return (
    <div className="brand-root">
      {/* ACT 1 — Hero */}
      <section className="relative flex min-h-[72svh] items-end overflow-hidden">
        <BrandImage
          src={BRAND_IMAGES.hero.corporate}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25" />
        <div className="brand-container relative w-full pb-16 pt-32 sm:pb-20">
          <GlassPanel className="max-w-2xl px-8 py-10 sm:px-10">
            <span className="v4-kicker mb-4">Our Films</span>
            <h1 className="v4-display text-white">
              Luxury <span className="v4-gold-text">Portfolio</span>
            </h1>
            <p className="v4-standfirst mt-4 text-white/80">
              Every project documented with cinematic precision — browse by event type, scale, and
              destination.
            </p>
          </GlassPanel>
        </div>
      </section>

      {/* ACT 2 — Filters + view toggle */}
      <section className="sticky top-[var(--header-height,3.75rem)] z-30 border-b border-[var(--glitz-border)] bg-[var(--glitz-glass)]/95 backdrop-blur-xl">
        <div className="brand-container flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter portfolio">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => {
                  setActive(f);
                  analytics.ctaClick(`filter_${f.toLowerCase()}`, "portfolio_filters");
                }}
                aria-pressed={active === f}
                className={cn(
                  "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-300",
                  active === f
                    ? "border-[var(--glitz-gold)] bg-[var(--glitz-gold)]/12 text-[var(--glitz-gold)] shadow-[var(--v4-glow-gold-sm)]"
                    : "border-[var(--glitz-border)] text-[var(--text-secondary)] hover:border-[var(--glitz-gold)]/35"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex gap-2" role="group" aria-label="View mode">
            {(
              [
                { mode: "grid" as const, icon: LayoutGrid, label: "Grid view" },
                { mode: "story" as const, icon: List, label: "Story view" },
              ] as const
            ).map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                type="button"
                aria-pressed={view === mode}
                aria-label={label}
                onClick={() => setView(mode)}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg border transition-colors",
                  view === mode
                    ? "border-[var(--glitz-gold)] text-[var(--glitz-gold)]"
                    : "border-[var(--glitz-border)] text-muted hover:border-[var(--glitz-gold)]/40"
                )}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ACT 3 — Featured case film (sticky pin) */}
      <section
        ref={featuredRef}
        id={featured.id}
        className="relative min-h-[100svh] bg-[var(--glitz-bg)]"
        aria-labelledby="featured-case-heading"
      >
        <div className="relative h-[100svh] overflow-hidden">
          <Parallax distance={50} className="absolute inset-0">
            <BrandImage
              src={featured.image}
              alt={featured.title}
              fill
              sizes="100vw"
              className="scale-105 object-cover"
            />
          </Parallax>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />
          <div
            data-featured-caption
            className="absolute inset-x-0 bottom-0 brand-container pb-16 pt-24 sm:pb-20"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--glitz-gold)]">
              Featured · {featured.category}
            </span>
            <h2 id="featured-case-heading" className="v4-display mt-3 max-w-3xl text-white">
              {featured.title}
            </h2>
            <p className="v4-standfirst mt-4 max-w-xl text-white/80">{featured.story}</p>
            <div className="mt-6 flex flex-wrap gap-5 text-sm text-white/65">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-[var(--glitz-gold)]" aria-hidden="true" />
                {featured.venue}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-[var(--glitz-gold)]" aria-hidden="true" />
                {featured.guests} guests
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[var(--glitz-gold)]" aria-hidden="true" />
                {featured.timeline}
              </span>
            </div>
            <button
              type="button"
              className="group mt-8 inline-flex items-center gap-3 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-[var(--glitz-gold)]/50"
              aria-label="Play case film preview"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--glitz-gold)]/60 bg-[var(--glitz-gold)]/15">
                <Play className="h-4 w-4 text-[var(--glitz-gold)]" aria-hidden="true" />
              </span>
              Watch Preview
            </button>
          </div>
        </div>
      </section>

      {/* ACT 4 — Grid or story */}
      <section className="v4-section bg-[var(--glitz-surface)]">
        <div className="brand-container">
          <ScrollReveal preset="reveal">
            <span className="v4-kicker mb-4">Case Studies</span>
            <h2 className="v4-display">
              {active === "All" ? "All Productions" : `${active} Events`}
            </h2>
          </ScrollReveal>

          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-10 text-muted"
              >
                No case studies in this category yet —{" "}
                <button
                  type="button"
                  onClick={() => setActive("All")}
                  className="font-semibold text-[var(--glitz-gold)] hover:underline"
                >
                  view all work
                </button>
                .
              </motion.p>
            ) : view === "grid" ? (
              <motion.div
                key={`grid-${active}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DUR.base, ease: EASE.luxe }}
                className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              >
                {[featured, ...gridItems].map((cs, i) => (
                  <CaseGridCard key={cs.id} cs={cs} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key={`story-${active}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-12 space-y-16"
              >
                {filtered.map((cs, i) => (
                  <StoryCaseCard key={cs.id} cs={cs} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ACT 5 — CTA */}
      <section className="v4-section-lg v4-dune-glow bg-[var(--glitz-bg)]">
        <div className="brand-container">
          <ScrollReveal preset="scale">
            <GlassPanel glow className="mx-auto max-w-3xl px-8 py-14 text-center sm:px-14">
              <h2 className="v4-display">Ready for your own story?</h2>
              <p className="v4-standfirst mx-auto mt-4 max-w-lg">
                Let our creative directors craft a bespoke celebration — from vision to standing
                ovation.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <MagneticButton>
                  <BrandButton
                    href="/book-event"
                    onClick={() => analytics.ctaClick("book_consultation", "portfolio_cta")}
                  >
                    Book Consultation
                  </BrandButton>
                </MagneticButton>
                <Link
                  href="/contact"
                  onClick={() => analytics.ctaClick("contact", "portfolio_cta")}
                  className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--glitz-gold)] hover:text-[var(--glitz-gold-light)]"
                >
                  Speak to a Concierge
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </GlassPanel>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

function CaseGridCard({
  cs,
  index,
}: {
  cs: (typeof BRAND_CASE_STUDIES)[number];
  index: number;
}) {
  return (
    <motion.article
      id={cs.id}
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.05, duration: DUR.base, ease: EASE.luxe }}
      whileHover={{ y: -6 }}
      className="group v4-glass overflow-hidden rounded-[var(--v4-radius-lg)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <BrandImage
          src={cs.image}
          alt={cs.title}
          fill
          sizes="33vw"
          className="object-cover transition-transform duration-[1.2s] ease-[var(--v4-ease-luxe)] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--glitz-gold)]/50 bg-black/40 backdrop-blur-sm">
            <Play className="h-5 w-5 text-[var(--glitz-gold)]" aria-hidden="true" />
          </span>
        </div>
        <span className="absolute left-4 top-4 rounded-full border border-[var(--glitz-gold)]/40 bg-black/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--glitz-gold)]">
          {cs.category}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-white">
            {cs.title}
          </h3>
          <p className="mt-1 text-xs text-white/70">{cs.venue}</p>
        </div>
      </div>
      <div className="p-5">
        <p className="line-clamp-2 text-sm text-[var(--text-secondary)]">{cs.story}</p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-[var(--glitz-gold)]">
          {cs.budget}
        </p>
      </div>
    </motion.article>
  );
}

function StoryCaseCard({
  cs,
  index,
}: {
  cs: (typeof BRAND_CASE_STUDIES)[number];
  index: number;
}) {
  const flip = index % 2 === 1;

  return (
    <motion.article
      id={cs.id}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: DUR.slow, ease: EASE.luxe }}
      className="v4-glass overflow-hidden rounded-[var(--v4-radius-xl)]"
    >
      <div className={cn("grid lg:grid-cols-2", flip && "lg:[direction:rtl]")}>
        <div className={cn("relative min-h-[320px]", flip && "lg:[direction:ltr]")}>
          <BrandImage src={cs.image} alt={cs.title} fill sizes="50vw" />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className={cn("p-8 lg:p-12", flip && "lg:[direction:ltr]")}>
          <span className="v4-kicker mb-3">{cs.category}</span>
          <h3 className="v4-display text-2xl sm:text-3xl">{cs.title}</h3>
          <p className="v4-body mt-4">{cs.story}</p>
          <div className="mt-5 flex flex-wrap gap-4 text-xs text-muted">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-[var(--glitz-gold)]" aria-hidden="true" />
              {cs.venue}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-[var(--glitz-gold)]" aria-hidden="true" />
              {cs.guests}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-[var(--glitz-gold)]" aria-hidden="true" />
              {cs.timeline}
            </span>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <GlassPanel liquid={false} className="p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--glitz-gold)]">
                Challenge
              </p>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{cs.challenge}</p>
            </GlassPanel>
            <GlassPanel className="p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--glitz-gold)]">
                Result
              </p>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{cs.result}</p>
            </GlassPanel>
          </div>
          <blockquote className="mt-6 border-l-2 border-[var(--glitz-gold)]/35 pl-4 text-sm italic text-[var(--text-secondary)]">
            &ldquo;{cs.testimonial}&rdquo; — {cs.client}
          </blockquote>
        </div>
      </div>
    </motion.article>
  );
}
