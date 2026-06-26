"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Award, ArrowRight, Eye, Target, Gem, Crown, ShieldCheck, Globe, Sparkles } from "lucide-react";
import { BrandImage } from "@/brand/primitives/brand-image";
import { BrandButton } from "@/brand/primitives/brand-button";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import { MagneticButton } from "@/components/effects/magnetic-button";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import { BRAND_TIMELINE, BRAND_AWARDS, BRAND_MEDIA, BRAND_TRUST } from "@/brand/data/content";
import { companyProfile } from "@/data/cms";
import { ScrollReveal, Parallax, staggerParent, staggerItem } from "@/lib/motion";
import { useGsapContext, gsap } from "@/lib/gsap/use-gsap";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const MANIFESTO =
  "We believe luxury is intention — every candle, every cue, every guest experience deliberately crafted so the celebration feels effortless and eternal.";

const TRUST_PILLARS = [
  { icon: Crown, title: "Uncompromising Craft", copy: "Every detail engineered to museum standards — nothing is left to chance." },
  { icon: ShieldCheck, title: "Absolute Discretion", copy: "NDA-bound teams and airtight privacy for high-profile clients and brands." },
  { icon: Globe, title: "Pan-India Production", copy: "35+ cities, palace to penthouse — fully in-house, fully owned execution." },
  { icon: Sparkles, title: "Cinematic Execution", copy: "Broadcast-grade AV, lighting and stagecraft on every single production." },
] as const;

export function AboutView() {
  const timelineRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGsapContext(timelineRef, () => {
    if (reducedMotion) return;
    const section = timelineRef.current;
    if (!section) return;

    const items = section.querySelectorAll("[data-milestone]");
    const track = section.querySelector("[data-timeline-track]");

    if (track) {
      gsap.fromTo(
        track,
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            end: "bottom 40%",
            scrub: 1,
          },
        }
      );
    }

    items.forEach((item, i) => {
      gsap.from(item, {
        x: i % 2 === 0 ? -48 : 48,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 82%",
          once: true,
        },
      });

      gsap.to(item.querySelector("[data-year-pin]"), {
        scale: 1.12,
        borderColor: "rgba(216, 178, 106, 0.9)",
        duration: 0.35,
        scrollTrigger: {
          trigger: item,
          start: "top 65%",
          toggleActions: "play none none reverse",
        },
      });
    });
  }, [reducedMotion]);

  return (
    <div className="brand-root">
      {/* Hero */}
      <section className="relative flex min-h-[72svh] items-end overflow-hidden">
        <BrandImage
          src={BRAND_IMAGES.about}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/45 to-black/25" />
        <div className="brand-container relative w-full pb-16 pt-32 sm:pb-20">
          <GlassPanel className="max-w-2xl px-8 py-10 sm:px-10">
            <span className="v4-kicker mb-4">Our Story</span>
            <h1 className="v4-display text-white">
              The Next Era of <span className="v4-gold-text">Celebrations</span>
            </h1>
            <p className="v4-standfirst mt-4 text-white/80">
              Experience architects, celebration designers, and memory creators — crafting
              extraordinary moments since 2012.
            </p>
          </GlassPanel>
        </div>
      </section>

      {/* Manifesto */}
      <section className="v4-section-lg relative overflow-hidden bg-[var(--glitz-bg)]">
        <div className="brand-container">
          <ScrollReveal preset="fade">
            <blockquote className="mx-auto max-w-4xl text-center">
              <p className="font-[family-name:var(--font-playfair)] text-2xl font-medium italic leading-snug text-[var(--text-primary)] sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-[1.25]">
                &ldquo;{MANIFESTO}&rdquo;
              </p>
            </blockquote>
          </ScrollReveal>
        </div>
      </section>

      {/* Founder story */}
      <section className="v4-section v4-dune-glow bg-[var(--glitz-surface)]">
        <div className="brand-container grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <ScrollReveal preset="reveal">
              <span className="v4-kicker mb-4">Founder Philosophy</span>
              <h2 className="v4-display">
                We Architect <span className="v4-gold-text">Experiences</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal preset="reveal" delay={0.08}>
              <p className="v4-standfirst mt-6">{companyProfile.introduction}</p>
            </ScrollReveal>
            <ScrollReveal preset="reveal" delay={0.14}>
              <p className="v4-body mt-5">
                Founded by Priya Sharma in Pune in 2012, Nexyyra began as an intimate wedding studio
                with a singular belief: every celebration carries the weight of memory. What started
                with one family&apos;s dream wedding in Koregaon Park has grown into a luxury event
                house trusted by 1,400+ clients across 35 cities.
              </p>
              <p className="v4-body mt-4">{companyProfile.story}</p>
            </ScrollReveal>
            <ScrollReveal preset="reveal" delay={0.2}>
              <MagneticButton>
                <BrandButton
                  href="/book-event"
                  className="mt-8"
                  onClick={() => analytics.ctaClick("book_consultation", "about_founder")}
                >
                  Book Consultation <ArrowRight className="h-4 w-4" />
                </BrandButton>
              </MagneticButton>
            </ScrollReveal>
          </div>
          <ScrollReveal preset="fade" delay={0.1} className="lg:col-span-6">
            <Parallax distance={60} className="relative aspect-[4/5] overflow-hidden rounded-[var(--v4-radius-xl)]">
              <BrandImage src={BRAND_IMAGES.hero.palace} alt="Luxury venue" fill sizes="50vw" />
            </Parallax>
          </ScrollReveal>
        </div>
      </section>

      {/* Vision / Mission / Philosophy */}
      <section className="v4-section bg-[var(--glitz-bg)]">
        <div className="brand-container">
          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-6 md:grid-cols-3"
          >
            {[
              { icon: Eye, t: "Vision", c: companyProfile.vision },
              { icon: Target, t: "Mission", c: companyProfile.mission },
              { icon: Gem, t: "Philosophy", c: "Luxury is intention — every detail deliberately crafted." },
            ].map(({ icon: Icon, t, c }) => (
              <motion.div key={t} variants={staggerItem}>
                <GlassPanel className="h-full p-8 transition-transform duration-500 hover:-translate-y-1">
                  <Icon className="mb-4 h-8 w-8 text-[var(--glitz-gold)]" aria-hidden="true" />
                  <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold">{t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{c}</p>
                </GlassPanel>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Sticky-scroll timeline */}
      <section
        ref={timelineRef}
        className="v4-section relative bg-[var(--glitz-surface)]"
        aria-labelledby="timeline-heading"
      >
        <div className="brand-container">
          <ScrollReveal preset="reveal">
            <span className="v4-kicker mb-4">Journey</span>
            <h2 id="timeline-heading" className="v4-display max-w-xl">
              Milestones that <span className="v4-gold-text">shaped us</span>
            </h2>
          </ScrollReveal>

          <div className="relative mx-auto mt-16 max-w-3xl">
            <div
              data-timeline-track
              className="absolute bottom-0 left-4 top-0 w-px origin-top bg-gradient-to-b from-[var(--glitz-gold)]/20 via-[var(--glitz-gold)]/50 to-[var(--glitz-gold)]/20 sm:left-1/2 sm:-ml-px"
              aria-hidden="true"
            />
            <ol className="space-y-16 sm:space-y-20">
              {BRAND_TIMELINE.map((item, i) => (
                <li
                  key={item.year}
                  data-milestone
                  className={cn(
                    "relative grid sm:grid-cols-2 sm:gap-12",
                    i % 2 === 0 ? "sm:text-right" : "sm:[direction:rtl]"
                  )}
                >
                  <div className={cn("sm:px-8", i % 2 === 1 && "sm:[direction:ltr]")}>
                    <span
                      data-year-pin
                      className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--glitz-gold)]/50 bg-[var(--glitz-bg)] text-xs font-bold text-[var(--glitz-gold)] sm:left-1/2 sm:-translate-x-1/2"
                    >
                      {item.year.slice(2)}
                    </span>
                    <time
                      dateTime={item.year}
                      className="ml-12 block font-[family-name:var(--font-cinzel)] text-2xl font-bold text-[var(--glitz-gold)] sm:ml-0"
                    >
                      {item.year}
                    </time>
                  </div>
                  <div className={cn("mt-2 sm:mt-0 sm:px-8", i % 2 === 1 && "sm:[direction:ltr]")}>
                    <GlassPanel liquid={false} className="ml-12 p-5 sm:ml-0">
                      <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                        {item.event}
                      </p>
                    </GlassPanel>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Behind-the-scenes storytelling */}
      <section className="v4-section bg-[var(--glitz-bg)]">
        <div className="brand-container">
          <ScrollReveal preset="reveal">
            <span className="v4-kicker mb-4">Behind the Scenes</span>
            <h2 className="v4-display">Our story in motion</h2>
            <p className="v4-standfirst mt-4 max-w-xl">
              A glimpse into the artistry behind every Nexyyra celebration — from first sketches to
              final guest arrival.
            </p>
          </ScrollReveal>
          <ScrollReveal preset="fade" delay={0.1} className="mt-10">
            <div className="relative mx-auto aspect-video max-w-4xl overflow-hidden rounded-[var(--v4-radius-xl)] border border-[var(--glitz-border)]">
              <BrandImage
                src={BRAND_IMAGES.hero.corporate}
                alt="Nexyyra Events behind the scenes production"
                fill
                sizes="80vw"
                className="opacity-85"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/25 to-transparent p-6 sm:p-10">
                <div className="max-w-xl">
                  <span className="v4-kicker mb-3 text-[var(--glitz-gold)]">Nexyyra Atelier</span>
                  <p className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-white sm:text-4xl">
                    Every celebration is rehearsed, refined, and delivered with quiet precision.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Why premium brands trust Nexyyra (replaces team section) */}
      <section className="v4-section v4-dune-glow bg-[var(--glitz-surface)]">
        <div className="brand-container">
          <ScrollReveal preset="reveal">
            <span className="v4-kicker mb-4">Why Nexyyra</span>
            <h2 className="v4-display max-w-3xl">
              Why India&apos;s Premium Brands <span className="v4-gold-text">Trust Nexyyra</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal preset="fade" delay={0.12}>
            <p className="v4-standfirst mt-5 max-w-2xl">
              A dozen years of flawless, discreet, cinematic celebrations — engineered in-house and
              delivered across 35+ cities for India&apos;s most discerning families and brands.
            </p>
          </ScrollReveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_PILLARS.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <ScrollReveal key={pillar.title} preset="scale" delay={i * 0.06}>
                  <GlassPanel className="group h-full p-6 transition-transform duration-500 hover:-translate-y-1.5">
                    <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--glitz-gold)]/35 bg-[var(--glitz-gold)]/10 text-[var(--glitz-gold)]">
                      <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <h3 className="font-[family-name:var(--font-cormorant)] text-xl font-semibold text-[var(--text-primary)]">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{pillar.copy}</p>
                  </GlassPanel>
                </ScrollReveal>
              );
            })}
          </div>

          <ScrollReveal preset="fade" delay={0.16} className="mt-14">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]">
              Trusted by visionaries
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {BRAND_TRUST.slice(0, 10).map((name) => (
                <span key={name} className="font-[family-name:var(--font-cormorant)] text-lg text-[var(--text-secondary)]">
                  {name}
                </span>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Achievements + press */}
      <section className="v4-section bg-[var(--glitz-bg)]">
        <div className="brand-container">
          <ScrollReveal preset="reveal">
            <span className="v4-kicker mb-4">Recognition</span>
            <h2 className="v4-display">Awards &amp; achievements</h2>
          </ScrollReveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {BRAND_AWARDS.map((a, i) => (
              <ScrollReveal key={a.title} preset="reveal" delay={i * 0.05}>
                <GlassPanel liquid={false} className="flex gap-4 p-6">
                  <Award className="h-8 w-8 shrink-0 text-[var(--glitz-gold)]" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold">{a.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {a.org} · {a.year}
                    </p>
                  </div>
                </GlassPanel>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal preset="fade" delay={0.1} className="mt-10">
            <div className="flex flex-wrap justify-center gap-3">
              {BRAND_MEDIA.map((m) => (
                <span
                  key={m}
                  className="rounded-full border border-[var(--glitz-border)] px-5 py-2 text-sm text-[var(--text-secondary)]"
                >
                  {m}
                </span>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="v4-section-lg v4-dune-glow bg-[var(--glitz-surface)]">
        <div className="brand-container">
          <ScrollReveal preset="scale">
            <GlassPanel glow className="mx-auto max-w-3xl px-8 py-14 text-center sm:px-14">
              <h2 className="v4-display">Let&apos;s craft your legend</h2>
              <p className="v4-standfirst mx-auto mt-4 max-w-lg">
                Schedule a private consultation — response within 24 hours, complimentary and without
                obligation.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <MagneticButton>
                  <BrandButton
                    href="/book-event"
                    onClick={() => analytics.ctaClick("book_consultation", "about_cta")}
                  >
                    Book Consultation
                  </BrandButton>
                </MagneticButton>
                <Link
                  href="/portfolio"
                  onClick={() => analytics.ctaClick("view_portfolio", "about_cta")}
                  className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--glitz-gold)] hover:underline"
                >
                  View Our Work
                </Link>
              </div>
            </GlassPanel>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
