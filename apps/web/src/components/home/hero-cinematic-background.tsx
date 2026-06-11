"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap, registerGsap } from "@/lib/gsap/use-gsap";
import { cn } from "@/lib/utils";
import { HERO_FALLBACK, type HeroSlide } from "./hero-carousel-data";

type Props = {
  slides: HeroSlide[];
  active: number;
  broken: Record<number, true>;
  onBroken: (index: number) => void;
  isLight: boolean;
};

export function HeroCinematicBackground({
  slides,
  active,
  broken,
  onBroken,
  isLight,
}: Props) {
  const zoomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const el = zoomRef.current;
    if (!el) return;
    gsap.killTweensOf(el);
    gsap.fromTo(el, { scale: 1.04 }, { scale: 1.12, duration: 5, ease: "none" });
  }, [active]);

  const slide = slides[active];
  const src = broken[active] ? HERO_FALLBACK : slide?.src ?? HERO_FALLBACK;

  return (
    <div className="absolute inset-0 overflow-hidden [transform-style:preserve-3d]">
      <AnimatePresence mode="sync">
        <motion.div
          key={active}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div ref={zoomRef} className="absolute inset-0 will-change-transform">
            <Image
              src={src}
              alt={slide?.alt ?? "Luxury event"}
              fill
              priority={active === 0}
              loading={active === 0 ? "eager" : "lazy"}
              sizes="100vw"
              className="object-cover object-center"
              unoptimized
              referrerPolicy="no-referrer"
              onError={() => onBroken(active)}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Cinematic overlays */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          isLight
            ? "bg-gradient-to-r from-[#FDFBF5]/92 via-[#F7F3EB]/55 to-[#F7F3EB]/20"
            : "bg-gradient-to-r from-[#050505]/95 via-[#050505]/65 to-[#050505]/25"
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          isLight
            ? "bg-gradient-to-t from-[#F7F3EB]/90 via-transparent to-[#FDFBF5]/30"
            : "bg-gradient-to-t from-[#050505]/90 via-[#0A0A0A]/30 to-transparent"
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          isLight ? "bg-[radial-gradient(ellipse_at_center,transparent_40%,#E8DCC5/50_100%)]" : "bg-[radial-gradient(ellipse_at_center,transparent_35%,#050505/80_100%)]"
        )}
      />

      {/* Soft fog */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-30 mix-blend-soft-light blur-3xl",
          isLight ? "bg-[#E8DCC5]/40" : "bg-[#121212]/60"
        )}
      />
    </div>
  );
}
