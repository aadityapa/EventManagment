"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { BrandImage } from "@/brand/primitives/brand-image";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import { ScrollReveal, Parallax, staggerParent, staggerItem } from "@/lib/motion";

const DIFFERENTIATORS = [
  "Bespoke planning from concept to curtain call",
  "Exclusive venue access across India and abroad",
  "Celebrity network and VIP hospitality",
  "Dedicated coordinators with 24/7 support",
];

/**
 * V4 editorial reference section. Asymmetric 7/5 split: text column reveals
 * with the shared motion grammar; media column parallaxes while a liquid-glass
 * stat card counter-floats — proving depth + the design system end to end.
 */
export function HomeIntro() {
  return (
    <section className="v4-section v4-dune-glow relative overflow-hidden bg-[var(--glitz-bg)]">
      <div className="brand-container grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Editorial text — 7 cols */}
        <div className="lg:col-span-7">
          <ScrollReveal preset="reveal">
            <span className="v4-kicker mb-6">Who We Are</span>
          </ScrollReveal>

          <ScrollReveal preset="reveal" delay={0.08}>
            <h2 className="v4-display">
              Architects of <span className="v4-gold-text">Extraordinary</span> Celebrations
            </h2>
          </ScrollReveal>

          <ScrollReveal preset="reveal" delay={0.16}>
            <p className="v4-standfirst mt-6 max-w-2xl">
              Glitz Events &amp; Promotions crafts cinematic experiences for India&apos;s most
              discerning hosts — where storytelling, precision, and luxury converge.
            </p>
          </ScrollReveal>

          <ScrollReveal preset="reveal" delay={0.24}>
            <p className="v4-body mt-6">
              For over a decade, we have transformed weddings, corporate galas, concerts, and
              destination celebrations into immersive worlds of elegance. Every event is a bespoke
              narrative — designed, produced, and delivered with obsessive attention to detail.
            </p>
          </ScrollReveal>

          <motion.ul
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="mt-9 grid gap-x-8 gap-y-3 sm:grid-cols-2"
          >
            {DIFFERENTIATORS.map((item) => (
              <motion.li
                key={item}
                variants={staggerItem}
                className="flex items-start gap-3 text-sm text-[var(--text-secondary)]"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--glitz-gold)]" />
                {item}
              </motion.li>
            ))}
          </motion.ul>

          <ScrollReveal preset="reveal" delay={0.1}>
            <Link
              href="/about"
              className="group mt-10 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--glitz-gold)] transition-colors hover:text-[var(--glitz-gold-light)]"
            >
              Our Story
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </ScrollReveal>
        </div>

        {/* Media — 5 cols, parallax + floating glass stat card */}
        <div className="relative lg:col-span-5">
          <ScrollReveal preset="fade">
            <Parallax distance={60} className="relative aspect-[4/5] overflow-hidden rounded-[var(--v4-radius-lg)]">
              <BrandImage
                src={BRAND_IMAGES.about}
                alt="A Glitz Events celebration in production"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="scale-[1.08] object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            </Parallax>
          </ScrollReveal>

          <Parallax distance={-40} axis="y" className="absolute -bottom-7 -left-5 sm:-left-8">
            <div className="v4-glass-liquid px-6 py-5">
              <p className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[var(--glitz-gold)]">
                12<span className="text-[var(--glitz-gold-light)]">+</span>
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                Years · 1,000+ Events
              </p>
            </div>
          </Parallax>
        </div>
      </div>
    </section>
  );
}
