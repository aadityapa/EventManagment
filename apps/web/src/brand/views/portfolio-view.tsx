"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Users, Clock } from "lucide-react";
import { BrandPageHero } from "@/brand/primitives/brand-hero";
import { BrandSection } from "@/brand/primitives/brand-section";
import { BrandImage } from "@/brand/primitives/brand-image";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import { BRAND_CASE_STUDIES } from "@/brand/data/content";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Wedding", "Corporate", "Destination", "Luxury"];

export function PortfolioView() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? BRAND_CASE_STUDIES : BRAND_CASE_STUDIES.filter((c) => c.category === active || (active === "Luxury" && c.budget.includes("Cr")));

  return (
    <div className="brand-root">
      <BrandPageHero label="Our Work" title="Luxury Case Studies" subtitle="Every project documented with precision." image={BRAND_IMAGES.hero.corporate} />
      <BrandSection>
        <div className="mb-10 flex flex-wrap justify-center gap-3">{FILTERS.map((f) => (
          <button key={f} type="button" onClick={() => setActive(f)} className={cn("rounded-full border px-5 py-2.5 text-sm font-semibold", active === f ? "border-[var(--glitz-gold)] bg-[var(--glitz-gold)]/10 text-[var(--glitz-gold)]" : "border-[var(--glitz-border)] text-muted")}>{f}</button>
        ))}</div>
        <div className="space-y-10">
          {filtered.map((cs, i) => (
            <motion.article key={cs.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="brand-surface overflow-hidden">
              <div className={`grid lg:grid-cols-2 ${i % 2 === 1 ? "lg:[direction:rtl]" : ""}`}>
                <div className={`relative min-h-[320px] ${i % 2 === 1 ? "lg:[direction:ltr]" : ""}`}><BrandImage src={cs.image} alt={cs.title} fill sizes="50vw" /></div>
                <div className={`p-8 lg:p-10 ${i % 2 === 1 ? "lg:[direction:ltr]" : ""}`}>
                  <span className="brand-label">{cs.category}</span>
                  <h2 className="mt-2 brand-display text-2xl font-semibold">{cs.title}</h2>
                  <p className="mt-3 text-sm text-muted">{cs.story}</p>
                  <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted">
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-[var(--glitz-gold)]" />{cs.venue}</span>
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-[var(--glitz-gold)]" />{cs.guests}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-[var(--glitz-gold)]" />{cs.timeline}</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-secondary">Investment: {cs.budget}</p>
                  <div className="mt-4 space-y-2 text-sm"><p><strong>Challenge:</strong> <span className="text-muted">{cs.challenge}</span></p><p><strong>Solution:</strong> <span className="text-muted">{cs.solution}</span></p><p><strong>Result:</strong> <span className="text-muted">{cs.result}</span></p></div>
                  <blockquote className="mt-4 border-l-2 border-[var(--glitz-gold)]/40 pl-4 text-sm italic">&ldquo;{cs.testimonial}&rdquo; — {cs.client}</blockquote>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </BrandSection>
    </div>
  );
}
