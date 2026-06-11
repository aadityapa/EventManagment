"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { MessageCircle } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { BrandButton } from "@/brand/primitives/brand-button";
import { MagneticButton } from "@/components/effects/magnetic-button";
import { ScrollIndicator } from "@/components/effects/scroll-indicator";
import { HeroCinematicBackground } from "@/components/home/hero-cinematic-background";
import { HeroCinematicFx } from "@/components/home/hero-cinematic-fx";
import { HERO_CATEGORIES, type HeroSlide } from "@/components/home/hero-carousel-data";
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
    transition: { staggerChildren: 0.1, delayChildren: 0.4 },
  },
};

const itemReveal = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function wrapIndex(i: number, len: number) {
  return ((i % len) + len) % len;
}

export function HeroPremium() {
  const reducedMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  const [slides, setSlides] = useState<HeroSlide[]>(HERO_CATEGORIES);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [broken, setBroken] = useState<Record<number, true>>({});

  const headlineRef = useRef<HTMLHeadingElement>(null);
  const activeRef = useRef(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 55, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 55, damping: 22 });
  const bgX = useTransform(springX, (v) => v * 22);
  const bgY = useTransform(springY, (v) => v * 14);
  const fxX = useTransform(springX, (v) => v * 32);
  const fxY = useTransform(springY, (v) => v * 20);

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
      y: 80,
      opacity: 0,
      duration: 1.1,
      stagger: 0.07,
      ease: "power3.out",
      delay: 0.5,
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

  const textColor = isLight ? "text-[#1A1400]" : "text-white";
  const mutedColor = isLight ? "text-[#4A4030]/80" : "text-white/75";
  const goldAccent = "text-[#D4AF37]";

  return (
    <section
      className={cn(
        "relative flex h-[100vh] min-h-[100dvh] flex-col overflow-hidden border-b",
        isLight ? "border-[#E8DCC5] bg-[#FDFBF5]" : "border-[#D4AF37]/10 bg-[#050505]"
      )}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      {/* Layer 1 — fullscreen background image */}
      <motion.div className="absolute inset-0 z-0" style={{ x: bgX, y: bgY }}>
        <HeroCinematicBackground
          slides={slides}
          active={active}
          broken={broken}
          onBroken={onBroken}
          isLight={isLight}
        />
      </motion.div>

      {/* Layer 2 — gold glow, particles, fog */}
      <motion.div className="absolute inset-0 z-[5]" style={{ x: fxX, y: fxY }}>
        <HeroCinematicFx isLight={isLight} active={active} />
      </motion.div>

      {/* Layer 3 — content */}
      <div className="brand-container relative z-20 flex flex-1 flex-col justify-center pt-24 pb-20 lg:pt-28">
        <motion.div
          variants={heroReveal}
          initial="hidden"
          animate="visible"
          className="max-w-2xl [transform:translateZ(60px)]"
        >
          <motion.span variants={itemReveal} className={cn("brand-label", goldAccent)}>
            Glitz Events & Promotions
          </motion.span>

          <motion.h1
            variants={itemReveal}
            ref={headlineRef}
            className={cn(
              "mt-5 font-[family-name:var(--font-playfair)] text-[clamp(2.25rem,6vw,4.25rem)] font-bold leading-[1.05]",
              textColor
            )}
          >
            {"Creating Extraordinary Experiences".split(" ").map((word, i) => (
              <span key={i} className="mr-[0.22em] inline-block overflow-hidden">
                <span data-word className="inline-block">
                  {word}
                </span>
              </span>
            ))}
          </motion.h1>

          <motion.ul variants={itemReveal} className={cn("mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm md:text-base", mutedColor)}>
            {SUB_POINTS.map((point) => (
              <li key={point} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#D4AF37]" />
                {point}
              </li>
            ))}
          </motion.ul>

          <motion.div variants={itemReveal} className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <MagneticButton>
              <BrandButton href="/book-event" className="min-w-[170px] bg-[#D4AF37] text-[#050505] hover:bg-[#F5D76E]">
                Book Event
              </BrandButton>
            </MagneticButton>
            <MagneticButton>
              <BrandButton
                href="/book-event"
                variant="outline"
                className={cn(
                  "min-w-[170px]",
                  isLight ? "border-[#D4AF37]/50 text-[#1A1400] hover:bg-[#D4AF37]/10" : "border-[#D4AF37]/40"
                )}
              >
                Get Consultation
              </BrandButton>
            </MagneticButton>
            <MagneticButton>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] min-w-[170px] items-center justify-center gap-2 rounded-lg border border-[#25D366]/40 bg-[#25D366]/10 px-6 py-3 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-[#25D366]/20"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </MagneticButton>
          </motion.div>

          {/* Category tag + slide progress */}
          <motion.div variants={itemReveal} className="mt-10 flex items-center gap-4">
            <span className={cn("text-xs font-semibold uppercase tracking-[0.25em]", goldAccent)}>
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
                    i === active ? "w-10 bg-[#D4AF37]" : "w-1.5 bg-white/30 hover:bg-[#F5D76E]/60"
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
