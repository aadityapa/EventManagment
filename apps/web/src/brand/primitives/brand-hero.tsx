"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useAdaptiveBackdrop } from "@/components/adaptive/adaptive-theme-provider";
import dynamic from "next/dynamic";
import { BrandImage } from "./brand-image";
import { ComingSoonOverlay } from "@/components/media/coming-soon-overlay";
import { isComingSoonImage } from "@/lib/media/placeholders";
import { gsap, registerGsap } from "@/lib/gsap/use-gsap";

const HeroThreeCanvas = dynamic(
  () => import("@/components/three/hero-three-canvas").then((m) => m.HeroThreeCanvas),
  { ssr: false, loading: () => null }
);

interface BrandHeroProps {
  label?: string;
  title: string;
  subtitle?: string;
  image?: string;
  full?: boolean;
  threeD?: boolean;
  backgroundLayers?: ReactNode;
  decoration?: ReactNode;
  scrollIndicator?: ReactNode;
  children?: ReactNode;
}

export function BrandHero({ label, title, subtitle, image, full = false, threeD = false, backgroundLayers, decoration, scrollIndicator, children }: BrandHeroProps) {
  const bgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const setAdaptiveRef = useAdaptiveBackdrop({
    imageSrc: image,
    region: "left-third",
    priority: 80,
    enabled: Boolean(image),
  });

  useEffect(() => {
    registerGsap();
    if (bgRef.current) {
      gsap.to(bgRef.current, { scale: 1.07, duration: 22, ease: "none", repeat: -1, yoyo: true });
    }
    const words = titleRef.current?.querySelectorAll("[data-word]");
    if (words?.length) {
      gsap.from(words, { y: 60, opacity: 0, duration: 1, stagger: 0.05, ease: "power3.out", delay: 0.2 });
    }
  }, [title]);

  const words = title.split(" ");
  const comingSoon = isComingSoonImage(image);

  return (
    <section
      ref={setAdaptiveRef}
      data-adaptive-backdrop=""
      className={`relative overflow-hidden border-b border-[var(--glitz-border)] ${full ? "min-h-[100dvh]" : "min-h-[55vh] pt-16"}`}
    >
      <div ref={bgRef} className="absolute inset-0 origin-center">
        {image ? (
          <BrandImage src={image} alt="" fill priority sizes="100vw" aria-hidden />
        ) : null}
        {comingSoon ? <ComingSoonOverlay className="z-[1]" /> : null}
        <div className="absolute inset-0" style={{ background: "var(--adaptive-scrim)" }} />
        <div className="absolute inset-0" style={{ background: "var(--adaptive-scrim-bottom)" }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.07),transparent_65%)]" />
        {backgroundLayers}
      </div>

      {threeD && full && <HeroThreeCanvas />}
      {decoration}
      <div className={`brand-container relative z-10 flex flex-col justify-end ${full ? "min-h-[100dvh] pb-20 pt-28" : "pb-16 pt-32"}`}>
        {label && <span className="brand-label mb-4">{label}</span>}
        <h1 ref={titleRef} className="brand-display max-w-5xl text-[clamp(2.25rem,6vw,4.25rem)] font-bold leading-[1.08] text-[var(--adaptive-text)]">
          {words.map((w, i) => (
            <span key={i} className="mr-[0.2em] inline-block overflow-hidden">
              <span data-word className="inline-block">{w}</span>
            </span>
          ))}
        </h1>
        {subtitle && <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--adaptive-muted)] sm:text-lg">{subtitle}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
      {scrollIndicator}
    </section>
  );
}

export function BrandPageHero(props: Omit<BrandHeroProps, "full">) {
  return <BrandHero {...props} full={false} />;
}
