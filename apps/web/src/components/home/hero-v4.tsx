"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { MessageCircle, Phone, Play, X } from "lucide-react";
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
import { HeroVideoBackground } from "@/components/home/hero-video-background";
import {
  HERO_SHOWREEL_VIDEO,
  HERO_VIDEO_INTERVAL_MS,
  HERO_VIDEO_SLIDES,
  type HeroVideoSlide,
} from "@/components/home/hero-video-data";
import { useAdaptiveBackdrop } from "@/components/adaptive/adaptive-theme-provider";
import { gsap, registerGsap } from "@/lib/gsap/use-gsap";
import { GSAP_EASE } from "@/lib/motion";
import { SITE_CONFIG } from "@/lib/constants";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const HeroCinematicFx = dynamic(
  () => import("@/components/home/hero-cinematic-fx").then((m) => m.HeroCinematicFx),
  { ssr: false }
);

const HeroWorldCards = dynamic(
  () => import("@/components/home/hero-world-cards").then((m) => m.HeroWorldCards),
  { ssr: false }
);

const SERVICE_TAGS = [
  "Luxury Weddings",
  "Destination Weddings",
  "Corporate Experiences",
  "Celebrity Events",
  "Brand Activations",
] as const;

const HERO_HEADLINES = [
  "Crafting Extraordinary Experiences For Extraordinary People",
  "Experience Architects For India's Finest Celebrations",
  "Designing Memories That Last A Lifetime",
] as const;

const HEADLINE_INTERVAL_MS = 6000;

const TRUST_METRICS = [
  { value: "12+", label: "Years Experience" },
  { value: "1000+", label: "Events" },
  { value: "500+", label: "Happy Clients" },
] as const;

const whatsappHref = `https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
  "Hello Nexyyra Events, I'd like to discuss an event."
)}`;
const telHref = `tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`;

function wrapIndex(i: number, len: number) {
  return ((i % len) + len) % len;
}

function ShowreelModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Nexyyra Events showreel"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-[var(--glitz-border)] bg-black shadow-[var(--v4-glow-gold)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
          aria-label="Close showreel"
        >
          <X className="h-5 w-5" />
        </button>
        <video
          autoPlay
          controls
          playsInline
          className="aspect-video w-full object-cover"
          poster={HERO_VIDEO_SLIDES[0]?.poster}
        >
          <source src={HERO_SHOWREEL_VIDEO} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}

/**
 * V4 cinematic hero — two-column layout with crossfading video backdrop,
 * adaptive contrast, floating world cards, and GSAP entrance choreography.
 */
export function HeroV4() {
  const reducedMotion = useReducedMotion();

  const [slides] = useState<HeroVideoSlide[]>(HERO_VIDEO_SLIDES);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [broken, setBroken] = useState<Record<number, true>>({});
  const [showreelOpen, setShowreelOpen] = useState(false);
  const [headlineIndex, setHeadlineIndex] = useState(0);

  const contentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeRef = useRef(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 24 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 24 });
  const bgX = useTransform(springX, (v) => v * 18);
  const bgY = useTransform(springY, (v) => v * 12);
  const fxX = useTransform(springX, (v) => v * 24);
  const fxY = useTransform(springY, (v) => v * 14);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    if (reducedMotion) return;
    registerGsap();
    const root = contentRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: GSAP_EASE.luxe } });
      tl.from(root.querySelector("[data-hero-label]"), { y: 16, opacity: 0, duration: 0.55 }, 0.2)
        .from(root.querySelector("[data-hero-headline]"), { yPercent: 110, duration: 0.95 }, 0.32)
        .from(root.querySelector("[data-hero-subhead]"), { y: 20, opacity: 0, duration: 0.7 }, 0.52)
        .from(root.querySelectorAll("[data-hero-tag]"), { y: 14, opacity: 0, duration: 0.45, stagger: 0.06 }, 0.68)
        .from(root.querySelectorAll("[data-hero-cta]"), { y: 18, opacity: 0, duration: 0.55, stagger: 0.08 }, 0.82)
        .from(root.querySelectorAll("[data-hero-metric]"), { y: 16, opacity: 0, duration: 0.5, stagger: 0.07 }, 0.95);
    }, contentRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const goTo = useCallback(
    (index: number) => setActive(wrapIndex(index, slides.length)),
    [slides.length]
  );

  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(
      () => setHeadlineIndex((i) => (i + 1) % HERO_HEADLINES.length),
      HEADLINE_INTERVAL_MS
    );
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || paused) return;
    const id = window.setInterval(() => goTo(activeRef.current + 1), HERO_VIDEO_INTERVAL_MS);
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
  const activePoster = broken[active] ? slides[0]?.poster : activeSlide?.poster ?? slides[0]?.poster;

  const setAdaptiveRef = useAdaptiveBackdrop({
    imageSrc: activePoster,
    videoRef,
    region: "left-third",
    priority: 100,
  });

  return (
    <>
      <section
        id="welcome"
        ref={setAdaptiveRef}
        data-adaptive-backdrop=""
        className="relative flex min-h-[100svh] flex-col overflow-hidden border-b border-[var(--glitz-border)] bg-[var(--v5-obsidian,var(--glitz-bg))] v5-dune-glow"
        onMouseMove={onMouseMove}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => {
          setPaused(false);
          mouseX.set(0);
          mouseY.set(0);
        }}
      >
        <motion.div className="absolute inset-0 z-0" style={{ x: bgX, y: bgY }}>
          <HeroVideoBackground
            slides={slides}
            active={active}
            broken={broken}
            onBroken={onBroken}
            videoRef={videoRef}
          />
        </motion.div>

        <motion.div className="absolute inset-0 z-[5]" style={{ x: fxX, y: fxY }}>
          <HeroCinematicFx active={active} mouseX={springX} mouseY={springY} />
        </motion.div>

        <div className="brand-container relative z-20 flex flex-1 items-center py-24 md:py-28 lg:py-20">
          <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            {/* Left — purpose & conversion */}
            <div ref={contentRef} className="max-w-xl">
              <span
                data-hero-label
                className="brand-label mb-2 block text-[var(--adaptive-accent,var(--glitz-gold))]"
              >
                NEXYYRA EVENTS
              </span>
              <span className="mb-4 block text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--adaptive-muted)]">
                The Next Era of Celebrations
              </span>

              <h1
                data-hero-headline
                className="overflow-hidden font-[family-name:var(--font-playfair)] text-[clamp(2.25rem,5.8vw,3.75rem)] font-bold leading-[1.06] text-[var(--adaptive-text)] drop-shadow-[var(--adaptive-shadow)]"
              >
                <motion.span
                  key={headlineIndex}
                  initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="block"
                >
                  {HERO_HEADLINES[headlineIndex]}
                </motion.span>
              </h1>

              <p
                data-hero-subhead
                className="v5-standfirst v4-standfirst mt-5 max-w-lg text-[var(--adaptive-muted)]"
              >
                Experience architects, celebration designers, and memory creators — we craft
                extraordinary weddings, corporate experiences, celebrity events, and destination
                celebrations for India&apos;s most discerning hosts.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {SERVICE_TAGS.map((tag) => (
                  <span
                    key={tag}
                    data-hero-tag
                    className="rounded-full border border-[var(--adaptive-border,var(--glitz-border))]/50 bg-[var(--adaptive-surface,var(--glitz-glass))]/40 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--adaptive-muted)] backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <div data-hero-cta>
                  <MagneticButton>
                    <BrandButton
                      href="/book-event"
                      variant="gold"
                      className="min-w-[190px]"
                      onClick={() => analytics.ctaClick("book_consultation", "hero")}
                    >
                      Book Consultation
                    </BrandButton>
                  </MagneticButton>
                </div>
                <div data-hero-cta>
                  <MagneticButton>
                    <BrandButton
                      href="/services"
                      variant="outline"
                      className="min-w-[190px] border-[var(--adaptive-border,var(--glitz-border))]/60 text-[var(--adaptive-text)]"
                      onClick={() => analytics.ctaClick("explore_experiences", "hero")}
                    >
                      Explore Experiences
                    </BrandButton>
                  </MagneticButton>
                </div>
                <div data-hero-cta>
                  <MagneticButton>
                    <button
                      type="button"
                      onClick={() => {
                        analytics.ctaClick("watch_showreel", "hero");
                        setShowreelOpen(true);
                      }}
                      className={cn(
                        "inline-flex min-h-[48px] min-w-[190px] items-center justify-center gap-2 rounded-lg border border-[var(--gold)]/45 bg-[var(--glitz-glass)] px-8 py-3 text-sm font-semibold tracking-wide text-[var(--adaptive-text)] backdrop-blur-sm transition-all hover:border-[var(--gold)]/70 hover:bg-[var(--gold)]/8 hover:shadow-[var(--glitz-glow)]"
                      )}
                    >
                      <Play className="h-4 w-4 text-[var(--adaptive-accent,var(--glitz-gold))]" aria-hidden />
                      Watch Showreel
                    </button>
                  </MagneticButton>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[var(--adaptive-border,var(--glitz-border))]/30 pt-6">
                {TRUST_METRICS.map((m) => (
                  <div key={m.label} data-hero-metric className="flex items-baseline gap-2">
                    <span className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[var(--adaptive-accent)]">
                      {m.value}
                    </span>
                    <span className="text-xs uppercase tracking-[0.16em] text-[var(--adaptive-muted)]">
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-[var(--adaptive-muted)]">
                <a
                  href={telHref}
                  onClick={() => analytics.ctaClick("call", "hero")}
                  className="inline-flex items-center gap-2 transition-colors hover:text-[var(--adaptive-accent)]"
                >
                  <Phone className="h-4 w-4 text-[var(--adaptive-accent)]" aria-hidden />
                  {SITE_CONFIG.phone}
                </a>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => analytics.ctaClick("whatsapp", "hero")}
                  className="inline-flex items-center gap-2 transition-colors hover:text-emerald-500"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-500" aria-hidden />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Right — floating world cards */}
            <HeroWorldCards mouseX={springX} mouseY={springY} className="lg:justify-self-end" />
          </div>
        </div>

        {/* Category indicator — quiet, bottom-right */}
        <div className="brand-container absolute inset-x-0 bottom-10 z-20 hidden md:block">
          <div className="flex items-center justify-end gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--adaptive-accent)]">
              {activeSlide?.category}
            </span>
            <div className="flex gap-1.5" role="tablist" aria-label="Hero video categories">
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

      <ShowreelModal open={showreelOpen} onClose={() => setShowreelOpen(false)} />
    </>
  );
}
