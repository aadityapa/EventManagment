"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { analytics } from "@/lib/analytics";
import { SITE_CONFIG } from "@/lib/constants";

const whatsappHref = `https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
  "Hello Nexyyra Events, I'd like to discuss an event.",
)}`;

export function HomeCtaBand() {
  return (
    <section id="plan" className="lux-section lux-section--tight" aria-labelledby="cta-band-heading">
      <div className="brand-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="lux-card lux-cta-band flex-wrap"
        >
          <div>
            <h2 id="cta-band-heading" className="lux-cta-band__title">
              Let&apos;s Make Your Next Event{" "}
              <span className="lux-accent-purple">Extraordinary</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--lux-muted)]">
              Tell us your vision — our planners reply the same day with ideas, venues and a
              transparent estimate.
            </p>
          </div>
          <div className="flex w-full max-w-md flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center">
            <Link
              href="/book-event"
              onClick={() => analytics.ctaClick("lets_plan_together", "home_cta_band")}
              className="luxury-button luxury-button--purple tap-target"
            >
              Let&apos;s Plan Together
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => analytics.ctaClick("whatsapp", "home_cta_band")}
              className="luxury-button luxury-button--ghost tap-target"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Chat on WhatsApp
            </a>
          </div>
          <p className="w-full text-center text-[0.68rem] uppercase tracking-[0.22em] text-[var(--lux-subtle)] sm:text-left">
            Free consultation · No obligation · Pune &amp; across India
          </p>
        </motion.div>
      </div>
    </section>
  );
}
