"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BrandPageHero } from "@/brand/primitives/brand-hero";
import { BrandSection, BrandHeader } from "@/brand/primitives/brand-section";
import { BrandImage } from "@/brand/primitives/brand-image";
import { BrandButton } from "@/brand/primitives/brand-button";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import { BRAND_SERVICES } from "@/brand/data/content";

export function ServicesView() {
  return (
    <div className="brand-root">
      <BrandPageHero label="Expertise" title="Luxury Event Services" subtitle="Immersive storytelling. Flawless execution." image={BRAND_IMAGES.hero.wedding} />
      {BRAND_SERVICES.map((s, i) => (
        <BrandSection key={s.slug} alt={i % 2 === 1}>
          <div className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-20 ${i % 2 === 1 ? "lg:[direction:rtl]" : ""}`}>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className={`relative aspect-[16/10] overflow-hidden rounded-2xl ${i % 2 === 1 ? "lg:[direction:ltr]" : ""}`}>
              <BrandImage src={s.image} alt={s.title} fill sizes="50vw" />
            </motion.div>
            <div className={i % 2 === 1 ? "lg:[direction:ltr]" : ""}>
              <span className="brand-label">0{i + 1}</span>
              <h2 className="mt-2 brand-display text-3xl font-semibold sm:text-4xl">{s.title}</h2>
              <p className="mt-4 text-[var(--glitz-muted)] leading-relaxed">{s.narrative}</p>
              <Link href={`/services/${s.slug}`} className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[var(--glitz-gold)] hover:underline">Explore Service <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </BrandSection>
      ))}
      <BrandSection>
        <div className="text-center"><BrandHeader title="Begin Your Journey" center /><BrandButton href="/book-event">Book Consultation</BrandButton></div>
      </BrandSection>
    </div>
  );
}
