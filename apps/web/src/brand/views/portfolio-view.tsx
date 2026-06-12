"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Users, Clock, LayoutGrid, List } from "lucide-react";
import { BrandPageHero } from "@/brand/primitives/brand-hero";
import { BrandSection } from "@/brand/primitives/brand-section";
import { BrandImage } from "@/brand/primitives/brand-image";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import { BRAND_CASE_STUDIES } from "@/brand/data/content";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Wedding", "Corporate", "Destination", "Concert", "Luxury"];

export function PortfolioView() {
  const [active, setActive] = useState("All");
  const [view, setView] = useState<"grid" | "story">("grid");

  const filtered =
    active === "All"
      ? BRAND_CASE_STUDIES
      : BRAND_CASE_STUDIES.filter(
          (c) =>
            c.category === active ||
            (active === "Luxury" && c.budget.includes("Cr")) ||
            (active === "Concert" && c.title.toLowerCase().includes("music"))
        );

  return (
    <div className="brand-root">
      <BrandPageHero
        label="Our Work"
        title="Luxury Case Studies"
        subtitle="Every project documented with precision — browse by event type."
        image={BRAND_IMAGES.hero.corporate}
      />
      <BrandSection>
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setActive(f)}
                aria-pressed={active === f}
                className={cn(
                  "rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors",
                  active === f
                    ? "border-[var(--glitz-gold)] bg-[var(--glitz-gold)]/10 text-[var(--glitz-gold)]"
                    : "border-[var(--glitz-border)] text-muted hover:border-[var(--glitz-gold)]/40"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex gap-2" role="group" aria-label="View mode">
            <button
              type="button"
              aria-pressed={view === "grid"}
              onClick={() => setView("grid")}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg border",
                view === "grid" ? "border-[var(--glitz-gold)] text-[var(--glitz-gold)]" : "border-[var(--glitz-border)] text-muted"
              )}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-pressed={view === "story"}
              onClick={() => setView("story")}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg border",
                view === "story" ? "border-[var(--glitz-gold)] text-[var(--glitz-gold)]" : "border-[var(--glitz-border)] text-muted"
              )}
              aria-label="Story view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((cs, i) => (
                <motion.article
                  key={cs.id}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="brand-surface group cursor-pointer overflow-hidden"
                >
                  <div className="relative h-56 overflow-hidden">
                    <BrandImage src={cs.image} alt={cs.title} fill sizes="33vw" className="transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    <span className="absolute left-3 top-3 rounded-full border border-[var(--glitz-gold)]/40 bg-black/50 px-3 py-1 text-xs font-semibold text-[var(--glitz-gold)]">
                      {cs.category}
                    </span>
                    <div className="absolute bottom-0 p-4">
                      <h2 className="brand-display text-lg font-semibold text-white">{cs.title}</h2>
                      <p className="mt-1 text-xs text-white/80">{cs.venue}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-muted line-clamp-2">{cs.story}</p>
                    <p className="mt-2 text-xs font-semibold text-[var(--glitz-gold)]">{cs.budget}</p>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <motion.div key="story" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-10">
              {filtered.map((cs, i) => (
                <motion.article
                  key={cs.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="brand-surface overflow-hidden"
                >
                  <div className={`grid lg:grid-cols-2 ${i % 2 === 1 ? "lg:[direction:rtl]" : ""}`}>
                    <div className={`relative min-h-[320px] ${i % 2 === 1 ? "lg:[direction:ltr]" : ""}`}>
                      <BrandImage src={cs.image} alt={cs.title} fill sizes="50vw" />
                    </div>
                    <div className={`p-8 lg:p-10 ${i % 2 === 1 ? "lg:[direction:ltr]" : ""}`}>
                      <span className="brand-label">{cs.category}</span>
                      <h2 className="mt-2 brand-display text-2xl font-semibold">{cs.title}</h2>
                      <p className="mt-3 text-sm text-muted">{cs.story}</p>
                      <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted">
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
                      <p className="mt-2 text-sm font-semibold text-secondary">Investment: {cs.budget}</p>
                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-lg border border-[var(--glitz-border)] p-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--glitz-gold)]">Before</p>
                          <p className="mt-2 text-sm text-muted">{cs.challenge}</p>
                        </div>
                        <div className="rounded-lg border border-[var(--glitz-gold)]/30 bg-[var(--glitz-gold)]/5 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--glitz-gold)]">After</p>
                          <p className="mt-2 text-sm text-muted">{cs.result}</p>
                        </div>
                      </div>
                      <p className="mt-4 text-sm">
                        <strong>Solution:</strong> <span className="text-muted">{cs.solution}</span>
                      </p>
                      <blockquote className="mt-4 border-l-2 border-[var(--glitz-gold)]/40 pl-4 text-sm italic">
                        &ldquo;{cs.testimonial}&rdquo; — {cs.client}
                      </blockquote>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </BrandSection>
    </div>
  );
}
