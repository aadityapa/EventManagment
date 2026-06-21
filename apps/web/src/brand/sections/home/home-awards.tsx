"use client";

import { Award } from "lucide-react";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import { BRAND_AWARDS } from "@/brand/data/content";
import { ScrollReveal } from "@/lib/motion";

export function HomeAwards() {
  return (
    <section id="awards" className="v4-section relative bg-[var(--glitz-bg)]" aria-labelledby="awards-heading">
      <div className="brand-container">
        <ScrollReveal preset="reveal">
          <span className="v4-kicker mb-6">Recognition</span>
        </ScrollReveal>
        <ScrollReveal preset="reveal" delay={0.08}>
          <h2 id="awards-heading" className="v4-display max-w-xl">
            Awards &amp; <span className="v4-gold-text">Distinction</span>
          </h2>
        </ScrollReveal>
        <ScrollReveal preset="fade" delay={0.14}>
          <p className="v4-standfirst mt-5 max-w-xl">
            Industry recognition for excellence in luxury weddings, corporate experiences, and
            celebration design across India.
          </p>
        </ScrollReveal>

        <ScrollReveal preset="fade" delay={0.18} className="mt-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BRAND_AWARDS.map((a) => (
              <GlassPanel key={a.title} variant="commission" className="px-4 py-5">
                <Award className="mb-3 h-5 w-5 text-[var(--glitz-gold)]" aria-hidden />
                <p className="text-sm font-semibold text-[var(--text-primary)]">{a.title}</p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {a.org} · {a.year}
                </p>
              </GlassPanel>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
