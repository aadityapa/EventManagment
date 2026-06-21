"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Star,
  BadgeCheck,
  Camera,
  Palette,
  Utensils,
  Music,
  Mic,
  ArrowUpRight,
  Images,
} from "lucide-react";
import { BrandImage } from "@/brand/primitives/brand-image";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import { vendors } from "@/data/cms";
import { SITE_CONFIG } from "@/lib/constants";
import { ScrollReveal, staggerParent, staggerItem } from "@/lib/motion";
import { cn, getApiUrl } from "@/lib/utils";

const CATS = ["All", "Photographers", "Decorators", "Caterers", "DJs", "Bands", "Makeup Artists"] as const;
type Cat = (typeof CATS)[number];
const ICONS: Partial<Record<Cat, LucideIcon>> = {
  Photographers: Camera,
  Decorators: Palette,
  Caterers: Utensils,
  DJs: Music,
  Bands: Mic,
  "Makeup Artists": Star,
};

export function VendorsView() {
  const [cat, setCat] = useState<Cat>("All");
  const [items, setItems] = useState(vendors);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch(getApiUrl("/vendors"), { method: "GET" });
        if (!res.ok) return;
        const data = (await res.json().catch(() => null)) as unknown;
        if (!ignore && Array.isArray(data)) setItems(data as typeof vendors);
      } catch {
        /* fallback */
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const filtered = cat === "All" ? items : items.filter((v) => v.category === cat);

  return (
    <div className="brand-root">
      {/* Hero */}
      <section className="relative flex min-h-[68svh] items-end overflow-hidden">
        <BrandImage
          src={BRAND_IMAGES.vendors[0]}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/45 to-black/20" />
        <div className="brand-container relative w-full pb-16 pt-32 sm:pb-20">
          <GlassPanel className="max-w-2xl px-8 py-10 sm:px-10">
            <span className="v4-kicker mb-4">Partners</span>
            <h1 className="v4-display text-white">
              Luxury Vendor <span className="v4-gold-text">Marketplace</span>
            </h1>
            <p className="v4-standfirst mt-4 text-white/80">
              Verified artisans who share our standard of excellence — photographers, decorators,
              caterers, and more.
            </p>
          </GlassPanel>
        </div>
      </section>

      {/* Category filters */}
      <section className="sticky top-[var(--header-height,3.75rem)] z-30 border-b border-[var(--glitz-border)] bg-[var(--glitz-glass)]/95 backdrop-blur-xl">
        <div className="brand-container flex flex-wrap gap-2 py-4">
          {CATS.map((c) => {
            const Icon = ICONS[c];
            return (
              <button
                key={c}
                type="button"
                aria-pressed={cat === c}
                onClick={() => setCat(c)}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all",
                  cat === c
                    ? "border-[var(--glitz-gold)] bg-[var(--glitz-gold)]/10 text-[var(--glitz-gold)] shadow-[var(--v4-glow-gold)]"
                    : "border-[var(--glitz-border)] text-muted hover:border-[var(--glitz-gold)]/40"
                )}
              >
                {c !== "All" && Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
                {c}
              </button>
            );
          })}
        </div>
      </section>

      {/* Vendor grid */}
      <section className="v4-section">
        <div className="brand-container">
          <ScrollReveal preset="reveal">
            <span className="v4-kicker mb-4">Curated Roster</span>
            <h2 className="v4-title">Premium Partners</h2>
            <p className="v4-body mt-3 max-w-2xl text-muted">
              {filtered.length} verified vendor{filtered.length !== 1 ? "s" : ""} in{" "}
              {cat === "All" ? "all categories" : cat.toLowerCase()}.
            </p>
          </ScrollReveal>

          <motion.div
            className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {filtered.map((v) => (
              <motion.article key={v.id} variants={staggerItem} className="group">
                <GlassPanel className="overflow-hidden p-0 transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--v4-glow-gold)]">
                  <div className="relative h-48 overflow-hidden">
                    <BrandImage
                      src={v.images[0]}
                      alt={v.businessName}
                      fill
                      sizes="33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    {v.verified && (
                      <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[var(--glitz-gold)] px-2 py-1 text-[10px] font-bold text-[#0A0A0A]">
                        <BadgeCheck className="h-3 w-3" aria-hidden="true" /> Verified
                      </span>
                    )}
                    {/* Portfolio thumbnails strip */}
                    {v.images.length > 1 && (
                      <div className="absolute bottom-3 left-3 flex gap-1.5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                        {v.images.slice(0, 3).map((img, i) => (
                          <div
                            key={`${v.id}-thumb-${i}`}
                            className="relative h-10 w-10 overflow-hidden rounded-md border border-white/30"
                          >
                            <BrandImage src={img} alt="" fill sizes="40px" className="object-cover" />
                          </div>
                        ))}
                        {v.images.length > 3 && (
                          <span className="flex h-10 w-10 items-center justify-center rounded-md border border-white/30 bg-black/50 text-[10px] font-semibold text-white">
                            +{v.images.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <span className="v4-kicker text-[0.65rem]">{v.category}</span>
                    <h3 className="mt-1 font-display text-lg font-semibold group-hover:text-[var(--glitz-gold)]">
                      {v.businessName}
                    </h3>
                    <div className="mt-2 flex items-center gap-3 text-sm text-muted">
                      <span className="flex items-center gap-1">
                        <Star
                          className="h-3.5 w-3.5 fill-[var(--glitz-gold)] text-[var(--glitz-gold)]"
                          aria-hidden="true"
                        />
                        {v.rating}
                      </span>
                      <span>{v.city}</span>
                      {v.images.length > 0 && (
                        <span className="flex items-center gap-1 text-xs">
                          <Images className="h-3 w-3" aria-hidden="true" />
                          Portfolio
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm font-medium text-[var(--glitz-gold)]">{v.priceRange}</p>
                    <a
                      href={`https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Inquiry: ${v.businessName}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex items-center justify-center gap-1 rounded-[var(--v4-radius-sm)] border border-[var(--glitz-gold)]/40 py-2.5 text-sm font-semibold text-[var(--glitz-gold)] transition-colors hover:bg-[var(--glitz-gold)]/10"
                    >
                      Inquire via WhatsApp
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </GlassPanel>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
