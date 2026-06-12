"use client";

import { motion } from "framer-motion";
import { MessageCircle, Phone, ArrowRight } from "lucide-react";
import { BrandButton } from "@/brand/primitives/brand-button";
import { MagneticButton } from "@/components/effects/magnetic-button";
import { SITE_CONFIG } from "@/lib/constants";
import { analytics } from "@/lib/analytics";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const whatsappHref = `https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hello Glitz Events, I'd like to book a consultation.")}`;

export function HomeCta() {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[var(--glitz-surface)] py-16 sm:py-20 lg:py-24"
      aria-labelledby="cta-heading"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--glitz-gold)]/5 via-transparent to-[var(--glitz-gold)]/8" aria-hidden="true" />
      <div className="brand-container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl border border-[var(--glitz-gold)]/25 bg-gradient-to-br from-[var(--glitz-card)] to-[var(--glitz-surface-elevated)] p-10 text-center shadow-[var(--shadow-glow-gold-sm)] sm:p-14 lg:p-16"
        >
          <div className="brand-divider mx-auto mb-8 max-w-xs" aria-hidden="true" />
          <span className="brand-label">Begin Your Story</span>
          <h2 id="cta-heading" className="mt-4 brand-display text-section-title font-bold text-[var(--glitz-text)]">
            Ready to Create Something <span className="brand-gold-text">Extraordinary?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[var(--glitz-muted)]">
            Schedule a private consultation with our luxury event specialists — weddings, corporate galas, and destination celebrations crafted exclusively for you.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
            <MagneticButton>
              <BrandButton
                href="/book-event"
                className="btn-premium-hover min-w-[200px]"
                onClick={() => analytics.ctaClick("book_consultation", "home_cta")}
              >
                Book Consultation <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </BrandButton>
            </MagneticButton>
            <MagneticButton>
              <a
                href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
                onClick={() => analytics.ctaClick("call_now", "home_cta")}
                className="inline-flex min-h-[48px] min-w-[200px] items-center justify-center gap-2 rounded-lg border border-[var(--glitz-gold)]/40 px-8 py-3 text-sm font-semibold text-[var(--glitz-text)] transition-colors hover:bg-[var(--glitz-gold)]/10 btn-premium-hover"
              >
                <Phone className="h-4 w-4" aria-hidden="true" /> Call Now
              </a>
            </MagneticButton>
            <MagneticButton>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => analytics.ctaClick("whatsapp", "home_cta")}
                className="inline-flex min-h-[48px] min-w-[200px] items-center justify-center gap-2 rounded-lg border border-[#25D366]/40 bg-[#25D366]/10 px-8 py-3 text-sm font-semibold text-[var(--glitz-text)] transition-colors hover:bg-[#25D366]/20 btn-premium-hover"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
              </a>
            </MagneticButton>
          </div>
          <p className="mt-8 text-xs text-[var(--glitz-muted)]">
            Response within 24 hours · Complimentary initial consultation · Pune &amp; pan-India
          </p>
        </motion.div>
      </div>
    </section>
  );
}
