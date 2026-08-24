"use client";

import Link from "next/link";
import { CalendarCheck, ClipboardList, Handshake, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BrandPageHero } from "@/brand/primitives/brand-hero";
import { BrandSection, BrandHeader } from "@/brand/primitives/brand-section";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import { BRAND_IMAGES } from "@/brand/data/imagery";

/* Phase-2 entity trust remediation: the previous carousel showed template/demo
   testimonials and a fabricated "4.9 Star / Google Reviews" claim. Until real,
   attributable client reviews exist, this page presents factual reasons to
   choose Nexyyra Events instead. Add genuine testimonials here when available. */

type Reason = { icon: LucideIcon; title: string; copy: string };

const REASONS: Reason[] = [
  { icon: ClipboardList, title: "End-to-End Planning", copy: "One team owns your event from concept and venue curation to vendor management and day-of execution." },
  { icon: Sparkles, title: "In-House Design & Production", copy: "Décor, staging, lighting and AV are designed and produced in-house — no hand-offs, no surprises." },
  { icon: Wallet, title: "Transparent Budgeting", copy: "Clear proposals with itemized costs and no hidden margins, agreed before work begins." },
  { icon: CalendarCheck, title: "Dedicated Event Director", copy: "A single accountable point of contact runs your timeline, vendors and on-ground team." },
  { icon: ShieldCheck, title: "Discretion by Default", copy: "Private celebrations stay private — NDA-bound teams and careful media handling." },
  { icon: Handshake, title: "Pan-India Delivery", copy: "Weddings, corporate events and destination celebrations delivered across India from our Pune coordination office." },
];

export function TestimonialsView() {
  return (
    <div className="brand-root">
      <BrandPageHero
        label="Why Nexyyra"
        title="Why Clients Choose Us"
        subtitle="Factual, verifiable reasons — not borrowed praise."
        image={BRAND_IMAGES.testimonials[0]}
      />
      <BrandSection>
        <BrandHeader label="The Nexyyra Standard" title="What working with us looks like" center />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((r) => {
            const Icon = r.icon;
            return (
              <GlassPanel key={r.title} className="h-full p-6 transition-transform duration-500 hover:-translate-y-1">
                <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--glitz-gold)]/35 bg-[var(--glitz-gold)]/10 text-[var(--glitz-gold)]">
                  <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <h3 className="font-[family-name:var(--font-cormorant)] text-xl font-semibold text-[var(--text-primary)]">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{r.copy}</p>
              </GlassPanel>
            );
          })}
        </div>
        <div className="mt-12 flex justify-center">
          <Link href="/book-event" className="luxury-button luxury-button--purple tap-target">
            Plan Your Event
          </Link>
        </div>
      </BrandSection>
    </div>
  );
}
