"use client";

import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { registerGsap } from "@/lib/gsap/use-gsap";
import { GSAP_EASE } from "@/lib/motion";
import { trackEvent } from "@/lib/analytics";
import { HERO_VIDEO_SLIDES } from "@/components/home/hero-video-data";

export const LOADER_STORAGE_KEY = "glitz-v5-premiere-seen";
const LEGACY_LOADER_KEY = "glitz-loader-seen";

const MONTAGE_FRAMES = HERO_VIDEO_SLIDES.map((s) => s.poster);

export function hasSeenPremiere() {
  if (typeof window === "undefined") return false;
  return (
    sessionStorage.getItem(LOADER_STORAGE_KEY) === "1" ||
    sessionStorage.getItem(LEGACY_LOADER_KEY) === "1"
  );
}

export function useLoaderSound() {
  return useCallback(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("glitz:loader-sound-ready"));
    }
  }, []);
}

const PARTICLE_COUNT = 24;

function createParticles(container: HTMLElement) {
  const fragments: HTMLDivElement[] = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement("div");
    const size = 2 + Math.random() * 3;
    p.className = "pointer-events-none absolute rounded-full";
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.background = `radial-gradient(circle, rgba(212,175,55,${0.35 + Math.random() * 0.45}), transparent)`;
    p.style.left = `${Math.random() * 100}%`;
    p.style.top = `${Math.random() * 100}%`;
    container.appendChild(p);
    fragments.push(p);
  }
  return fragments;
}

type Props = {
  onComplete: () => void;
  onSkip?: () => void;
};

/** Experience-first premiere — cinematic montage, no logo hero. */
export function UniverseLoader({ onComplete, onSkip }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const montageRef = useRef<HTMLDivElement>(null);
  const montageImgRef = useRef<HTMLImageElement>(null);
  const categoryRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const playLoaderSound = useLoaderSound();
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const finish = useCallback(() => {
    sessionStorage.setItem(LOADER_STORAGE_KEY, "1");
    sessionStorage.setItem(LEGACY_LOADER_KEY, "1");
    trackEvent("premiere_complete");
    onComplete();
  }, [onComplete]);

  const skipToCurtain = useCallback(() => {
    trackEvent("premiere_skip");
    onSkip?.();
    tlRef.current?.progress(0.88, false);
    tlRef.current?.play();
  }, [onSkip]);

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    const montage = montageRef.current;
    const montageImg = montageImgRef.current;
    const category = categoryRef.current;
    const tagline = taglineRef.current;
    const curtain = curtainRef.current;
    const particlesEl = particlesRef.current;
    if (!root || !montage || !montageImg || !category || !tagline || !curtain || !particlesEl) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      sessionStorage.setItem(LOADER_STORAGE_KEY, "1");
      onComplete();
      return;
    }

    MONTAGE_FRAMES.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });

    const particles = createParticles(particlesEl);
    const words = tagline.querySelectorAll("[data-word]");

    gsap.set([montage, tagline, curtain], { opacity: 0 });
    gsap.set(curtain, { yPercent: 0 });
    gsap.set(montageImg, { opacity: 0, scale: 1.08 });
    gsap.set(category, { opacity: 0, y: 12 });
    gsap.set(particles, { opacity: 0 });

    const tl = gsap.timeline({ onComplete: finish });
    tlRef.current = tl;

    // Gold dust + fade in
    tl.to(particles, { opacity: 0.55, duration: 0.6, stagger: 0.02, ease: GSAP_EASE.silk }, 0)
      .to(montage, { opacity: 1, duration: 0.5, ease: GSAP_EASE.silk }, 0.2)
      .call(() => playLoaderSound(), undefined, 0.3);

    // Cinematic montage — six event worlds
    MONTAGE_FRAMES.forEach((src, i) => {
      const t = 0.35 + i * 0.55;
      const slide = HERO_VIDEO_SLIDES[i];
      tl.call(() => {
        montageImg.src = src;
        if (category && slide) category.textContent = slide.category;
      }, undefined, t)
        .fromTo(
          montageImg,
          { opacity: 0, scale: 1.08 },
          { opacity: 1, scale: 1, duration: 0.45, ease: GSAP_EASE.luxe },
          t
        )
        .fromTo(category, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, ease: GSAP_EASE.silk }, t + 0.1)
        .to(montageImg, { opacity: 0, scale: 1.04, duration: 0.4, ease: GSAP_EASE.silk }, t + 0.42)
        .to(category, { opacity: 0, duration: 0.25, ease: GSAP_EASE.silk }, t + 0.45);
    });

    // Tagline — emotion, not logo
    tl.to(montage, { opacity: 0, duration: 0.35 }, 3.55)
      .to(tagline, { opacity: 1, duration: 0.45, ease: GSAP_EASE.luxe }, 3.65)
      .from(words, { yPercent: 110, opacity: 0, duration: 0.75, stagger: 0.09, ease: GSAP_EASE.luxe }, 3.75);

    // Curtain rise
    tl.to(tagline, { opacity: 0, duration: 0.3 }, 5.1)
      .to(curtain, { opacity: 1, duration: 0.2 }, 5.2)
      .to(curtain, { yPercent: -100, duration: 1.15, ease: GSAP_EASE.drama }, 5.3)
      .to(root, { opacity: 0, duration: 0.45, ease: GSAP_EASE.silk }, 6.2);

    return () => {
      tl.kill();
      particles.forEach((p) => p.remove());
    };
  }, [finish, onComplete, playLoaderSound]);

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-label="Cinematic introduction"
      aria-live="polite"
      aria-busy="true"
      className="fixed inset-0 z-[100] bg-black"
    >
      <p className="sr-only">Welcome to Nexyyra Events — The Next Era of Celebrations</p>

      <button
        type="button"
        onClick={skipToCurtain}
        className="absolute right-6 top-6 z-[110] rounded-full border border-[var(--v5-gold-metallic)]/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--v5-gold-champagne)] transition-colors hover:border-[var(--v5-gold-luxury)] hover:text-[var(--v5-gold-luxury)]"
      >
        Skip
      </button>

      <div ref={particlesRef} className="pointer-events-none absolute inset-0 z-[1]" />

      <div ref={montageRef} className="absolute inset-0 z-[2] opacity-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={montageImgRef}
          alt=""
          className="h-full w-full object-cover"
          style={{ filter: "brightness(0.62) saturate(1.12) contrast(1.04)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/40" />
        <p
          ref={categoryRef}
          className="absolute bottom-[28%] left-0 right-0 text-center text-xs font-semibold uppercase tracking-[0.32em] text-[var(--v5-gold-champagne)]"
        />
      </div>

      <div ref={taglineRef} className="absolute inset-0 z-[3] flex flex-col items-center justify-center px-6 text-center opacity-0">
        <p className="v5-kicker mb-5 text-[var(--v5-gold-champagne)]">Nexyyra Events</p>
        <h2 className="v5-display max-w-3xl text-[var(--v5-champagne,#F7F3EB)]">
          {["The Next Era of", "Celebrations"].map((line) => (
            <span key={line} className="block overflow-hidden py-1">
              <span data-word className="inline-block">
                {line}
              </span>
            </span>
          ))}
        </h2>
      </div>

      <div
        ref={curtainRef}
        className="pointer-events-none absolute inset-0 z-[105] bg-[var(--v5-obsidian,#050505)] opacity-0"
      >
        <div className="v5-hairline absolute inset-x-0 top-0" />
      </div>
    </div>
  );
}

export const LuxuryLoader = UniverseLoader;
