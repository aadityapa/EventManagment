"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap, registerGsap } from "@/lib/gsap/use-gsap";
import { HERO_FALLBACK, type HeroSlide } from "./hero-carousel-data";

type Props = {
  slides: HeroSlide[];
  active: number;
  broken: Record<number, true>;
  onBroken: (index: number) => void;
};

export function HeroCinematicBackground({ slides, active, broken, onBroken }: Props) {
  const zoomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const el = zoomRef.current;
    if (!el) return;
    gsap.killTweensOf(el);
    gsap.fromTo(el, { scale: 1.02 }, { scale: 1.08, duration: 5, ease: "none" });
  }, [active]);

  const slide = slides[active];
  const src = broken[active] ? HERO_FALLBACK : slide?.src ?? HERO_FALLBACK;

  return (
    <div className="absolute inset-0 overflow-hidden bg-[var(--glitz-bg)]">
      <AnimatePresence mode="sync">
        <motion.div
          key={active}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div ref={zoomRef} className="absolute inset-[-2%] will-change-transform">
            <Image
              src={src}
              alt={slide?.alt ?? "Luxury event"}
              fill
              priority={active === 0}
              loading={active === 0 ? "eager" : "lazy"}
              sizes="100vw"
              className="object-cover object-center brightness-[1.02] contrast-[1.04] saturate-[1.06]"
              unoptimized
              referrerPolicy="no-referrer"
              onError={() => onBroken(active)}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Left text scrim only — max ~35% opacity, image stays visible */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--glitz-hero-scrim)" }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--glitz-hero-bottom)" }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{ background: "radial-gradient(ellipse at 70% 40%, transparent 52%, var(--adaptive-overlay) 100%)" }}
      />
    </div>
  );
}
