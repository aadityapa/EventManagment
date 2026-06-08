"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, BadgeCheck, Camera, Music, Utensils, Palette, Mic } from "lucide-react";
import { CinematicHero } from "@/components/shared/cinematic-hero";
import { PageSection, SectionHeader } from "@/components/shared/page-section";
import { LuxuryImage } from "@/components/shared/luxury-image";
import { vendors } from "@/data/cms";
import { IMAGES } from "@/lib/images";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/constants";

const CATEGORIES = ["All", "Photographers", "Decorators", "Caterers", "DJs", "Bands", "Makeup Artists"] as const;

const CAT_ICONS: Record<string, React.ElementType> = {
  Photographers: Camera,
  Decorators: Palette,
  Caterers: Utensils,
  DJs: Music,
  Bands: Mic,
  "Makeup Artists": Star,
};

export function VendorsPageContent() {
  const [active, setActive] = useState<string>("All");

  const filtered = active === "All" ? vendors : vendors.filter((v) => v.category === active);

  return (
    <>
      <CinematicHero
        label="Partner Ecosystem"
        title="Curated Luxury Vendors"
        subtitle="Handpicked artisans and creatives who share our standard of excellence."
        image={IMAGES.vendors[0]}
        size="full"
      />

      <PageSection>
        <SectionHeader
          label="Our Network"
          title="Premium Partners"
          subtitle="Every vendor in our ecosystem is verified, vetted, and aligned with Glitz quality standards."
        />
        <div className="mb-10 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const Icon = CAT_ICONS[cat] ?? Star;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all",
                  active === cat ? "border-primary bg-primary/10 text-primary" : "border-border/60 text-muted hover:border-primary/40"
                )}
              >
                {cat !== "All" && <Icon className="h-4 w-4" />}
                {cat}
              </button>
            );
          })}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((vendor, i) => (
            <motion.article
              key={vendor.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="luxury-card group overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <LuxuryImage src={vendor.images[0]} alt={vendor.businessName} fill sizes="33vw" className="transition-transform duration-700 group-hover:scale-105" />
                {vendor.verified && (
                  <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary/90 px-2 py-1 text-[10px] font-bold text-primary-foreground">
                    <BadgeCheck className="h-3 w-3" /> Verified
                  </span>
                )}
              </div>
              <div className="p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">{vendor.category}</span>
                <h3 className="mt-1 font-display text-lg font-semibold">{vendor.businessName}</h3>
                <div className="mt-2 flex items-center gap-3 text-sm text-muted">
                  <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-primary text-primary" /> {vendor.rating}</span>
                  <span>{vendor.city}</span>
                </div>
                <p className="mt-2 text-sm text-primary font-medium">{vendor.priceRange}</p>
                <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
                  <a href={`https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi, I'm interested in ${vendor.businessName} for my event.`)}`} target="_blank" rel="noopener noreferrer">
                    Inquire via WhatsApp
                  </a>
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </PageSection>
    </>
  );
}
