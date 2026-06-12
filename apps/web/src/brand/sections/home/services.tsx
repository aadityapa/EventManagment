"use client";

import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Heart, Building2, Plane, Music, Rocket, Megaphone, Star, Cake } from "lucide-react";
import { BrandSection, BrandHeader } from "@/brand/primitives/brand-section";
import { BrandImage } from "@/brand/primitives/brand-image";
import { BRAND_SERVICES } from "@/brand/data/content";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const FEATURE_ICONS: Record<string, typeof Heart> = {
  "wedding-planning": Heart,
  "corporate-events": Building2,
  "destination-weddings": Plane,
  "concert-management": Music,
  "product-launches": Rocket,
  "brand-promotions": Megaphone,
  "celebrity-management": Star,
  "birthday-events": Cake,
};

export function HomeServices() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: true, skipSnaps: false });
  const gridRef = useScrollReveal<HTMLDivElement>({ delay: 1 });

  return (
    <>
      <BrandSection id="services">
        <div ref={gridRef}>
          <BrandHeader
            label="Expertise"
            title="Featured Luxury Services"
            subtitle="Eight pillars of excellence — each delivered with cinematic precision for weddings, corporate galas, and destination celebrations."
            center
          />
          <div className="grid-responsive-3">
            {BRAND_SERVICES.map((s) => {
              const Icon = FEATURE_ICONS[s.slug] ?? Star;
              return (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="group brand-surface flex flex-col p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--glitz-glow)]"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--glitz-gold)]/10 text-[var(--glitz-gold)] transition-colors group-hover:bg-[var(--glitz-gold)]/20">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="brand-display text-lg font-semibold group-hover:text-[var(--glitz-gold)]">{s.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--glitz-muted)]">{s.narrative}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[var(--glitz-gold)]">
                    Explore <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </BrandSection>

      <BrandSection alt>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <BrandHeader
            label="Portfolio Highlights"
            title="Curated Event Experiences"
            subtitle="Swipe through our signature productions — from palace weddings to stadium concerts."
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              className="tap-target flex h-11 w-11 items-center justify-center rounded-full border border-[var(--glitz-border)] text-[var(--glitz-gold)] transition-colors hover:bg-[var(--glitz-gold)]/10"
              aria-label="Previous services"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              className="tap-target flex h-11 w-11 items-center justify-center rounded-full border border-[var(--glitz-border)] text-[var(--glitz-gold)] transition-colors hover:bg-[var(--glitz-gold)]/10"
              aria-label="Next services"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div ref={emblaRef} className="mt-10 overflow-hidden">
          <div className="flex gap-5">
            {BRAND_SERVICES.map((s, i) => (
              <motion.div
                key={s.slug}
                className="min-w-0 flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_30%]"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/services/${s.slug}`}
                  className="group brand-surface block h-full overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[var(--glitz-glow)]"
                >
                  <div className="relative h-48 overflow-hidden">
                    <BrandImage src={s.image} alt={s.title} fill sizes="30vw" loading="lazy" className="transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--glitz-surface)] to-transparent" aria-hidden="true" />
                  </div>
                  <div className="p-5">
                    <h3 className="brand-display text-lg font-semibold group-hover:text-[var(--glitz-gold)]">{s.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-[var(--glitz-muted)]">{s.narrative}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </BrandSection>
    </>
  );
}
