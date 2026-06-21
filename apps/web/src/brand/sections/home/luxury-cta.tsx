"use client";

import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { BrandButton } from "@/brand/primitives/brand-button";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import { MagneticButton } from "@/components/effects/magnetic-button";
import { ScrollReveal } from "@/lib/motion";
import { SITE_CONFIG } from "@/lib/constants";
import { analytics } from "@/lib/analytics";

const whatsappHref = `https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
  "Hello Glitz Events, I'd like to begin planning my event."
)}`;
const telHref = `tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`;

export function HomeLuxuryCta() {
  return (
    <section
      id="commission"
      className="v4-section-lg v4-dune-glow relative overflow-hidden bg-[var(--glitz-surface)]"
      aria-labelledby="commission-heading"
    >
      <div className="brand-container">
        {/* Compact FAQ bridge */}
        <ScrollReveal preset="fade" className="mb-10 text-center">
          <p className="text-sm text-[var(--text-secondary)]">
            Questions before you begin?{" "}
            <Link
              href="/faqs"
              onClick={() => analytics.ctaClick("view_all_faqs", "home_invitation")}
              className="font-semibold text-[var(--glitz-gold)] underline-offset-4 hover:underline"
            >
              Read our FAQs
            </Link>
            {" "}or{" "}
            <Link
              href="/contact"
              onClick={() => analytics.ctaClick("chat_with_team", "home_invitation")}
              className="font-semibold text-[var(--glitz-gold)] underline-offset-4 hover:underline"
            >
              speak to a concierge
            </Link>
            .
          </p>
        </ScrollReveal>

        <ScrollReveal preset="scale">
          <GlassPanel glow className="mx-auto max-w-4xl px-8 py-14 text-center sm:px-16 sm:py-20">
            <span className="v4-kicker mb-6 justify-center">The Commission</span>
            <h2 id="commission-heading" className="v4-display">
              Your extraordinary evening awaits an <span className="v4-gold-text">architect</span>.
            </h2>
            <p className="v4-standfirst mx-auto mt-6 max-w-lg">
              Begin a guided journey — dream, atmosphere, destination, experience level, then meet your
              Event Architect. Response within 24 hours, complimentary and without obligation.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
              <MagneticButton>
                <BrandButton
                  href="/book-event"
                  variant="gold"
                  className="min-w-[200px]"
                  onClick={() => analytics.ctaClick("book_consultation", "home_commission")}
                >
                  Begin Your Journey
                </BrandButton>
              </MagneticButton>
              <MagneticButton>
                <BrandButton
                  href="/ai"
                  variant="outline"
                  className="min-w-[200px] border-[var(--glitz-gold)]/40"
                  onClick={() => analytics.ctaClick("meet_oracle", "home_commission")}
                >
                  Meet the Oracle (AI)
                </BrandButton>
              </MagneticButton>
              <MagneticButton>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => analytics.ctaClick("whatsapp", "home_commission")}
                  className="inline-flex min-h-[48px] min-w-[200px] items-center justify-center gap-2 rounded-lg border border-[#25D366]/40 bg-[#25D366]/10 px-8 py-3 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[#25D366]/20"
                >
                  <MessageCircle className="h-4 w-4 text-[#25D366]" aria-hidden="true" />
                  Speak to Concierge
                </a>
              </MagneticButton>
            </div>

            <a
              href={telHref}
              onClick={() => analytics.ctaClick("call", "home_invitation")}
              className="mt-8 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--glitz-gold)]"
            >
              <Phone className="h-4 w-4 text-[var(--glitz-gold)]" aria-hidden="true" />
              {SITE_CONFIG.phone}
            </a>
          </GlassPanel>
        </ScrollReveal>
      </div>
    </section>
  );
}
