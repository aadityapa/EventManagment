"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BrandPageHero } from "@/brand/primitives/brand-hero";
import { BrandSection } from "@/brand/primitives/brand-section";
import { BrandImage } from "@/brand/primitives/brand-image";
import { BrandLightbox } from "@/brand/primitives/brand-lightbox";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Weddings", "Corporate", "Concerts", "Decor", "Destinations"] as const;
const CATS = ["Weddings", "Corporate", "Concerts", "Decor", "Weddings", "Weddings", "Weddings", "Corporate", "Corporate", "Weddings", "Destinations", "Corporate", "Corporate", "Weddings", "Destinations"] as const;
const TITLES = ["Royal Engagement", "Corporate Gala", "Live Concert", "Sangeet Night", "Premium Decor", "Grand Reception", "Bridal Elegance", "Fine Dining", "Product Launch", "Mehendi", "Destination Wedding", "Award Night", "Brand Activation", "Private Celebration", "Palace Ceremony"];

export function GalleryView() {
  const [active, setActive] = useState<(typeof FILTERS)[number]>("All");
  const [lb, setLb] = useState<number | null>(null);
  const items = BRAND_IMAGES.gallery.map((src, i) => ({ src, alt: TITLES[i] ?? `Event ${i + 1}`, cat: CATS[i] ?? "Weddings", h: i % 3 === 0 ? 520 : i % 3 === 1 ? 380 : 460 }));
  const filtered = active === "All" ? items : items.filter((x) => x.cat === active);

  return (
    <div className="brand-root">
      <BrandPageHero label="Visual Stories" title="Immersive Gallery" subtitle="Pinterest-quality luxury masonry." image={BRAND_IMAGES.gallery[0]} />
      <BrandSection>
        <div className="mb-10 flex flex-wrap justify-center gap-3">{FILTERS.map((f) => (
          <button key={f} type="button" onClick={() => setActive(f)} className={cn("rounded-full border px-5 py-2.5 text-sm font-semibold", active === f ? "border-[var(--glitz-gold)] bg-[var(--glitz-gold)]/10 text-[var(--glitz-gold)]" : "border-[var(--glitz-border)] text-muted")}>{f}</button>
        ))}</div>
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {filtered.map((item, i) => (
            <motion.button key={`${item.src}-${i}`} type="button" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} onClick={() => setLb(i)} className="group relative mb-5 w-full break-inside-avoid overflow-hidden rounded-xl brand-surface cursor-zoom-in text-left">
              <BrandImage src={item.src} alt={item.alt} width={700} height={item.h} className="h-auto w-full transition-transform duration-700 group-hover:scale-105" sizes="33vw" loading="lazy" />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100"><span className="brand-display text-white">{item.alt}</span></div>
            </motion.button>
          ))}
        </div>
      </BrandSection>
      <BrandLightbox images={filtered.map((x) => ({ src: x.src, alt: x.alt }))} index={lb} onClose={() => setLb(null)} onNavigate={setLb} />
    </div>
  );
}
