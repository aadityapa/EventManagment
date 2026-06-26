"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Gem, Crown, Sparkles, Check } from "lucide-react";
import { BrandImage } from "@/brand/primitives/brand-image";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import { BRAND_INVESTMENTS } from "@/brand/data/content";
import { GLITZ_FAQS } from "@/brand/data/faq";
import { BrandFaqAccordion } from "@/brand/primitives/brand-faq-accordion";
import { InlineBudgetCalculator } from "@/components/cro/budget-calculator";
import { ScrollReveal, staggerParent, staggerItem } from "@/lib/motion";
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
      {/* Hero */}
      <section className="relative flex min-h-[68svh] items-end overflow-hidden">
        <BrandImage
          src={BRAND_IMAGES.hero.wedding}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/45 to-black/20" />
        <div className="brand-container relative w-full pb-16 pt-32 sm:pb-20">
          <GlassPanel className="max-w-2xl px-8 py-10 sm:px-10">
            <span className="v4-kicker mb-4">Investment</span>
            <h1 className="v4-display text-white">
              The Nexyyra <span className="v4-gold-text">Collection</span>
            </h1>
            <p className="v4-standfirst mt-4 text-white/80">
              Luxury is invested in experiences, not purchased in packages — each tier reflects a
              level of creative commitment.
            </p>
          </GlassPanel>
        </div>
      </section>

      <section className="v4-section">
        <div className="brand-container">
          <ScrollReveal preset="reveal" className="text-center">
            <span className="v4-kicker mb-4">Tiers</span>
            <h2 className="v4-title">Investment Starts From</h2>
            <p className="v4-body mx-auto mt-3 max-w-2xl text-muted">
              Each collection represents a tier of creative commitment tailored to your vision.
            </p>
          </ScrollReveal>

          {/* Billing toggle */}
          <div className="mx-auto mb-12 mt-10 flex flex-col items-center gap-3">
            <GlassPanel className="inline-flex p-1" liquid={false}>
              <div role="group" aria-label="Billing mode" className="flex">
                {(["per-event", "retainer"] as BillingMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleBillingToggle(mode)}
                    aria-pressed={billing === mode}
                    className={cn(
                      "rounded-full px-5 py-2 text-sm font-semibold transition-all tap-target",
                      billing === mode
                        ? "bg-[var(--glitz-gold)] text-[var(--primary-foreground)] shadow-[var(--v4-glow-gold)]"
                        : "text-muted hover:text-primary"
                    )}
                  >
                    {mode === "per-event" ? BILLING_LABELS[mode].left : BILLING_LABELS[mode].right}
                  </button>
                ))}
              </div>
            </GlassPanel>
            <p className="text-sm text-muted">{BILLING_LABELS[billing].note}</p>
          </div>

          {/* Tier cards */}
          <motion.div
            className="grid gap-8 lg:grid-cols-3"
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {BRAND_INVESTMENTS.map((col) => {
              const Icon = col.name.includes("Boutique")
                ? Gem
                : col.name.includes("Signature")
                  ? Crown
                  : Sparkles;
              const price =
                billing === "retainer" && col.featured ? "₹30 Lakhs/yr" : col.from;
              return (
                <motion.div key={col.name} variants={staggerItem}>
                  <GlassPanel
                    glow={col.featured}
                    className={cn(
                      "relative flex h-full flex-col p-8 transition-all duration-500 hover:-translate-y-1",
                      col.featured && "ring-2 ring-[var(--glitz-gold)] shadow-[var(--v4-glow-gold)] lg:-mt-4 lg:mb-4"
                    )}
                  >
                    {col.featured && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--glitz-gold)] px-4 py-1 text-xs font-bold text-[var(--primary-foreground)]">
                        Most Popular
                      </span>
                    )}
                    <Icon className="mb-4 h-10 w-10 text-[var(--glitz-gold)]" aria-hidden="true" />
                    <h3 className="v4-title text-2xl">{col.name}</h3>
                    <p className="mt-1 text-sm italic text-secondary">{col.tagline}</p>
                    <p className="mt-4 v4-display text-3xl font-bold v4-gold-text">{price}</p>
                    {billing === "retainer" && !col.featured && (
                      <p className="mt-1 text-xs text-muted">Custom retainer pricing available</p>
                    )}
                    <p className="mt-4 text-sm text-muted">{col.narrative}</p>
                    <ul className="mt-6 flex-1 space-y-2">
                      {col.includes.map((item) => (
                        <li key={item} className="flex gap-2 text-sm">
                          <Check
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--glitz-gold)]"
                            aria-hidden="true"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/book-event"
                      onClick={() =>
                        analytics.demoRequest(
                          `pricing_${col.name.toLowerCase().replace(/\s+/g, "_")}`
                        )
                      }
                      className={cn(
                        "luxury-button luxury-button--full mt-8 tap-target",
                        col.featured
                          ? "luxury-button--gold"
                          : "luxury-button--ghost"
                      )}
                    >
                      Request Consultation{" "}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </GlassPanel>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Comparison spine */}
          <ScrollReveal preset="reveal" className="mt-16">
            <div className="v4-hairline mx-auto mb-8 max-w-xs" />
            <h3 className="v4-title text-center text-xl">Compare at a Glance</h3>
            <GlassPanel className="mt-8 overflow-x-auto p-0">
              <table className="w-full min-w-[540px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--glitz-border)]">
                    <th className="p-4 font-semibold text-muted">Feature</th>
                    {BRAND_INVESTMENTS.map((col) => (
                      <th key={col.name} className="p-4 font-display font-semibold">
                        {col.name.replace("The ", "")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {["Dedicated director", "Vendor curation", "On-ground team", "Post-event report"].map(
                    (row, ri) => (
                      <tr key={row} className={ri % 2 === 0 ? "bg-[var(--glitz-surface)]/40" : ""}>
                        <td className="p-4 text-muted">{row}</td>
                        {BRAND_INVESTMENTS.map((col, ci) => (
                          <td key={col.name} className="p-4 text-center">
                            {ci >= BRAND_INVESTMENTS.length - 1 - ri ? (
                              <Check className="mx-auto h-4 w-4 text-[var(--glitz-gold)]" aria-hidden="true" />
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </GlassPanel>
          </ScrollReveal>
        </div>
      </section>

      <InlineBudgetCalculator />

      <section id="faq" className="v4-section-lg v4-dune-glow border-t border-[var(--glitz-border)]">
        <div className="brand-container">
          <ScrollReveal preset="reveal" className="text-center">
            <span className="v4-kicker mb-4">Questions Answered</span>
            <h2 className="v4-title">Investment & Booking FAQs</h2>
            <p className="v4-body mx-auto mt-3 max-w-2xl text-muted">
              Clear answers on packages, payments, and what to expect when you partner with Nexyyra.
            </p>
          </ScrollReveal>
          <div className="mx-auto mt-10 max-w-3xl">
            <BrandFaqAccordion items={GLITZ_FAQS} location="pricing_faq" />
          </div>
        </div>
      </section>
    </div>
  );
}
