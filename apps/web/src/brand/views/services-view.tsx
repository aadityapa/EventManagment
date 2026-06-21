"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { BrandImage } from "@/brand/primitives/brand-image";
import { BrandButton } from "@/brand/primitives/brand-button";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import { MagneticButton } from "@/components/effects/magnetic-button";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import {
  BRAND_SERVICE_CATEGORIES,
  BRAND_PROCESS_STEPS,
} from "@/brand/data/content";
import { ScrollReveal, staggerParent, staggerItem } from "@/lib/motion";
import { useGsapContext, gsap } from "@/lib/gsap/use-gsap";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const FEATURED = BRAND_SERVICE_CATEGORIES[0];
const SECONDARY = BRAND_SERVICE_CATEGORIES.slice(1, 4);
const TERTIARY = BRAND_SERVICE_CATEGORIES.slice(4);
const FEATURES = [
  "Dedicated event director",
  "Vendor curation",
  "Timeline management",
  "On-ground coordination",
];

export function ServicesView() {
  const featuredRef = useRef<HTMLElement>(null);

  useGsapContext(featuredRef, () => {
    const section = featuredRef.current;
    if (!section) return;
    const media = section.querySelector("[data-featured-media]");
    if (!media) return;

    gsap.fromTo(
      media,
      { scale: 1.08 },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      }
    );
  }, []);

  return (
    <div className="brand-root">
      {/* Hero */}
      <section className="relative flex min-h-[68svh] items-end overflow-hidden">
        <BrandImage
          src={BRAND_IMAGES.hero.wedding}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />
        <div className="brand-container relative w-full pb-16 pt-32 sm:pb-20">
          <GlassPanel className="max-w-2xl px-8 py-10 sm:px-10">
            <span className="v4-kicker mb-4">What We Craft</span>
            <h1 className="v4-display text-white">
              Luxury Event <span className="v4-gold-text">Services</span>
            </h1>
            <p className="v4-standfirst mt-4 text-white/80">
              Immersive storytelling, flawless execution, and conversion-focused experiences for
              India&apos;s most discerning hosts.
            </p>
          </GlassPanel>
        </div>
      </section>

      {/* Featured — Luxury Weddings */}
      <section
        ref={featuredRef}
        className="v4-section v4-dune-glow relative overflow-hidden bg-[var(--glitz-bg)]"
        aria-labelledby="featured-service-heading"
      >
        <div className="brand-container">
          <ScrollReveal preset="reveal">
            <span className="v4-kicker mb-4">Signature</span>
          </ScrollReveal>
          <Link
            href={`/services/${FEATURED.slug}`}
            onClick={() => analytics.featureClick(FEATURED.slug, "services_featured")}
            className="group relative mt-6 block overflow-hidden rounded-[var(--v4-radius-xl)]"
          >
            <div data-featured-media className="relative aspect-[21/9] min-h-[300px] sm:min-h-[380px]">
              <BrandImage
                src={FEATURED.image}
                alt={FEATURED.title}
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 lg:p-16">
              <span className="v4-kicker mb-3 text-[var(--adaptive-accent,var(--glitz-gold))]">
                Featured Service
              </span>
              <h2 id="featured-service-heading" className="v4-display max-w-xl text-white">
                {FEATURED.title}
              </h2>
              <p className="v4-standfirst mt-4 max-w-lg text-white/80">{FEATURED.narrative}</p>
              <p className="mt-4 max-w-lg rounded-lg border border-[var(--glitz-gold)]/25 bg-black/30 px-4 py-3 text-sm text-white/85 backdrop-blur-sm">
                <strong className="text-[var(--glitz-gold)]">Case study:</strong> {FEATURED.caseStudy}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--glitz-gold-light)] transition-transform group-hover:translate-x-1">
                Explore {FEATURED.title}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Asymmetric grid — secondary + tertiary */}
      <section className="v4-section bg-[var(--glitz-surface)]">
        <div className="brand-container">
          <ScrollReveal preset="reveal">
            <h2 className="v4-display">
              Full <span className="v4-gold-text">Spectrum</span>
            </h2>
            <p className="v4-standfirst mt-4 max-w-2xl">
              Nine pillars of excellence — each delivered with the same cinematic precision we bring
              to palace weddings.
            </p>
          </ScrollReveal>

          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="mt-12 grid gap-5 sm:grid-cols-3 lg:-mt-4"
          >
            {SECONDARY.map((s, i) => (
              <motion.div key={s.slug} variants={staggerItem} className={cn(i === 1 && "lg:translate-y-10")}>
                <ServiceCard service={s} size="md" location="services_secondary" />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5"
          >
            {TERTIARY.map((s) => (
              <motion.div key={s.slug} variants={staggerItem}>
                <ServiceCard service={s} size="sm" location="services_grid" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process spine */}
      <section className="v4-section v4-dune-glow bg-[var(--glitz-bg)]">
        <div className="brand-container">
          <ScrollReveal preset="reveal">
            <span className="v4-kicker mb-4">Our Process</span>
            <h2 className="v4-display max-w-2xl">
              Concept to <span className="v4-gold-text">Curtain Call</span>
            </h2>
          </ScrollReveal>

          <div className="relative mt-14">
            <div
              className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-[var(--glitz-gold)]/40 to-transparent lg:block"
              aria-hidden="true"
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {BRAND_PROCESS_STEPS.map((step, i) => (
                <ScrollReveal key={step.step} preset="scale" delay={i * 0.06}>
                  <GlassPanel className="relative h-full p-6 text-center">
                    <span className="font-[family-name:var(--font-cinzel)] text-2xl font-bold text-[var(--glitz-gold)]">
                      {step.step}
                    </span>
                    <h3 className="mt-3 font-semibold">{step.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                      {step.desc}
                    </p>
                  </GlassPanel>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <ScrollReveal preset="fade" delay={0.1} className="mt-12">
            <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <CheckCircle2 className="h-4 w-4 text-[var(--glitz-gold)]" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </section>

      {/* Cross-links + CTA */}
      <section className="v4-section-lg bg-[var(--glitz-surface)]">
        <div className="brand-container">
          <div className="grid gap-6 lg:grid-cols-2">
            <ScrollReveal preset="left">
              <GlassPanel className="p-8">
                <span className="v4-kicker mb-3">Venues</span>
                <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold">
                  Where it happens
                </h3>
                <p className="v4-body mt-3">
                  Palaces, beachfronts, and ballroom icons — curated for your vision.
                </p>
                <Link
                  href="/venues"
                  onClick={() => analytics.ctaClick("view_venues", "services_cross")}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--glitz-gold)] hover:underline"
                >
                  Explore Venues <ArrowUpRight className="h-4 w-4" />
                </Link>
              </GlassPanel>
            </ScrollReveal>
            <ScrollReveal preset="right">
              <GlassPanel className="p-8">
                <span className="v4-kicker mb-3">Vendors</span>
                <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold">
                  Trusted artisans
                </h3>
                <p className="v4-body mt-3">
                  Photographers, decorators, caterers — vetted for luxury standards.
                </p>
                <Link
                  href="/vendors"
                  onClick={() => analytics.ctaClick("view_vendors", "services_cross")}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--glitz-gold)] hover:underline"
                >
                  Browse Vendors <ArrowUpRight className="h-4 w-4" />
                </Link>
              </GlassPanel>
            </ScrollReveal>
          </div>

          <ScrollReveal preset="scale" className="mt-14">
            <GlassPanel glow className="mx-auto max-w-3xl px-8 py-14 text-center sm:px-14">
              <h2 className="v4-display">Begin your journey</h2>
              <p className="v4-standfirst mx-auto mt-4 max-w-lg">
                Schedule a private consultation with our luxury specialists — complimentary and
                without obligation.
              </p>
              <div className="mt-8 flex justify-center">
                <MagneticButton>
                  <BrandButton
                    href="/book-event"
                    onClick={() => analytics.ctaClick("book_consultation", "services_cta")}
                  >
                    Book Consultation
                  </BrandButton>
                </MagneticButton>
              </div>
            </GlassPanel>
          </ScrollReveal>
        </div>
      </section>
    </div>
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
      className="group v4-glass block overflow-hidden rounded-[var(--v4-radius-lg)] transition-transform duration-500 hover:-translate-y-1 hover:shadow-[var(--v4-glow-gold)]"
    >
      <div className={cn("relative overflow-hidden", size === "md" ? "h-48" : "h-32")}>
        <BrandImage
          src={service.image}
          alt={service.title}
          fill
          sizes={size === "md" ? "33vw" : "20vw"}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
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
