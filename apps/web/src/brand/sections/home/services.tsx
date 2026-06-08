"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { BrandSection, BrandHeader } from "@/brand/primitives/brand-section";
import { BrandImage } from "@/brand/primitives/brand-image";
import { BRAND_SERVICES } from "@/brand/data/content";

export function HomeServices() {
  return (
    <BrandSection>
      <BrandHeader label="Expertise" title="Curated Luxury Services" subtitle="Eight pillars of excellence — each delivered with world-class precision." center />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {BRAND_SERVICES.map((s, i) => (
          <motion.div key={s.slug} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
            <Link href={`/services/${s.slug}`} className="group brand-surface block overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[var(--glitz-glow)]">
              <div className="relative h-44 overflow-hidden">
                <BrandImage src={s.image} alt={s.title} fill sizes="25vw" className="transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--glitz-surface)] to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="brand-display text-lg font-semibold group-hover:text-[var(--glitz-gold)]">{s.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-[var(--glitz-muted)]">{s.narrative}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[var(--glitz-gold)] opacity-0 transition-opacity group-hover:opacity-100">Explore <ArrowUpRight className="h-3 w-3" /></span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </BrandSection>
  );
}
