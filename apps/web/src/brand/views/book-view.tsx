"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { BrandImage } from "@/brand/primitives/brand-image";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import { HomeAiPlanner } from "@/brand/sections/home/ai-planner";
import { LeadMagnetsSection, CallbackRequestForm } from "@/components/cro/conversion-sections";
import { InlineBudgetCalculator } from "@/components/cro/budget-calculator";
import { ScrollReveal } from "@/lib/motion";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import { Shield, Star, Lock } from "lucide-react";

const BookingWizard = dynamic(
  () => import("@/components/booking/event-architect").then((m) => m.EventArchitect),
  { loading: () => <div className="min-h-[420px] animate-pulse rounded-[var(--v4-radius-xl)] v4-glass-liquid" /> }
);

const TRUST_STRIP = [
  { icon: Star, label: "1,000+ events delivered" },
  { icon: Shield, label: "Licensed & insured" },
  { icon: Lock, label: "Secure Razorpay checkout" },
];

export function BookView() {
  return (
    <div className="brand-root">
      {/* V4 hero */}
      <section className="relative flex min-h-[56svh] items-end overflow-hidden">
        <BrandImage
          src={BRAND_IMAGES.hero.wedding}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/45 to-black/20" />
        <div className="brand-container relative w-full pb-12 pt-32 sm:pb-16">
          <GlassPanel className="max-w-2xl px-8 py-9 sm:px-10">
            <span className="v4-kicker mb-3">Consultation</span>
            <h1 className="v4-display text-white">
              Book Your <span className="v4-gold-text">Extraordinary</span> Event
            </h1>
            <p className="v4-standfirst mt-4 text-white/80">
              Our luxury planning wizard guides you from vision to celebration — one decision at a
              time.
            </p>
          </GlassPanel>
        </div>
      </section>

      {/* Trust strip */}
      <div className="border-b border-[var(--glitz-border)] bg-[var(--glitz-surface)]">
        <div className="brand-container flex flex-wrap items-center justify-center gap-6 py-4 sm:gap-10">
          {TRUST_STRIP.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-xs text-[var(--text-secondary)] sm:text-sm">
              <Icon className="h-4 w-4 text-[var(--glitz-gold)]" aria-hidden="true" />
              {label}
            </div>
          ))}
        </div>
      </div>

      <section className="v4-section bg-[var(--glitz-bg)]">
        <div className="brand-container">
          <ScrollReveal preset="reveal">
            <BookingWizard />
          </ScrollReveal>
          <p className="mt-8 text-center text-sm text-[var(--text-secondary)]">
            Prefer AI-assisted planning?{" "}
            <Link href="/ai" className="font-semibold text-[var(--glitz-gold)] underline-offset-4 hover:underline">
              Visit the AI Experience Hub
            </Link>
            .
          </p>
        </div>
      </section>

      <InlineBudgetCalculator />
      <HomeAiPlanner />
      <LeadMagnetsSection />

      <section id="callback" className="v4-section bg-[var(--glitz-surface)]">
        <div className="brand-container">
          <ScrollReveal preset="scale">
            <GlassPanel glow className="mx-auto max-w-md p-6 sm:p-8">
              <span className="v4-kicker mb-3 justify-center">Speak With Us</span>
              <h2 className="text-center font-[family-name:var(--font-playfair)] text-2xl font-semibold">
                Request a Callback
              </h2>
              <p className="mt-3 text-center text-sm text-[var(--text-secondary)]">
                Leave your details — a luxury specialist will reach out within 2 hours.
              </p>
              <div className="mt-6">
                <CallbackRequestForm />
              </div>
            </GlassPanel>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
