"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { registerGsap } from "@/lib/gsap/use-gsap";
import { GSAP_EASE } from "@/lib/motion";
import { trackEvent } from "@/lib/analytics";
import { HERO_CATEGORIES } from "@/components/home/hero-carousel-data";

export const LOADER_STORAGE_KEY = "glitz-v5-premiere-seen";
const LEGACY_LOADER_KEY = "glitz-loader-seen";

/** Preloaded montage frames — wedding, corporate, destination, culture */
const MONTAGE_FRAMES = [
  HERO_CATEGORIES[0]?.src,
  HERO_CATEGORIES[1]?.src,
  HERO_CATEGORIES[6]?.src,
  HERO_CATEGORIES[3]?.src,
].filter(Boolean) as string[];

export function hasSeenPremiere() {
  if (typeof window === "undefined") return false;
  return (
    sessionStorage.getItem(LOADER_STORAGE_KEY) === "1" ||
    sessionStorage.getItem(LEGACY_LOADER_KEY) === "1"
  );
}

/** Hook for optional cinematic audio — wire when assets are ready. */
export function useLoaderSound() {
  return useCallback(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("glitz:loader-sound-ready"));
    }
  }, []);
}

const PARTICLE_COUNT = 18;

function createParticles(container: HTMLElement) {
  const fragments: HTMLDivElement[] = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement("div");
    const size = 2 + Math.random() * 3;
    p.className = "pointer-events-none absolute rounded-full";
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.background = `radial-gradient(circle, rgba(212,175,55,${0.4 + Math.random() * 0.4}), transparent)`;
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

export function UniverseLoader({ onComplete, onSkip }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const voidRef = useRef<HTMLDivElement>(null);
  const threadSvgRef = useRef<SVGSVGElement>(null);
  const threadRef = useRef<SVGPathElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const montageRef = useRef<HTMLDivElement>(null);
  const montageImgRef = useRef<HTMLImageElement>(null);
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
    tlRef.current?.progress(0.85, false);
    tlRef.current?.play();
  }, [onSkip]);

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    const voidEl = voidRef.current;
    const threadSvg = threadSvgRef.current;
    const thread = threadRef.current;
    const logo = logoRef.current;
    const glow = glowRef.current;
    const ring = ringRef.current;
    const montage = montageRef.current;
    const montageImg = montageImgRef.current;
    const tagline = taglineRef.current;
    const curtain = curtainRef.current;
    const particlesEl = particlesRef.current;
    if (!root || !voidEl || !threadSvg || !thread || !logo || !glow || !ring || !montage || !montageImg || !tagline || !curtain || !particlesEl) {
      return;
    }

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      sessionStorage.setItem(LOADER_STORAGE_KEY, "1");
      onComplete();
      return;
    }

    // Preload montage images
    MONTAGE_FRAMES.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });

    const particles = createParticles(particlesEl);
    const threadLen = thread.getTotalLength();
    gsap.set(thread, { strokeDasharray: threadLen, strokeDashoffset: threadLen });

    const words = tagline.querySelectorAll("[data-word]");
    gsap.set([logo, glow, ring, montage, tagline, curtain], { opacity: 0 });
    gsap.set(curtain, { yPercent: 0 });
    gsap.set(montageImg, { opacity: 0, scale: 1.05 });
    gsap.set(particles, { opacity: 0 });

    const tl = gsap.timeline({
      onComplete: finish,
    });
    tlRef.current = tl;

    // Scene 1 — Void (0–1.2s)
    tl.to(voidEl, { opacity: 1, duration: 0.6, ease: GSAP_EASE.silk }, 0)
      .to(particles, { opacity: 0.6, duration: 0.8, stagger: 0.03, ease: GSAP_EASE.silk }, 0.2)
      .to(
        particles,
        {
          x: () => (Math.random() - 0.5) * 40,
          y: () => (Math.random() - 0.5) * 40,
          duration: 1.2,
          stagger: 0.02,
          ease: "sine.out",
        },
        0.3
      );

    // Scene 2 — Gold thread (1.2–2.4s)
    tl.to(threadSvg, { opacity: 1, duration: 0.3 }, 1.2)
      .to(thread, { strokeDashoffset: 0, duration: 1, ease: GSAP_EASE.drama }, 1.3);

    // Scene 3 — Logo (2.4–4.0s)
    tl.call(() => playLoaderSound(), undefined, 2.4)
      .to(glow, { opacity: 1, scale: 1, duration: 0.8, ease: GSAP_EASE.luxe }, 2.4)
      .fromTo(logo, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 1, ease: GSAP_EASE.luxe }, 2.5)
      .to(ring, { opacity: 1, scale: 1, rotation: 360, duration: 1.4, ease: GSAP_EASE.luxe }, 2.55);

    // Scene 4 — Montage (4.0–6.0s)
    tl.to(montage, { opacity: 1, duration: 0.3 }, 4.0);
    MONTAGE_FRAMES.forEach((src, i) => {
      const t = 4.0 + i * 0.45;
      tl.call(() => {
        montageImg.src = src;
      }, undefined, t)
        .fromTo(montageImg, { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 0.25, ease: GSAP_EASE.silk }, t)
        .to(montageImg, { opacity: 0, duration: 0.25, ease: GSAP_EASE.silk }, t + 0.35);
    });

    // Scene 5 — Tagline (6.0–7.5s)
    tl.to(montage, { opacity: 0, duration: 0.3 }, 5.9)
      .to(tagline, { opacity: 1, duration: 0.4, ease: GSAP_EASE.luxe }, 6.0)
      .from(words, { yPercent: 110, opacity: 0, duration: 0.7, stagger: 0.08, ease: GSAP_EASE.luxe }, 6.1);

    // Scene 6 — Curtain (7.5–9.0s)
    tl.to(tagline, { opacity: 0, duration: 0.3 }, 7.4)
      .to(curtain, { opacity: 1, duration: 0.2 }, 7.5)
      .to(curtain, { yPercent: -100, duration: 1.2, ease: GSAP_EASE.drama }, 7.6)
      .to(root, { opacity: 0, duration: 0.4, ease: GSAP_EASE.silk }, 8.6);

    return () => {
      tl.kill();
      particles.forEach((p) => p.remove());
    };
  }, [finish, onComplete, playLoaderSound]);

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-label="Site introduction"
      aria-live="polite"
      aria-busy="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--v5-obsidian,#050505)]"
    >
      <p className="sr-only">Welcome to Nexyyra Events</p>

      <button
        type="button"
        onClick={skipToCurtain}
        className="absolute right-6 top-6 z-[110] rounded-full border border-[var(--v5-gold-metallic)]/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--v5-gold-champagne)] transition-colors hover:border-[var(--v5-gold-luxury)] hover:text-[var(--v5-gold-luxury)]"
      >
        Skip
      </button>

      {/* Scene 1 — void + particles */}
      <div ref={voidRef} className="absolute inset-0 opacity-0">
        <div ref={particlesRef} className="absolute inset-0" />
      </div>

      {/* Scene 2 — gold thread */}
      <svg
        ref={threadSvgRef}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          ref={threadRef}
          d="M 50 95 Q 70 60 85 15"
          fill="none"
          stroke="var(--v5-gold-metallic, #C9A227)"
          strokeWidth="0.15"
          style={{ filter: "drop-shadow(0 0 4px rgba(230,198,122,0.6))" }}
        />
      </svg>

      {/* Scene 3 — logo */}
      <div className="relative flex flex-col items-center">
        <div
          ref={glowRef}
          className="pointer-events-none absolute h-64 w-64 rounded-full opacity-0"
          style={{
            background: "var(--v5-glow-radial)",
            filter: "blur(32px)",
          }}
        />
        <div ref={ringRef} className="absolute h-72 w-72 rounded-full border border-[var(--v5-gold-metallic)]/30 opacity-0" />
        <div ref={logoRef} className="relative z-10 flex flex-col items-center gap-3 opacity-0">
          <Image
            src="/brand/logo-primary.png"
            alt="Nexyyra Events"
            width={160}
            height={96}
            priority
            className="h-auto w-[140px] object-contain shadow-[var(--v5-glow-gold)] sm:w-[160px]"
          />
          <p className="v5-kicker text-[var(--v5-gold-luxury)]">Nexyyra Events</p>
        </div>
      </div>

      {/* Scene 4 — montage */}
      <div ref={montageRef} className="pointer-events-none absolute inset-0 opacity-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={montageImgRef}
          alt=""
          className="h-full w-full object-cover opacity-0"
          style={{ filter: "brightness(0.55) saturate(1.1)" }}
        />
        <div className="absolute inset-0 bg-[rgba(5,5,5,0.45)]" />
      </div>

      {/* Scene 5 — tagline */}
      <div
        ref={taglineRef}
        className="absolute inset-x-0 bottom-[22%] px-6 text-center opacity-0"
      >
        <p className="v5-kicker mb-4 text-[var(--v5-gold-champagne)]">Nexyyra Events</p>
        <h2 className="v5-display text-[var(--v5-champagne,#F7F3EB)]">
          {["Architects of", "Extraordinary Experiences"].map((line) => (
            <span key={line} className="block overflow-hidden py-1">
              <span data-word className="inline-block">{line}</span>
            </span>
          ))}
        </h2>
      </div>

      {/* Scene 6 — curtain */}
      <div
        ref={curtainRef}
        className="pointer-events-none absolute inset-0 z-[105] bg-[var(--v5-obsidian,#050505)] opacity-0"
      >
        <div className="v5-hairline absolute inset-x-0 top-0" />
      </div>
    </div>
  );
}

/** @deprecated Use UniverseLoader — kept for backward compatibility */
export const LuxuryLoader = UniverseLoader;
