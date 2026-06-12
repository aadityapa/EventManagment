"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { BrandSection, BrandHeader } from "@/brand/primitives/brand-section";
import { BrandFaqAccordion } from "@/brand/primitives/brand-faq-accordion";
import { HOME_FAQ_ITEMS } from "@/brand/data/faq";
import { analytics } from "@/lib/analytics";

export function HomeFaq() {
  return (
    <BrandSection id="faq" alt>
      <BrandHeader
        label="Questions Answered"
        title="Frequently Asked Questions"
        subtitle="Everything you need to know before booking your wedding, corporate gala, or destination celebration with Glitz."
        center
      />

      <div className="mx-auto max-w-3xl">
        <BrandFaqAccordion items={HOME_FAQ_ITEMS} location="home_faq" />

        <div className="mt-10 flex flex-col items-center gap-4 rounded-xl border border-[var(--glitz-gold)]/20 bg-[var(--glitz-surface-elevated)] p-6 text-center sm:flex-row sm:justify-between sm:p-8 sm:text-left">
          <div>
            <p className="brand-display text-lg font-semibold text-[var(--glitz-text)]">
              Still have questions?
            </p>
            <p className="mt-1 text-sm text-[var(--glitz-muted)]">
              Our luxury event specialists are ready to help — complimentary consultation included.
            </p>
          </div>
          <Link
            href="/contact"
            onClick={() => analytics.ctaClick("chat_with_team", "home_faq")}
            className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-lg bg-[var(--glitz-gold)] px-6 py-3 text-sm font-semibold text-[var(--adaptive-button-text,#111)] transition-all hover:shadow-[var(--glitz-glow)] btn-premium-hover tap-target"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Chat with our team
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <p className="mt-6 text-center text-sm text-[var(--glitz-muted)]">
          View all answers on our{" "}
          <Link
            href="/faqs"
            className="font-medium text-[var(--glitz-gold)] underline-offset-4 hover:underline"
            onClick={() => analytics.ctaClick("view_all_faqs", "home_faq")}
          >
            full FAQ page
          </Link>
          .
        </p>
      </div>
    </BrandSection>
  );
}
