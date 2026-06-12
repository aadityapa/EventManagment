"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { BrandPageHero } from "@/brand/primitives/brand-hero";
import { BrandSection, BrandHeader } from "@/brand/primitives/brand-section";
import { BrandImage } from "@/brand/primitives/brand-image";
import { BrandButton } from "@/brand/primitives/brand-button";
import { MagneticButton } from "@/components/effects/magnetic-button";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import { BRAND_SERVICE_CATEGORIES, BRAND_PROCESS_STEPS, BRAND_SERVICE_STATS } from "@/brand/data/content";
import { useGsapContext, gsap } from "@/lib/gsap/use-gsap";

const FEATURES = ["Dedicated event director", "Vendor curation", "Timeline management", "On-ground coordination"];

export function ServicesView() {
  const statsRef = useRef<HTMLDivElement>(null);

  useGsapContext(statsRef, () => {
    statsRef.current?.querySelectorAll("[data-count]").forEach((el) => {
      const end = Number((el as HTMLElement).dataset.end);
      const suffix = (el as HTMLElement).dataset.suffix ?? "";
      const obj = { v: 0 };
      gsap.to(obj, {
        v: end,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onUpdate: () => {
          (el as HTMLElement).textContent = `${Math.round(obj.v).toLocaleString("en-IN")}${suffix}`;
        },
      });
    });
  }, []);

  return (
    <div className="brand-root">
      <BrandPageHero
        label="Expertise"
        title="Luxury Event Services"
        subtitle="Immersive storytelling, flawless execution, and conversion-focused experiences for India's most discerning hosts."
        image={BRAND_IMAGES.hero.wedding}
      />

      <BrandSection alt>
        <BrandHeader label="By the Numbers" title="Excellence at Scale" center />
        <div ref={statsRef} className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {BRAND_SERVICE_STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p
                data-count
                data-end={s.value}
                data-suffix={s.suffix}
                className="brand-display text-4xl font-bold text-[var(--glitz-gold)]"
                aria-label={`${s.value}${s.suffix} ${s.label}`}
              >
                0{s.suffix}
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </BrandSection>

      {BRAND_SERVICE_CATEGORIES.map((s, i) => (
        <BrandSection key={s.slug} alt={i % 2 === 1}>
          <div className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-20 ${i % 2 === 1 ? "lg:[direction:rtl]" : ""}`}>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className={`group relative aspect-[16/10] overflow-hidden rounded-2xl ${i % 2 === 1 ? "lg:[direction:ltr]" : ""}`}
              style={{ transform: `translateY(${i % 2 === 0 ? 0 : 8}px)` }}
            >
              <BrandImage src={s.image} alt={s.title} fill sizes="50vw" className="transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 brand-label text-white/90">0{i + 1}</span>
            </motion.div>
            <div className={i % 2 === 1 ? "lg:[direction:ltr]" : ""}>
              <span className="brand-label">Service</span>
              <h2 className="mt-2 brand-display text-3xl font-semibold sm:text-4xl">{s.title}</h2>
              <p className="mt-4 text-muted leading-relaxed">{s.narrative}</p>
              <p className="mt-4 rounded-lg border border-[var(--glitz-gold)]/20 bg-[var(--glitz-gold)]/5 p-4 text-sm text-secondary">
                <strong className="text-[var(--glitz-gold)]">Case study:</strong> {s.caseStudy}
              </p>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-primary">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--glitz-gold)]" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href={`/services/${s.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--glitz-gold)] hover:underline">
                  View Details <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href="/book-event" className="text-sm text-muted hover:text-primary">
                  Book consultation →
                </Link>
              </div>
            </div>
          </div>
        </BrandSection>
      ))}

      <BrandSection alt>
        <BrandHeader label="Our Process" title="Five Stages to Flawless Execution" center />
        <div className="grid gap-6 md:grid-cols-5">
          {BRAND_PROCESS_STEPS.map((step) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="brand-surface p-6 text-center"
            >
              <span className="brand-display text-2xl font-bold text-[var(--glitz-gold)]">{step.step}</span>
              <h3 className="mt-2 font-semibold">{step.title}</h3>
              <p className="mt-2 text-xs text-muted leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </BrandSection>

      <BrandSection>
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
