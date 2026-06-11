"use client";

import { motion } from "framer-motion";
import { MessageCircle, Phone } from "lucide-react";
import { BrandSection } from "@/brand/primitives/brand-section";
import { BrandButton } from "@/brand/primitives/brand-button";
import { MagneticButton } from "@/components/effects/magnetic-button";
import { SITE_CONFIG } from "@/lib/constants";

const whatsappHref = `https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hello Glitz Events, I'd like to book a consultation.")}`;

export function HomeCta() {
  return (
    <BrandSection alt>
      <div className="brand-divider mb-12" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="brand-surface mx-auto max-w-4xl rounded-2xl border border-[var(--glitz-gold)]/20 bg-gradient-to-br from-[#111111] to-[#0A0A0A] p-10 text-center sm:p-14"
      >
        <span className="brand-label">Begin Your Story</span>
        <h2 className="mt-4 brand-display text-[clamp(2rem,4vw,3rem)] font-bold">
          Ready to Create Something <span className="brand-gold-text">Extraordinary?</span>
        </h2>
        <p className="mt-4 text-[var(--glitz-muted)]">
          Schedule a private consultation with our luxury event specialists.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
          <MagneticButton>
            <BrandButton href="/book-event">Book Consultation</BrandButton>
          </MagneticButton>
          <MagneticButton>
            <a
              href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-[var(--glitz-gold)]/40 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--glitz-gold)]/10"
            >
              <Phone className="h-4 w-4" /> Call Now
            </a>
          </MagneticButton>
          <MagneticButton>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-[#25D366]/40 bg-[#25D366]/10 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#25D366]/20"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </MagneticButton>
        </div>
      </motion.div>
      <div className="brand-divider mt-12" />
    </BrandSection>
  );
}
