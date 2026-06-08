"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Gem, Crown, Sparkles } from "lucide-react";
import { BrandPageHero } from "@/brand/primitives/brand-hero";
import { BrandSection, BrandHeader } from "@/brand/primitives/brand-section";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import { BRAND_INVESTMENTS } from "@/brand/data/content";

export function PricingView() {
  return (
    <div className="brand-root">
      <BrandPageHero label="Investment" title="The Glitz Collection" subtitle="Luxury is invested in experiences, not purchased in packages." image={BRAND_IMAGES.hero.wedding} />
      <BrandSection>
        <BrandHeader title="Investment Starts From" subtitle="Each collection represents a tier of creative commitment tailored to your vision." center />
        <div className="grid gap-8 lg:grid-cols-3">
          {BRAND_INVESTMENTS.map((col, i) => {
            const Icon = col.name.includes("Boutique") ? Gem : col.name.includes("Signature") ? Crown : Sparkles;
            return (
              <motion.div key={col.name} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className={`brand-surface flex flex-col p-8 ${col.featured ? "ring-1 ring-[var(--glitz-gold)] shadow-[var(--glitz-glow)] lg:-mt-4" : ""}`}>
                {col.featured && <span className="mb-3 self-start rounded-full bg-[var(--glitz-gold)]/20 px-3 py-1 text-xs font-semibold text-[var(--glitz-gold)]">Most Requested</span>}
                <Icon className="mb-4 h-10 w-10 text-[var(--glitz-gold)]" />
                <h3 className="brand-display text-2xl font-semibold">{col.name}</h3>
                <p className="mt-1 text-sm italic text-[var(--glitz-gold)]/80">{col.tagline}</p>
                <p className="mt-4 brand-display text-3xl font-bold brand-gold-text">{col.from}</p>
                <p className="mt-4 text-sm text-[var(--glitz-muted)]">{col.narrative}</p>
                <ul className="mt-6 flex-1 space-y-2">{col.includes.map((item) => <li key={item} className="flex gap-2 text-sm"><ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--glitz-gold)]" />{item}</li>)}</ul>
                <Link href="/book-event" className="mt-8 block rounded-lg border border-[var(--glitz-gold)]/40 py-3 text-center text-sm font-semibold text-[var(--glitz-gold)] hover:bg-[var(--glitz-gold)]/10">Request Consultation</Link>
              </motion.div>
            );
          })}
        </div>
      </BrandSection>
    </div>
  );
}
