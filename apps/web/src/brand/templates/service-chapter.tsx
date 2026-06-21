"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Check, CheckCircle2 } from "lucide-react";
import { BrandImage } from "@/brand/primitives/brand-image";
import { BrandButton } from "@/brand/primitives/brand-button";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import { MagneticButton } from "@/components/effects/magnetic-button";
import { DynamicIcon } from "@/components/shared/dynamic-icon";
import { ServiceFaqSection } from "@/components/services/service-faq-section";
import { BRAND_PROCESS_STEPS, BRAND_SERVICE_STATS } from "@/brand/data/content";
import { ScrollReveal, staggerParent, staggerItem } from "@/lib/motion";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import type { ServiceFaq } from "@/data/service-faqs";
import type { ContextualLink } from "@/lib/wedding-internal-links";
import { ContextualLinksBlock } from "@/components/seo/contextual-links-block";
import type { MediaAsset } from "@/lib/media/types";

export type ServiceChapterProps = {
  service: {
    slug: string;
    title: string;
    description: string;
    image: string;
    icon: string;
    basePrice: number;
    features: string[];
  };
  faqs: ServiceFaq[];
  related: Array<{ slug: string; title: string; icon: string }>;
  contextualLinks?: ContextualLink[];
  pageIntro?: string;
  galleryAssets?: MediaAsset[];
};

/** V5 cinematic service chapter template. */
export function ServiceChapter({ service, faqs, related, contextualLinks = [], pageIntro, galleryAssets = [] }: ServiceChapterProps) {
  const world = useSearchParams().get("world");
  const bookHref = world ? `/book-event?world=${world}&service=${service.slug}` : `/book-event?service=${service.slug}`;
  const galleryMoments = galleryAssets.length
    ? galleryAssets.slice(0, 3).map((asset) => ({
        src: asset.src,
        alt: asset.alt,
      }))
    : Array.from({ length: 3 }, (_, i) => ({
        src: service.image,
        alt: `${service.title} gallery image ${i + 1}`,
      }));

  return (
    <>
      <section className="relative flex min-h-[72svh] items-end overflow-hidden">
        <BrandImage src={service.image} alt={`${service.title} — Nexyyra Events`} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--v5-obsidian,#050505)]/90 via-black/45 to-black/25" />
        <div className="brand-container relative w-full pb-16 pt-32 sm:pb-20">
          <GlassPanel variant="portal" glow className="max-w-2xl px-8 py-10 sm:px-10">
            <div className="flex items-center gap-3 text-[var(--glitz-gold)]">
              <DynamicIcon name={service.icon} className="h-7 w-7" aria-hidden />
              <span className="v4-kicker mb-0">Service Chapter</span>
            </div>
            <h1 className="v4-display mt-3 text-white">{service.title}</h1>
            <p className="v4-standfirst mt-4 text-white/80">{service.description}</p>
            <p className="mt-4 text-sm text-[var(--glitz-gold-light)]">From {formatCurrency(service.basePrice)}</p>
            <MagneticButton className="mt-6 inline-block">
              <BrandButton href={bookHref} variant="gold">
                Commission This Experience
              </BrandButton>
            </MagneticButton>
          </GlassPanel>
        </div>
      </section>

      <section className="v4-section bg-[var(--glitz-bg)]">
        <div className="brand-container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ScrollReveal preset="reveal">
              <span className="v4-kicker mb-4">Process Film</span>
              <h2 className="v4-display max-w-xl">How We <span className="v4-gold-text">Deliver</span></h2>
              {pageIntro && (
                <p className="v4-standfirst mt-6 max-w-2xl text-[var(--text-secondary)]">{pageIntro}</p>
              )}
            </ScrollReveal>
            <motion.ol variants={staggerParent} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-10 space-y-6">
              {BRAND_PROCESS_STEPS.map((s) => (
                <motion.li key={s.step} variants={staggerItem} className="flex gap-4 border-l border-[var(--glitz-gold)]/30 pl-6">
                  <span className="font-[family-name:var(--font-cinzel)] text-sm text-[var(--glitz-gold)]">{s.step}</span>
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">{s.title}</p>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">{s.desc}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ol>
          </div>
          <GlassPanel glow className="h-fit px-6 py-8 lg:col-span-5">
            <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold">Proof</h3>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {BRAND_SERVICE_STATS.map((s) => (
                <div key={s.label}>
                  <p className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[var(--glitz-gold)]">
                    {s.value}{s.suffix}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">{s.label}</p>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </section>

      <section className="v4-section bg-[var(--glitz-surface)]">
        <div className="brand-container">
          <ScrollReveal preset="reveal">
            <h2 className="v4-display">What&apos;s <span className="v4-gold-text">Included</span></h2>
          </ScrollReveal>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {service.features.map((feature) => (
              <GlassPanel key={feature} variant="commission" className="flex items-center gap-3 px-4 py-4">
                <Check className="h-5 w-5 shrink-0 text-[var(--glitz-gold)]" aria-hidden />
                <span className="text-sm">{feature}</span>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      <section className="v4-section bg-[var(--glitz-bg)]">
        <div className="brand-container">
          <ScrollReveal preset="fade">
            <h2 className="v4-display mb-8">Gallery <span className="v4-gold-text">Moments</span></h2>
          </ScrollReveal>
          <div className="grid gap-4 sm:grid-cols-3">
            {galleryMoments.map((moment, i) => (
              <div key={`${moment.src}-${i}`} className="relative aspect-[4/3] overflow-hidden rounded-[var(--v4-radius-lg)]">
                <BrandImage
                  src={moment.src}
                  alt={moment.alt}
                  fill
                  sizes="33vw"
                  loading="lazy"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="v4-section bg-[var(--glitz-surface)]">
        <div className="brand-container">
          <ServiceFaqSection faqs={faqs} serviceTitle={service.title} slug={service.slug} />
        </div>
      </section>

      {contextualLinks.length > 0 && (
        <section className="v4-section bg-[var(--glitz-bg)]">
          <div className="brand-container max-w-3xl">
            <ContextualLinksBlock title="Related Pages" links={contextualLinks} />
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="v4-section bg-[var(--glitz-bg)]">
          <div className="brand-container">
            <h2 className="v4-display mb-6">Related <span className="v4-gold-text">Chapters</span></h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((s) => (
                <Link key={s.slug} href={`/services/${s.slug}`} className="v4-glass group flex items-center gap-3 p-4 transition-all hover:shadow-[var(--v4-glow-gold)]">
                  <DynamicIcon name={s.icon} className="h-6 w-6 text-[var(--glitz-gold)]" />
                  <span className="font-medium group-hover:text-[var(--glitz-gold)]">{s.title}</span>
                  <ArrowRight className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="v4-section-lg v4-dune-glow bg-[var(--glitz-surface)]">
        <div className="brand-container text-center">
          <GlassPanel glow className="mx-auto max-w-2xl px-8 py-12">
            <CheckCircle2 className="mx-auto h-8 w-8 text-[var(--glitz-gold)]" aria-hidden />
            <h2 className="v4-display mt-4">Ready to commission?</h2>
            <p className="v4-standfirst mx-auto mt-4 max-w-md">Speak with an Event Architect — bespoke planning from concept to curtain call.</p>
            <MagneticButton className="mt-8 inline-block">
              <BrandButton href={bookHref} variant="gold">Book Consultation</BrandButton>
            </MagneticButton>
          </GlassPanel>
        </div>
      </section>
    </>
  );
}
