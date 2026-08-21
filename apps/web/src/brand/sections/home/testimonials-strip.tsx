"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { testimonials } from "@/data/cms";

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay: i * 0.08 },
  }),
};

/**
 * Homepage social proof — three client voices in the lux design language,
 * linking through to the full testimonials page.
 */
export function HomeTestimonialsStrip() {
  const featured = testimonials.slice(0, 3);

  return (
    <section id="client-stories" className="lux-section" aria-labelledby="home-testimonials-heading">
      <div className="brand-container">
        <div className="lux-section__head flex-col items-center gap-4">
          <span className="lux-label">Client Stories</span>
          <h2 id="home-testimonials-heading" className="lux-heading">
            Trusted by Discerning Clients
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((t, i) => (
            <motion.blockquote
              key={t.id}
              custom={i}
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="lux-card flex h-full flex-col gap-4 p-6 sm:p-7"
            >
              <div className="flex gap-1" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star
                    key={s}
                    className="h-3.5 w-3.5 fill-[var(--lux-gold)] text-[var(--lux-gold)]"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="flex-1 text-sm leading-relaxed text-[var(--lux-muted)]">
                &ldquo;{t.content}&rdquo;
              </p>
              <footer>
                <p className="text-sm font-semibold text-[var(--lux-white)]">{t.name}</p>
                <p className="mt-0.5 text-xs text-[var(--lux-subtle)]">{t.role}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link href="/testimonials" className="luxury-button luxury-button--ghost luxury-button--compact tap-target">
            Read All Client Stories
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
