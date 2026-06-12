"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Gem, Crown, Sparkles, Check } from "lucide-react";
import { BrandPageHero } from "@/brand/primitives/brand-hero";
import { BrandSection, BrandHeader } from "@/brand/primitives/brand-section";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import { BRAND_INVESTMENTS } from "@/brand/data/content";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type BillingMode = "per-event" | "retainer";

const BILLING_LABELS: Record<BillingMode, { left: string; right: string; note: string }> = {
  "per-event": { left: "Per Event", right: "Annual Retainer", note: "One-time event investment" },
  retainer: { left: "Per Event", right: "Annual Retainer", note: "Save up to 15% with annual partnership" },
};

export function PricingView() {
  const [billing, setBilling] = useState<BillingMode>("per-event");

  useEffect(() => {
    analytics.pricingView();
  }, []);

  const handleBillingToggle = (mode: BillingMode) => {
    setBilling(mode);
    analytics.pricingToggle(mode);
  };

  return (
    <div className="brand-root">
      <BrandPageHero
        label="Investment"
        title="The Glitz Collection"
        subtitle="Luxury is invested in experiences, not purchased in packages."
        image={BRAND_IMAGES.hero.wedding}
      />
      <BrandSection>
        <BrandHeader
          title="Investment Starts From"
          subtitle="Each collection represents a tier of creative commitment tailored to your vision."
          center
        />

        {/* Billing toggle */}
        <div className="mx-auto mb-12 flex flex-col items-center gap-3">
          <div
            className="inline-flex rounded-full border border-[var(--glitz-border)] bg-[var(--glitz-surface)] p-1"
            role="group"
            aria-label="Billing mode"
          >
            {(["per-event", "retainer"] as BillingMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => handleBillingToggle(mode)}
                aria-pressed={billing === mode}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-semibold transition-all tap-target",
                  billing === mode
                    ? "bg-[var(--glitz-gold)] text-[var(--adaptive-button-text,#111)] shadow-[var(--glitz-glow)]"
                    : "text-[var(--glitz-muted)] hover:text-[var(--glitz-text)]"
                )}
              >
                {mode === "per-event" ? BILLING_LABELS[mode].left : BILLING_LABELS[mode].right}
              </button>
            ))}
          </div>
          <p className="text-sm text-[var(--glitz-muted)]">{BILLING_LABELS[billing].note}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {BRAND_INVESTMENTS.map((col, i) => {
            const Icon = col.name.includes("Boutique") ? Gem : col.name.includes("Signature") ? Crown : Sparkles;
            const price = billing === "retainer" && col.featured ? "₹30 Lakhs/yr" : col.from;
            return (
              <motion.div
                key={col.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={cn(
                  "brand-surface relative flex flex-col p-8",
                  col.featured && "ring-2 ring-[var(--glitz-gold)] shadow-[var(--glitz-glow)] lg:-mt-4 lg:mb-4"
                )}
              >
                {col.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--glitz-gold)] px-4 py-1 text-xs font-bold text-[var(--adaptive-button-text,#111)]">
                    Most Popular
                  </span>
                )}
                <Icon className="mb-4 h-10 w-10 text-[var(--glitz-gold)]" aria-hidden="true" />
                <h3 className="brand-display text-2xl font-semibold">{col.name}</h3>
                <p className="mt-1 text-sm italic text-[var(--glitz-gold)]/80">{col.tagline}</p>
                <p className="mt-4 brand-display text-3xl font-bold brand-gold-text">{price}</p>
                {billing === "retainer" && !col.featured && (
                  <p className="mt-1 text-xs text-[var(--glitz-muted)]">Custom retainer pricing available</p>
                )}
                <p className="mt-4 text-sm text-[var(--glitz-muted)]">{col.narrative}</p>
                <ul className="mt-6 flex-1 space-y-2">
                  {col.includes.map((item) => (
                    <li key={item} className="flex gap-2 text-sm">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--glitz-gold)]" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/book-event"
                  onClick={() => analytics.demoRequest(`pricing_${col.name.toLowerCase().replace(/\s+/g, "_")}`)}
                  className={cn(
                    "mt-8 block rounded-lg py-3 text-center text-sm font-semibold transition-all btn-premium-hover tap-target",
                    col.featured
                      ? "btn-gold-metallic"
                      : "border border-[var(--glitz-gold)]/40 text-[var(--glitz-gold)] hover:bg-[var(--glitz-gold)]/10"
                  )}
                >
                  Request Consultation <ArrowRight className="ml-1 inline h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </BrandSection>
    </div>
  );
}
