"use client";

import { motion } from "framer-motion";
import { BrandSection, BrandHeader } from "@/brand/primitives/brand-section";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const DIFFERENTIATORS = [
  "Bespoke luxury planning from concept to curtain call",
  "Exclusive venue access across India and abroad",
  "Celebrity network and VIP hospitality",
  "Dedicated coordinators with 24/7 client support",
];

export function HomeIntro() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <BrandSection>
      <div ref={ref} className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <BrandHeader
            label="Who We Are"
            title="Architects of Extraordinary Celebrations"
            subtitle="Glitz Events & Promotions crafts cinematic experiences for India's most discerning hosts — where storytelling, precision, and luxury converge."
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="brand-surface space-y-5 p-8 sm:p-10"
        >
          <p className="text-muted leading-relaxed">
            For over a decade, we have transformed weddings, corporate galas, concerts, and destination celebrations into
            immersive worlds of elegance. Every event is a bespoke narrative — designed, produced, and delivered with
            obsessive attention to detail.
          </p>
          <ul className="space-y-3">
            {DIFFERENTIATORS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-muted">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--glitz-gold)]" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </BrandSection>
  );
}
