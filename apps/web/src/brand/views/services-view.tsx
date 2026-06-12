"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { BrandPageHero } from "@/brand/primitives/brand-hero";
import { BrandSection, BrandHeader } from "@/brand/primitives/brand-section";
import { BrandImage } from "@/brand/primitives/brand-image";
import { BrandButton } from "@/brand/primitives/brand-button";
import { MagneticButton } from "@/components/effects/magnetic-button";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import { BRAND_SERVICES } from "@/brand/data/content";

const EXTRA_SERVICES = [
  { slug: "award-functions", title: "Award Functions", narrative: "Red-carpet galas with broadcast-quality production and celebrity coordination.", image: BRAND_IMAGES.awards },
  { slug: "exhibitions", title: "Exhibitions", narrative: "Trade shows and brand exhibitions with immersive booth design and guest flow.", image: BRAND_IMAGES.gallery[12] },
  { slug: "fashion-shows", title: "Fashion Shows", narrative: "Runway productions with lighting design, styling, and front-row experiences.", image: BRAND_IMAGES.gallery[7] },
];

const ALL_SERVICES = [...BRAND_SERVICES, ...EXTRA_SERVICES];

const FEATURES = ["Dedicated event director", "Vendor curation", "Timeline management", "On-ground coordination"];

export function ServicesView() {
  return (
    <div className="brand-root">
      <BrandPageHero
        label="Expertise"
        title="Luxury Event Services"
        subtitle="Immersive storytelling, flawless execution, and conversion-focused experiences for India's most discerning hosts."
        image={BRAND_IMAGES.hero.wedding}
      />

      <BrandSection>
        <BrandHeader
          label="Our Promise"
          title="Every Celebration, Elevated"
          subtitle="From intimate milestones to stadium-scale productions — Glitz delivers end-to-end luxury event management with cinematic precision."
          center
        />
      </BrandSection>

      {ALL_SERVICES.map((s, i) => (
        <BrandSection key={s.slug} alt={i % 2 === 1}>
          <div className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-20 ${i % 2 === 1 ? "lg:[direction:rtl]" : ""}`}>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className={`group relative aspect-[16/10] overflow-hidden rounded-2xl ${i % 2 === 1 ? "lg:[direction:ltr]" : ""}`}
            >
              <BrandImage src={s.image} alt={s.title} fill sizes="50vw" className="transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 brand-label text-white/90">0{i + 1}</span>
            </motion.div>
            <div className={i % 2 === 1 ? "lg:[direction:ltr]" : ""}>
              <span className="brand-label">Service</span>
              <h2 className="mt-2 brand-display text-3xl font-semibold sm:text-4xl">{s.title}</h2>
              <p className="mt-4 text-[var(--glitz-muted)] leading-relaxed">{s.narrative}</p>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[var(--glitz-text)]">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--glitz-gold)]" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href={`/services/${s.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--glitz-gold)] hover:underline">
                  View Details <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/book-event" className="text-sm text-[var(--glitz-muted)] hover:text-[var(--glitz-text)]">
                  Book consultation →
                </Link>
              </div>
            </div>
          </div>
        </BrandSection>
      ))}

      <BrandSection alt>
        <div className="brand-surface mx-auto max-w-3xl p-10 text-center sm:p-14">
          <BrandHeader title="Begin Your Journey" subtitle="Schedule a private consultation with our luxury specialists." center />
          <div className="mt-8 flex justify-center">
            <MagneticButton>
              <BrandButton href="/book-event">Book Consultation</BrandButton>
            </MagneticButton>
          </div>
        </div>
      </BrandSection>
    </div>
  );
}
