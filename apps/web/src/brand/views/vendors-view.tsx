"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, BadgeCheck, Camera, Palette, Utensils, Music, Mic } from "lucide-react";
import { BrandPageHero } from "@/brand/primitives/brand-hero";
import { BrandSection, BrandHeader } from "@/brand/primitives/brand-section";
import { BrandImage } from "@/brand/primitives/brand-image";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import { vendors } from "@/data/cms";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

const CATS = ["All", "Photographers", "Decorators", "Caterers", "DJs", "Bands", "Makeup Artists"] as const;
const ICONS: Record<string, React.ElementType> = { Photographers: Camera, Decorators: Palette, Caterers: Utensils, DJs: Music, Bands: Mic, "Makeup Artists": Star };

export function VendorsView() {
  const [cat, setCat] = useState<string>("All");
  const filtered = cat === "All" ? vendors : vendors.filter((v) => v.category === cat);

  return (
    <div className="brand-root">
      <BrandPageHero label="Partners" title="Luxury Vendor Ecosystem" subtitle="Verified artisans who share our standard of excellence." image={BRAND_IMAGES.vendors[0]} />
      <BrandSection>
        <BrandHeader label="Categories" title="Premium Partners" />
        <div className="mb-10 flex flex-wrap gap-2">{CATS.map((c) => { const Icon = ICONS[c]; return (
          <button key={c} type="button" onClick={() => setCat(c)} className={cn("flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold", cat === c ? "border-[var(--glitz-gold)] bg-[var(--glitz-gold)]/10 text-[var(--glitz-gold)]" : "border-[var(--glitz-border)] text-[var(--glitz-muted)]")}>{c !== "All" && Icon && <Icon className="h-4 w-4" />}{c}</button>
        ); })}</div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v, i) => (
            <motion.article key={v.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="brand-surface group overflow-hidden">
              <div className="relative h-48 overflow-hidden"><BrandImage src={v.images[0]} alt={v.businessName} fill sizes="33vw" className="transition-transform duration-700 group-hover:scale-110" />{v.verified && <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[var(--glitz-gold)] px-2 py-1 text-[10px] font-bold text-[#0A0A0A]"><BadgeCheck className="h-3 w-3" /> Verified</span>}</div>
              <div className="p-5">
                <span className="brand-label">{v.category}</span>
                <h3 className="mt-1 brand-display text-lg font-semibold">{v.businessName}</h3>
                <div className="mt-2 flex gap-3 text-sm text-[var(--glitz-muted)]"><Star className="h-3.5 w-3.5 fill-[var(--glitz-gold)] text-[var(--glitz-gold)]" />{v.rating} · {v.city}</div>
                <p className="mt-2 text-sm font-medium text-[var(--glitz-gold)]">{v.priceRange}</p>
                <a href={`https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Inquiry: ${v.businessName}`)}`} target="_blank" rel="noopener noreferrer" className="mt-4 block rounded-lg border border-[var(--glitz-gold)]/40 py-2.5 text-center text-sm font-semibold text-[var(--glitz-gold)] hover:bg-[var(--glitz-gold)]/10">Inquire</a>
              </div>
            </motion.article>
          ))}
        </div>
      </BrandSection>
    </div>
  );
}
