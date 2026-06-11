"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { MessageCircle } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { BrandButton } from "@/brand/primitives/brand-button";
import { MagneticButton } from "@/components/effects/magnetic-button";
import { ScrollIndicator } from "@/components/effects/scroll-indicator";
import { HeroCinematicBackground } from "@/components/home/hero-cinematic-background";
import { HeroCinematicFx } from "@/components/home/hero-cinematic-fx";
import { HERO_CATEGORIES, HERO_FALLBACK, type HeroSlide } from "@/components/home/hero-carousel-data";
import { useAdaptiveBackdrop } from "@/components/adaptive/adaptive-theme-provider";
import { gsap, registerGsap } from "@/lib/gsap/use-gsap";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

const AUTO_MS = 5000;

const whatsappHref = `https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hello Glitz Events, I'd like to discuss an event.")}`;

const SUB_POINTS = [
  "Luxury Event Planning",
  "Wedding Management",
  "Corporate Events",
  "Brand Promotions",
];

const heroReveal = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.35 },
  },
};

const itemReveal = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function wrapIndex(i: number, len: number) {
  return ((i % len) + len) % len;
}

export function HeroPremium() {
  const reducedMotion = useReducedMotion();

  const [slides, setSlides] = useState<HeroSlide[]>(HERO_CATEGORIES);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [broken, setBroken] = useState<Record<number, true>>({});

  const headlineRef = useRef<HTMLHeadingElement>(null);
  const activeRef = useRef(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 24 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 24 });
  const bgX = useTransform(springX, (v) => v * 16);
  const bgY = useTransform(springY, (v) => v * 10);
  const fxX = useTransform(springX, (v) => v * 24);
  const fxY = useTransform(springY, (v) => v * 14);

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
        /* fallback */
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    registerGsap();
    const words = headlineRef.current?.querySelectorAll("[data-word]");
    if (!words?.length) return;
    gsap.from(words, {
      y: 64,
      opacity: 0,
      duration: 1,
      stagger: 0.06,
      ease: "power3.out",
      delay: 0.45,
    });
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setActive(wrapIndex(index, slides.length));
    },
    [slides.length]
  );

  useEffect(() => {
    if (reducedMotion || paused) return;
    const id = window.setInterval(() => goTo(activeRef.current + 1), AUTO_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion, paused, goTo, slides.length]);

  const onMouseMove = (e: MouseEvent<HTMLElement>) => {
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
      ref={setAdaptiveRef}
      data-adaptive-backdrop=""
      className="relative flex h-[100vh] min-h-[100dvh] flex-col overflow-hidden border-b border-[var(--glitz-border)] bg-[var(--glitz-bg)]"
      onMouseMove={onMouseMove}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      {/* Fullscreen background image */}
      <motion.div className="absolute inset-0 z-0" style={{ x: bgX, y: bgY }}>
        <HeroCinematicBackground slides={slides} active={active} broken={broken} onBroken={onBroken} />
      </motion.div>

      {/* Gold rays, lens flare, particles */}
      <motion.div className="absolute inset-0 z-[5]" style={{ x: fxX, y: fxY }}>
        <HeroCinematicFx active={active} />
      </motion.div>

      {/* Content */}
      <div className="brand-container relative z-20 flex flex-1 flex-col justify-center pt-20 pb-16 md:pt-24">
        <motion.div variants={heroReveal} initial="hidden" animate="visible" className="max-w-2xl">
          <motion.span variants={itemReveal} className="brand-label">
            Glitz Events & Promotions
          </motion.span>

          <motion.h1
            variants={itemReveal}
            ref={headlineRef}
            className="mt-4 font-[family-name:var(--font-playfair)] text-[clamp(2.35rem,6.5vw,4.5rem)] font-bold leading-[1.04] text-[var(--adaptive-text)] drop-shadow-[var(--adaptive-shadow)]"
          >
            {"Creating Extraordinary Experiences".split(" ").map((word, i) => (
              <span key={i} className="mr-[0.22em] inline-block overflow-hidden">
                <span data-word className="inline-block">
                  {word}
                </span>
              </span>
            ))}
          </motion.h1>

          <motion.ul
            variants={itemReveal}
            className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--adaptive-muted)] md:text-base"
          >
            {SUB_POINTS.map((point) => (
              <li key={point} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[var(--glitz-gold-metallic)]" />
                {point}
              </li>
            ))}
          </motion.ul>

          <motion.div variants={itemReveal} className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <MagneticButton>
              <BrandButton href="/book-event" variant="gold" className="min-w-[168px]">
                Book Event
              </BrandButton>
            </MagneticButton>
            <MagneticButton>
              <BrandButton href="/book-event" variant="outline" className="min-w-[168px]">
                Get Consultation
              </BrandButton>
            </MagneticButton>
            <MagneticButton>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] min-w-[168px] items-center justify-center gap-2 rounded-lg border border-emerald-600/30 bg-emerald-600/10 px-6 py-3 text-sm font-semibold tracking-wide text-[var(--adaptive-text)] transition-all hover:bg-emerald-600/18 hover:shadow-md"
              >
                <MessageCircle className="h-4 w-4 text-emerald-500" /> WhatsApp
              </a>
            </MagneticButton>
          </motion.div>

          <motion.div variants={itemReveal} className="mt-10 flex flex-wrap items-center gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--adaptive-accent)]">
              {slides[active]?.category}
            </span>
            <div className="flex gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
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
          </motion.div>
        </motion.div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
