"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { MessageCircle, Phone } from "lucide-react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { BrandButton } from "@/brand/primitives/brand-button";
import { MagneticButton } from "@/components/effects/magnetic-button";
import { ScrollIndicator } from "@/components/effects/scroll-indicator";
import { HeroCinematicBackground } from "@/components/home/hero-cinematic-background";
import { HeroCinematicFx } from "@/components/home/hero-cinematic-fx";
import { HERO_CATEGORIES, HERO_FALLBACK, type HeroSlide } from "@/components/home/hero-carousel-data";
import { useAdaptiveBackdrop } from "@/components/adaptive/adaptive-theme-provider";
import { gsap, registerGsap } from "@/lib/gsap/use-gsap";
import { GSAP_EASE } from "@/lib/motion";
import { SITE_CONFIG } from "@/lib/constants";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const AUTO_MS = 6000;
const HEADLINE = ["Creating", "Extraordinary", "Experiences"];

const whatsappHref = `https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
  "Hello Glitz Events, I'd like to discuss an event."
)}`;
const telHref = `tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`;

const PROOF = [
  { value: "1,000+", label: "Events Delivered" },
  { value: "4.9★", label: "Client Rating" },
  { value: "35+", label: "Cities Served" },
];

function wrapIndex(i: number, len: number) {
  return ((i % len) + len) % len;
}

/**
 * V4 cinematic hero — the proof of the new design + motion system.
 * One headline, one primary CTA, liquid-glass content panel, gold particle FX,
 * mouse-driven parallax depth, GSAP word-mask reveal, adaptive AAA text.
 */
export function HeroV4() {
  const reducedMotion = useReducedMotion();

  const [slides, setSlides] = useState<HeroSlide[]>(HERO_CATEGORIES);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [broken, setBroken] = useState<Record<number, true>>({});

  const headlineRef = useRef<HTMLHeadingElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 24 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 24 });
  const bgX = useTransform(springX, (v) => v * 18);
  const bgY = useTransform(springY, (v) => v * 12);
  const fxX = useTransform(springX, (v) => v * 28);
  const fxY = useTransform(springY, (v) => v * 16);
  const panelX = useTransform(springX, (v) => v * -8);
  const panelY = useTransform(springY, (v) => v * -5);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch("/api/hero-images");
        const json = (await res.json()) as { slides?: HeroSlide[] };
        if (!ignore && Array.isArray(json.slides) && json.slides.length >= 4) {
          setSlides(json.slides);
        }
      } catch {
        /* fallback to bundled categories */
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  // GSAP cinematic reveal: words rise from mask, then panel meta fades up.
  useEffect(() => {
    if (reducedMotion) return;
    registerGsap();
    const words = headlineRef.current?.querySelectorAll("[data-word]");
    const meta = panelRef.current?.querySelectorAll("[data-reveal]");
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: GSAP_EASE.luxe } });
      if (words?.length) {
        tl.from(words, { yPercent: 115, duration: 1, stagger: 0.09 }, 0.35);
      }
      if (meta?.length) {
        tl.from(meta, { y: 24, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.7);
      }
    });
    return () => ctx.revert();
  }, [reducedMotion]);

  const goTo = useCallback(
    (index: number) => setActive(wrapIndex(index, slides.length)),
    [slides.length]
  );

  useEffect(() => {
    if (reducedMotion || paused) return;
    const id = window.setInterval(() => goTo(activeRef.current + 1), AUTO_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion, paused, goTo, slides.length]);

  const onMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  };

  const onBroken = (index: number) => {
    setBroken((b) => (b[index] ? b : { ...b, [index]: true }));
  };

  const activeSlide = slides[active];
  const activeSrc = broken[active] ? HERO_FALLBACK : activeSlide?.src ?? HERO_FALLBACK;
  const setAdaptiveRef = useAdaptiveBackdrop({
    imageSrc: activeSrc,
    region: "left-third",
    priority: 100,
  });

  return (
    <section
      id="welcome"
      ref={setAdaptiveRef}
      data-adaptive-backdrop=""
      className="relative flex h-[100svh] min-h-[100dvh] flex-col overflow-hidden border-b border-[var(--glitz-border)] bg-[var(--v5-obsidian,var(--glitz-bg))] v5-dune-glow"
      onMouseMove={onMouseMove}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      {/* Full-bleed art-directed frame */}
      <motion.div className="absolute inset-0 z-0" style={{ x: bgX, y: bgY }}>
        <HeroCinematicBackground slides={slides} active={active} broken={broken} onBroken={onBroken} />
      </motion.div>

      {/* Gold rays, lens flare, particles */}
      <motion.div className="absolute inset-0 z-[5]" style={{ x: fxX, y: fxY }}>
        <HeroCinematicFx active={active} mouseX={springX} mouseY={springY} />
      </motion.div>

      {/* Content */}
      <div className="brand-container relative z-20 flex flex-1 flex-col justify-center pt-24 pb-20">
        <motion.div
          ref={panelRef}
          style={{ x: panelX, y: panelY }}
          className="v5-glass-liquid v4-glass-liquid max-w-3xl p-7 sm:p-10 md:p-12"
        >
          <span data-reveal className="v5-kicker v4-kicker mb-5">
            Architects of Extraordinary Experiences
          </span>

          <h1
            ref={headlineRef}
            className="v5-hero-display v4-hero-display text-[var(--adaptive-text)] drop-shadow-[var(--adaptive-shadow)]"
          >
            {HEADLINE.map((word, i) => (
              <span key={word} className={cn("block overflow-hidden", i === 1 && "v5-gold-text v4-gold-text")}>
                <span data-word className="inline-block will-change-transform">
                  {word}
                </span>
              </span>
            ))}
          </h1>

          <p data-reveal className="v5-standfirst v4-standfirst mt-6 max-w-xl text-[var(--adaptive-muted)]">
            Welcome to a universe of cinematic weddings, corporate galas, and destination
            celebrations — designed with obsessive precision since 2012.
          </p>

          <div data-reveal className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <MagneticButton>
              <BrandButton
                href="/book-event"
                variant="gold"
                className="min-w-[180px]"
                onClick={() => analytics.ctaClick("book_event", "hero")}
              >
                Begin Your Commission
              </BrandButton>
            </MagneticButton>
            <MagneticButton>
              <BrandButton
                href="/portfolio"
                variant="outline"
                className="min-w-[160px]"
                onClick={() => analytics.ctaClick("view_portfolio", "hero")}
              >
                Enter the Archive
              </BrandButton>
            </MagneticButton>
          </div>

          <div data-reveal className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
            {PROOF.map((p) => (
              <div key={p.label} className="flex items-baseline gap-2">
                <span className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[var(--adaptive-accent)]">
                  {p.value}
                </span>
                <span className="text-xs uppercase tracking-[0.16em] text-[var(--adaptive-muted)]">
                  {p.label}
                </span>
              </div>
            ))}
          </div>

          <div data-reveal className="mt-7 flex flex-wrap items-center gap-5 text-sm text-[var(--adaptive-muted)]">
            <a
              href={telHref}
              onClick={() => analytics.ctaClick("call", "hero")}
              className="inline-flex items-center gap-2 transition-colors hover:text-[var(--adaptive-accent)]"
            >
              <Phone className="h-4 w-4 text-[var(--adaptive-accent)]" aria-hidden="true" />
              {SITE_CONFIG.phone}
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => analytics.ctaClick("whatsapp", "hero")}
              className="inline-flex items-center gap-2 transition-colors hover:text-emerald-500"
            >
              <MessageCircle className="h-4 w-4 text-emerald-500" aria-hidden="true" />
              WhatsApp
            </a>
          </div>
        </motion.div>
      </div>

      {/* Frame switcher — quiet, bottom-right */}
      <div className="brand-container absolute inset-x-0 bottom-10 z-20 hidden md:block">
        <div className="flex items-center justify-end gap-4">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--adaptive-accent)]">
            {activeSlide?.category}
          </span>
          <div className="flex gap-1.5" role="tablist" aria-label="Hero image categories">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-current={i === active ? "true" : undefined}
                aria-label={`Show ${slides[i]?.category}`}
                onClick={() => goTo(i)}
                className={cn(
                  "h-1 rounded-full transition-all duration-500",
                  i === active
                    ? "w-10 bg-[var(--adaptive-accent)] shadow-[var(--adaptive-shadow)]"
                    : "w-1.5 bg-[var(--adaptive-text)]/25 hover:bg-[var(--adaptive-accent)]/60"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
