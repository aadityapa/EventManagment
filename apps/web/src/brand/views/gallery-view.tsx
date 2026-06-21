"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Play } from "lucide-react";
import { BrandImage } from "@/brand/primitives/brand-image";
import { BrandLightbox } from "@/brand/primitives/brand-lightbox";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import { ScrollReveal, staggerParent, staggerItem, EASE, DUR } from "@/lib/motion";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Weddings", "Corporate", "Concerts", "Decor", "Destinations"] as const;
const CATS = [
  "Weddings", "Corporate", "Concerts", "Decor", "Weddings", "Weddings", "Weddings",
  "Corporate", "Corporate", "Weddings", "Destinations", "Corporate", "Corporate",
  "Weddings", "Destinations",
] as const;
const TITLES = [
  "Royal Engagement", "Corporate Gala", "Live Concert", "Sangeet Night", "Premium Decor",
  "Grand Reception", "Bridal Elegance", "Fine Dining", "Product Launch", "Mehendi",
  "Destination Wedding", "Award Night", "Brand Activation", "Private Celebration", "Palace Ceremony",
];

export function GalleryView() {
  const [active, setActive] = useState<(typeof FILTERS)[number]>("All");
  const [lb, setLb] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();

  const items = BRAND_IMAGES.gallery.map((src, i) => ({
    src,
    alt: TITLES[i] ?? `Event ${i + 1}`,
    cat: CATS[i] ?? "Weddings",
    h: i % 3 === 0 ? 520 : i % 3 === 1 ? 380 : 460,
  }));
  const filtered = active === "All" ? items : items.filter((x) => x.cat === active);

  return (
    <div className="brand-root">
      {/* Hero */}
      <section className="relative flex min-h-[68svh] items-end overflow-hidden">
        <BrandImage
          src={BRAND_IMAGES.gallery[0]}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/45 to-black/20" />
        <div className="brand-container relative w-full pb-16 pt-32 sm:pb-20">
          <GlassPanel className="max-w-2xl px-8 py-10 sm:px-10">
            <span className="v4-kicker mb-4">Visual Stories</span>
            <h1 className="v4-display text-white">
              Immersive <span className="v4-gold-text">Gallery</span>
            </h1>
            <p className="v4-standfirst mt-4 text-white/80">
              Editorial frames from our most celebrated weddings, galas, and destination productions.
            </p>
          </GlassPanel>
        </div>
      </section>

      {/* Video reel */}
      <section className="v4-section border-b border-[var(--glitz-border)]">
        <div className="brand-container">
          <ScrollReveal preset="reveal">
            <span className="v4-kicker mb-4">Cinematic Reel</span>
            <h2 className="v4-title">Behind the Lens</h2>
          </ScrollReveal>
          <ScrollReveal preset="fade" delay={0.12} className="mt-8">
            <GlassPanel className="relative overflow-hidden p-0">
              <div className="relative aspect-[21/9] min-h-[240px] w-full overflow-hidden bg-black">
                <video
                  src={BRAND_IMAGES.hero.video}
                  poster={BRAND_IMAGES.hero.poster}
                  muted
                  loop
                  playsInline
                  autoPlay={!reducedMotion}
                  className="h-full w-full object-cover"
                  aria-label="Glitz Events highlight reel"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
                <div className="absolute bottom-6 left-6 flex items-center gap-2 text-sm text-white/90">
                  <Play className="h-4 w-4 text-[var(--glitz-gold)]" aria-hidden="true" />
                  Event highlight reel
                </div>
              </div>
            </GlassPanel>
          </ScrollReveal>
        </div>
      </section>

      {/* Masonry grid */}
      <section className="v4-section">
        <div className="brand-container">
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={active === f}
                onClick={() => setActive(f)}
                className={cn(
                  "rounded-full border px-5 py-2.5 text-sm font-semibold transition-all",
                  active === f
                    ? "border-[var(--glitz-gold)] bg-[var(--glitz-gold)]/10 text-[var(--glitz-gold)] shadow-[var(--v4-glow-gold)]"
                    : "border-[var(--glitz-border)] text-muted hover:border-[var(--glitz-gold)]/40"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <motion.div
            className="columns-1 gap-5 sm:columns-2 lg:columns-3"
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
          >
            {filtered.map((item, i) => (
              <motion.button
                key={`${item.src}-${i}`}
                type="button"
                variants={staggerItem}
                onClick={() => setLb(i)}
                className="group relative mb-5 w-full break-inside-avoid cursor-zoom-in overflow-hidden rounded-[var(--v4-radius-lg)] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glitz-gold)]"
                aria-label={`View ${item.alt}`}
              >
                <GlassPanel liquid={false} className="group relative overflow-hidden p-0 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:shadow-[var(--v4-glow-gold)]">
                  <motion.div
                    initial={reducedMotion ? false : { opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: DUR.slow, ease: EASE.luxe, delay: (i % 6) * 0.06 }}
                  >
                    <BrandImage
                      src={item.src}
                      alt={item.alt}
                      width={700}
                      height={item.h}
                      className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.03]"
                      sizes="33vw"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--glitz-gold)]">
                          {item.cat}
                        </span>
                        <p className="mt-1 font-display text-lg text-white">{item.alt}</p>
                      </div>
                    </div>
                  </motion.div>
                </GlassPanel>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      <BrandLightbox
        images={filtered.map((x) => ({ src: x.src, alt: x.alt }))}
        index={lb}
        onClose={() => setLb(null)}
        onNavigate={setLb}
        cinematic
      />
    </div>
  );
}
