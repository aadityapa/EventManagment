"use client";

import { motion } from "framer-motion";
import { Award, ArrowRight, Eye, Target, Gem } from "lucide-react";
import { BrandPageHero } from "@/brand/primitives/brand-hero";
import { BrandSection, BrandHeader } from "@/brand/primitives/brand-section";
import { BrandImage } from "@/brand/primitives/brand-image";
import { BrandButton } from "@/brand/primitives/brand-button";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import { BRAND_TIMELINE, BRAND_AWARDS, BRAND_MEDIA } from "@/brand/data/content";
import { companyProfile } from "@/data/cms";

export function AboutView() {
  return (
    <div className="brand-root">
      <BrandPageHero label="Our Story" title="Crafting Legends Since 2012" subtitle="India's premier luxury event house." image={BRAND_IMAGES.about} />
      <BrandSection>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <BrandHeader label="Founder Philosophy" title="We Architect Experiences, Not Events" subtitle={companyProfile.introduction} />
            <p className="mt-4 text-[var(--glitz-muted)] leading-relaxed">Every celebration carries the weight of memory. That responsibility drives everything we do at Glitz Events & Promotions.</p>
            <BrandButton href="/book-event">Book Consultation <ArrowRight className="h-4 w-4" /></BrandButton>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl"><BrandImage src={BRAND_IMAGES.hero.palace} alt="Luxury venue" fill sizes="50vw" /></div>
        </div>
      </BrandSection>
      <BrandSection alt>
        <div className="grid gap-6 md:grid-cols-3">
          {[{ icon: Eye, t: "Vision", c: companyProfile.vision }, { icon: Target, t: "Mission", c: companyProfile.mission }, { icon: Gem, t: "Philosophy", c: "Luxury is intention — every detail deliberately crafted." }].map(({ icon: Icon, t, c }) => (
            <motion.div key={t} whileHover={{ y: -4 }} className="brand-surface p-8"><Icon className="mb-4 h-8 w-8 text-[var(--glitz-gold)]" /><h3 className="brand-display text-xl font-semibold">{t}</h3><p className="mt-3 text-sm text-[var(--glitz-muted)]">{c}</p></motion.div>
          ))}
        </div>
      </BrandSection>
      <BrandSection>
        <BrandHeader label="Journey" title="Company Timeline" center />
        <div className="mx-auto max-w-2xl space-y-8">
          {BRAND_TIMELINE.map((item) => (
            <div key={item.year} className="flex gap-6 border-l-2 border-[var(--glitz-gold)]/30 pl-6">
              <span className="brand-display text-lg font-bold text-[var(--glitz-gold)]">{item.year}</span>
              <p className="text-[var(--glitz-muted)]">{item.event}</p>
            </div>
          ))}
        </div>
      </BrandSection>
      <BrandSection alt>
        <BrandHeader label="Recognition" title="Awards & Achievements" center />
        <div className="grid gap-4 sm:grid-cols-2">{BRAND_AWARDS.map((a) => (
          <div key={a.title} className="brand-surface flex gap-4 p-6"><Award className="h-8 w-8 shrink-0 text-[var(--glitz-gold)]" /><div><h3 className="font-semibold">{a.title}</h3><p className="text-sm text-[var(--glitz-muted)]">{a.org} · {a.year}</p></div></div>
        ))}</div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">{BRAND_MEDIA.map((m) => <span key={m} className="rounded-full border border-[var(--glitz-border)] px-5 py-2 text-sm text-[var(--glitz-muted)]">{m}</span>)}</div>
      </BrandSection>
    </div>
  );
}
