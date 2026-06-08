"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { LuxurySection } from "@/components/shared/luxury-section";
import { EVENT_IMAGES } from "@/lib/images";

const PREVIEW = EVENT_IMAGES.gallery.slice(0, 6);

export function GalleryPreviewSection() {
  return (
    <LuxurySection
      label="Visual Stories"
      title="Immersive Gallery"
      subtitle="A glimpse into the extraordinary moments we've crafted."
    >
      <div className="container-page">
        <div className="columns-2 gap-4 sm:columns-3 lg:gap-5">
          {PREVIEW.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group relative mb-4 break-inside-avoid overflow-hidden rounded-xl"
            >
              <Image
                src={src}
                alt={`Gallery image ${i + 1}`}
                width={400}
                height={i % 2 === 0 ? 500 : 350}
                className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 33vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-primary/0 transition-colors group-hover:bg-primary/10" />
            </motion.div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-8 py-3 text-sm font-semibold uppercase tracking-wider text-primary transition-all hover:bg-primary/10 hover:shadow-glow"
          >
            Explore Full Gallery <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </LuxurySection>
  );
}
