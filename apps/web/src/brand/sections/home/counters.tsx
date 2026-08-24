"use client";

import { motion } from "framer-motion";
import { ClipboardList, Handshake, ShieldCheck, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* Phase-2 entity trust remediation: the previous animated counters
   (100+ events / 150+ clients / 5+ years / 20+ planners) conflicted with
   other unverified figures elsewhere on the site. Until audited numbers
   exist, this band presents qualitative, verifiable service facts. */

type Pillar = { icon: LucideIcon; value: string; label: string };

const PILLARS: Pillar[] = [
  { icon: ClipboardList, value: "End-to-End", label: "Planning & Execution" },
  { icon: Sparkles, value: "In-House", label: "Design & Production" },
  { icon: Handshake, value: "Pan-India", label: "Service Coverage" },
  { icon: ShieldCheck, value: "Discreet", label: "Private by Default" },
];

export function HomeCounters() {
  return (
    <section className="lux-section lux-section--tight" aria-label="What Nexyyra Events delivers">
      <div className="brand-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="lux-card lux-counters"
        >
          {PILLARS.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.label} className="lux-counter">
                <span className="lux-counter__icon" aria-hidden>
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <div>
                  <p className="lux-counter__value">{p.value}</p>
                  <p className="lux-counter__label">{p.label}</p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
