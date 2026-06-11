"use client";

import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { BrandSection, BrandHeader } from "@/brand/primitives/brand-section";
import { BrandImage } from "@/brand/primitives/brand-image";
import { BRAND_SERVICES } from "@/brand/data/content";

export function HomeServices() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: true, skipSnaps: false });

  return (
    <BrandSection alt>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <BrandHeader
          label="Expertise"
          title="Featured Luxury Services"
          subtitle="Eight pillars of excellence — each delivered with cinematic precision."
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--glitz-border)] text-[var(--glitz-gold)] transition-colors hover:bg-[var(--glitz-gold)]/10"
            aria-label="Previous services"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--glitz-border)] text-[var(--glitz-gold)] transition-colors hover:bg-[var(--glitz-gold)]/10"
            aria-label="Next services"
          >
            <ArrowRight className="h-4 w-4" />
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
                  <BrandImage src={s.image} alt={s.title} fill sizes="30vw" className="transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--glitz-surface)] to-transparent" />
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:shadow-[inset_0_0_60px_rgba(212,175,55,0.15)]" />
                </div>
                <div className="p-5">
                  <h3 className="brand-display text-lg font-semibold group-hover:text-[var(--glitz-gold)]">{s.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-[var(--glitz-muted)]">{s.narrative}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[var(--glitz-gold)] opacity-0 transition-opacity group-hover:opacity-100">
                    Explore <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </BrandSection>
  );
}
