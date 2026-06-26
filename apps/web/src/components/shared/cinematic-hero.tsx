"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useAdaptiveBackdrop } from "@/components/adaptive/adaptive-theme-provider";
import { LuxuryImage } from "@/components/shared/luxury-image";
import { gsap, registerGsap } from "@/lib/gsap/use-gsap";
import { cn } from "@/lib/utils";

interface CinematicHeroProps {
  label?: string;
  title: string;
  subtitle?: string;
  image?: string;
  children?: React.ReactNode;
  className?: string;
  size?: "default" | "full";
}

export function CinematicHero({
  label,
  title,
  subtitle,
  image,
  children,
  className,
  size = "default",
}: CinematicHeroProps) {
  const bgRef = useRef<HTMLDivElement>(null);
  const setAdaptiveRef = useAdaptiveBackdrop({
    imageSrc: image,
    region: "left-third",
    priority: 75,
    enabled: Boolean(image),
  });

  useEffect(() => {
    if (!bgRef.current) return;
    registerGsap();
    gsap.to(bgRef.current, {
      scale: 1.06,
      duration: 18,
      ease: "none",
      repeat: -1,
      yoyo: true,
    });
  }, []);

  return (
    <section
      ref={setAdaptiveRef}
      data-adaptive-backdrop=""
      className={cn(
        "lux-inner-hero relative flex items-end overflow-hidden border-b border-border/40",
        size === "full" ? "min-h-[70vh]" : "min-h-[50vh] pt-16",
        className
      )}
    >
      <div ref={bgRef} className="absolute inset-0 origin-center">
        {image ? (
          <LuxuryImage src={image} alt="" fill priority sizes="100vw" className="object-cover" aria-hidden />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#1a1a1a] to-[#0A0A0A]" />
        )}
        <div className="absolute inset-0" style={{ background: "var(--adaptive-scrim)" }} />
        <div className="absolute inset-0" style={{ background: "var(--adaptive-scrim-bottom)" }} />
        <div className="lux-inner-hero__aura" aria-hidden />
      </div>

      <div className="container-page relative z-10 pb-16 pt-32 sm:pb-20 sm:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          {label && (
            <span className="lux-label mb-4">
              {label}
            </span>
          )}
          <h1 className="lux-inner-hero__title">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--adaptive-muted)] sm:text-lg">
              {subtitle}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </motion.div>
      </div>
    </section>
  );
}
