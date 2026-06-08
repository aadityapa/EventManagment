"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CinematicHero } from "@/components/shared/cinematic-hero";
import { PageSection } from "@/components/shared/page-section";
import { LuxuryImage } from "@/components/shared/luxury-image";
import { Lightbox } from "@/components/shared/lightbox";
import { IMAGES } from "@/lib/images";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Weddings", "Corporate", "Concerts", "Decor", "Destinations"] as const;

const GALLERY_ITEMS = IMAGES.gallery.map((src, i) => ({
  src,
  title: [
    "Royal Engagement", "Corporate Gala", "Live Concert", "Sangeet Night",
    "Aesthetic Details", "Grand Reception", "Bridal Elegance", "Fine Dining Setup",
    "Product Launch", "Mehendi Ceremony", "Destination Wedding", "Award Night",
    "Brand Activation", "Private Celebration", "Palace Ceremony",
  ][i] ?? `Event ${i + 1}`,
  category: (["Weddings", "Corporate", "Concerts", "Weddings", "Decor", "Weddings", "Weddings", "Corporate", "Corporate", "Weddings", "Destinations", "Corporate", "Corporate", "Weddings", "Destinations"] as const)[i] ?? "Weddings",
  height: i % 3 === 0 ? 520 : i % 3 === 1 ? 380 : 460,
}));

export function GalleryPageContent() {
  const [active, setActive] = useState<(typeof FILTERS)[number]>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    active === "All" ? GALLERY_ITEMS : GALLERY_ITEMS.filter((item) => item.category === active);

  const lightboxImages = filtered.map((item) => ({ src: item.src, alt: item.title }));

  return (
    <>
      <CinematicHero
        label="Visual Stories"
        title="Immersive Gallery"
        subtitle="Capturing the essence of luxury across India's most exclusive gatherings."
        image={IMAGES.gallery[0]}
        size="full"
      />

      <PageSection>
        <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActive(filter)}
              className={cn(
                "touch-target rounded-full border px-5 py-2.5 text-sm font-semibold transition-all",
                active === filter
                  ? "border-primary bg-primary/10 text-primary shadow-glow"
                  : "border-border/60 text-muted hover:border-primary/40 hover:text-foreground"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {filtered.map((item, i) => (
            <motion.button
              key={`${item.src}-${i}`}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 6) * 0.05 }}
              onClick={() => setLightboxIndex(i)}
              className="group relative mb-5 w-full break-inside-avoid overflow-hidden rounded-xl luxury-card cursor-zoom-in text-left"
              aria-label={`View ${item.title}`}
            >
              <LuxuryImage
                src={item.src}
                alt={item.title}
                width={600}
                height={item.height}
                className="h-auto w-full transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                <div>
                  <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
                  <p className="text-xs text-primary">{item.category}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </PageSection>

      <Lightbox
        images={lightboxImages}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </>
  );
}
