"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { analytics } from "@/lib/analytics";

export function HomeCtaBand() {
  return (
    <section id="plan" className="lux-section lux-section--tight" aria-labelledby="cta-band-heading">
      <div className="brand-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="lux-card lux-cta-band"
        >
          <h2 id="cta-band-heading" className="lux-cta-band__title">
            Let&apos;s Make Your Next Event{" "}
            <span className="lux-accent-purple">Extraordinary</span>
          </h2>
          <Link
            href="/book-event"
            onClick={() => analytics.ctaClick("lets_plan_together", "home_cta_band")}
            className="luxury-button luxury-button--purple tap-target"
          >
            Let&apos;s Plan Together
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
