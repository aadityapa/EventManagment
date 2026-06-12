"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Users } from "lucide-react";
import { BrandSection, BrandHeader } from "@/brand/primitives/brand-section";
import { BrandImage } from "@/brand/primitives/brand-image";
import { BRAND_CASE_STUDIES } from "@/brand/data/content";

export function HomeCaseStudies() {
  return (
    <BrandSection alt>
      <BrandHeader label="Portfolio" title="Case Studies in Excellence" subtitle="Every celebration tells a story worth remembering." center />
      <div className="space-y-8">
        {BRAND_CASE_STUDIES.map((cs, i) => (
          <motion.article key={cs.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="brand-surface overflow-hidden">
            <div className={`grid lg:grid-cols-2 ${i % 2 === 1 ? "lg:[direction:rtl]" : ""}`}>
              <div className={`relative aspect-[16/10] lg:min-h-[340px] ${i % 2 === 1 ? "lg:[direction:ltr]" : ""}`}>
                <BrandImage src={cs.image} alt={cs.title} fill sizes="50vw" />
              </div>
              <div className={`flex flex-col justify-center p-8 lg:p-10 ${i % 2 === 1 ? "lg:[direction:ltr]" : ""}`}>
                <span className="brand-label">{cs.category}</span>
                <h3 className="mt-2 brand-display text-2xl font-semibold">{cs.title}</h3>
                <p className="mt-3 text-sm text-muted">{cs.story}</p>
                <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-[var(--glitz-gold)]" />{cs.venue}</span>
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-[var(--glitz-gold)]" />{cs.guests} guests</span>
                  <span className="font-semibold text-secondary">Investment: {cs.budget}</span>
                </div>
                <blockquote className="mt-4 border-l-2 border-[var(--glitz-gold)]/40 pl-4 text-sm italic text-muted">&ldquo;{cs.testimonial}&rdquo; — {cs.client}</blockquote>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link href="/portfolio" className="text-sm font-semibold uppercase tracking-wider text-[var(--glitz-gold)] hover:underline">View Full Portfolio</Link>
      </div>
    </BrandSection>
  );
}
