"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarCheck, ClipboardList, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* Phase-2 entity trust remediation: this strip previously rendered
   template/demo testimonials from data/cms. Until authentic client reviews
   exist, it presents factual reasons to choose Nexyyra Events. */

type Reason = { icon: LucideIcon; title: string; copy: string };

const REASONS: Reason[] = [
  { icon: ClipboardList, title: "End-to-End Planning", copy: "Concept, venue, vendors, and day-of execution — one accountable team from start to finish." },
  { icon: Sparkles, title: "In-House Production", copy: "Décor, staging, lighting and AV designed and delivered in-house for full quality control." },
  { icon: CalendarCheck, title: "Dedicated Event Director", copy: "A single point of contact who owns your timeline, budget and on-ground team." },
];

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay: i * 0.08 },
  }),
};

export function HomeTestimonialsStrip() {
  return (
    <section id="why-nexyyra" className="lux-section" aria-labelledby="home-why-heading">
      <div className="brand-container">
        <div className="lux-section__head flex-col items-center gap-4">
          <span className="lux-label">Why Nexyyra</span>
          <h2 id="home-why-heading" className="lux-heading">
            Why Clients Choose Nexyyra Events
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {REASONS.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={r.title}
                custom={i}
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="lux-card flex h-full flex-col gap-4 p-6 sm:p-7"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--lux-border-gold)] bg-[var(--lux-card)] text-[var(--lux-gold)]">
                  <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <h3 className="text-base font-semibold text-[var(--lux-white)]">{r.title}</h3>
                <p className="flex-1 text-sm leading-relaxed text-[var(--lux-muted)]">{r.copy}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Link href="/testimonials" className="luxury-button luxury-button--ghost luxury-button--compact tap-target">
            How We Work
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
