"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { BrandSection } from "@/brand/primitives/brand-section";
import { BrandButton } from "@/brand/primitives/brand-button";
import { SITE_CONFIG } from "@/lib/constants";

export function HomeCta() {
  return (
    <BrandSection alt>
      <div className="brand-divider mb-12" />
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-3xl text-center">
        <span className="brand-label">Begin Your Story</span>
        <h2 className="mt-4 brand-display text-[clamp(2rem,4vw,3rem)] font-bold">Ready to Create Something <span className="brand-gold-text">Extraordinary?</span></h2>
        <p className="mt-4 text-[var(--glitz-muted)]">Schedule a private consultation with our luxury event specialists.</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <BrandButton href="/book-event">Book Consultation</BrandButton>
          <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--glitz-gold)] hover:underline"><Phone className="h-4 w-4" /> {SITE_CONFIG.phone}</a>
        </div>
      </motion.div>
      <div className="brand-divider mt-12" />
    </BrandSection>
  );
}
