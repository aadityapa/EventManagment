"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { BrandImage } from "@/brand/primitives/brand-image";
import { BRAND_SERVICE_CATEGORIES } from "@/brand/data/content";
import { ScrollReveal, Parallax, staggerParent, staggerItem } from "@/lib/motion";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const FEATURED = BRAND_SERVICE_CATEGORIES[0];
const SECONDARY = BRAND_SERVICE_CATEGORIES.slice(1, 4);
const TERTIARY = BRAND_SERVICE_CATEGORIES.slice(4);

export function HomeSignatureExperiences() {
  return (
    <section id="craft" className="v4-section v4-dune-glow relative overflow-hidden bg-[var(--glitz-bg)]">
      <div className="brand-container">
        <ScrollReveal preset="reveal">
          <span className="v4-kicker mb-6">What We Craft</span>
        </ScrollReveal>
        <ScrollReveal preset="reveal" delay={0.08}>
          <h2 className="v4-display max-w-3xl">
            Signature <span className="v4-gold-text">Events</span>
          </h2>
        </ScrollReveal>
        <ScrollReveal preset="reveal" delay={0.14}>
          <p className="v4-standfirst mt-5 max-w-2xl">
            Eight pillars of excellence — weddings, corporate galas, destination celebrations, and
            stadium-scale productions, each delivered with cinematic precision.
          </p>
        </ScrollReveal>

        {/* Featured — Luxury Weddings */}
        <ScrollReveal preset="fade" delay={0.1} className="mt-14">
          <Link
            href={`/services/${FEATURED.slug}`}
            onClick={() => analytics.featureClick(FEATURED.slug, "home_signature_featured")}
            className="group relative block overflow-hidden rounded-[var(--v4-radius-xl)]"
          >
            <Parallax distance={40} className="relative aspect-[21/9] min-h-[280px] sm:min-h-[360px]">
              <BrandImage
                src={FEATURED.image}
                alt={FEATURED.title}
                fill
                sizes="100vw"
                priority={false}
                className="scale-[1.06] object-cover transition-transform duration-[1.2s] ease-[var(--v4-ease-luxe)] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
            </Parallax>
            <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 lg:p-14">
              <span className="v4-kicker mb-4 text-[var(--adaptive-accent,var(--glitz-gold))]">
                Featured
              </span>
              <h3 className="v4-display max-w-xl text-white">{FEATURED.title}</h3>
              <p className="v4-standfirst mt-4 max-w-lg text-white/80">{FEATURED.narrative}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--glitz-gold-light)] transition-transform group-hover:translate-x-1">
                Explore {FEATURED.title}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </Link>
        </ScrollReveal>

        {/* Secondary row — asymmetric overlap */}
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-8 grid gap-5 sm:grid-cols-3 lg:-mt-6 lg:grid-cols-3 lg:gap-6"
        >
          {SECONDARY.map((s, i) => (
            <motion.div
              key={s.slug}
              variants={staggerItem}
              className={cn(i === 1 && "lg:translate-y-8")}
            >
              <ServiceCard service={s} size="md" location="home_signature_secondary" />
            </motion.div>
          ))}
        </motion.div>

        {/* Tertiary — compact grid */}
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5"
        >
          {TERTIARY.map((s) => (
            <motion.div key={s.slug} variants={staggerItem}>
              <ServiceCard service={s} size="sm" location="home_signature_grid" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  size,
  location,
}: {
  service: (typeof BRAND_SERVICE_CATEGORIES)[number];
  size: "md" | "sm";
  location: string;
}) {
  return (
    <Link
      href={`/services/${service.slug}`}
      onClick={() => analytics.featureClick(service.slug, location)}
      className="group v4-glass block overflow-hidden transition-transform duration-500 hover:-translate-y-1 hover:shadow-[var(--v4-glow-gold)]"
    >
      <div className={cn("relative overflow-hidden", size === "md" ? "h-44" : "h-32")}>
        <BrandImage
          src={service.image}
          alt={service.title}
          fill
          sizes={size === "md" ? "33vw" : "20vw"}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <h3
          className={cn(
            "absolute bottom-3 left-3 font-[family-name:var(--font-playfair)] font-semibold text-white",
            size === "md" ? "text-lg" : "text-sm"
          )}
        >
          {service.title}
        </h3>
      </div>
      {size === "md" && (
        <p className="line-clamp-2 p-4 text-xs leading-relaxed text-[var(--text-secondary)]">
          {service.narrative}
        </p>
      )}
    </Link>
  );
}
