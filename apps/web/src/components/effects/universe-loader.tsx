"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { registerGsap } from "@/lib/gsap/use-gsap";
import { GSAP_EASE } from "@/lib/motion";
import { trackEvent } from "@/lib/analytics";
import { SITE_CONFIG } from "@/lib/constants";
import { BRAND_LOGO_ASSETS } from "@/components/branding/logo";

export const LOADER_STORAGE_KEY = "glitz-v5-premiere-seen";
const LEGACY_LOADER_KEY = "glitz-loader-seen";

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

const PARTICLE_COUNT = 28;

function createParticles(container: HTMLElement) {
  const fragments: HTMLDivElement[] = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement("div");
    const size = 2 + Math.random() * 4;
    p.className = "pointer-events-none absolute rounded-full";
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.background = `radial-gradient(circle, rgba(212,175,55,${0.4 + Math.random() * 0.5}), transparent)`;
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

/** Golden premiere — logo, tagline, hero reveal in ≤2.5s */
export function UniverseLoader({ onComplete, onSkip }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const playLoaderSound = useLoaderSound();
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const finish = useCallback(() => {
    sessionStorage.setItem(LOADER_STORAGE_KEY, "1");
    sessionStorage.setItem(LEGACY_LOADER_KEY, "1");
    trackEvent("premiere_complete");
    onComplete();
  }, [onComplete]);

  const skipToEnd = useCallback(() => {
    trackEvent("premiere_skip");
    onSkip?.();
    tlRef.current?.progress(0.92, false);
    tlRef.current?.play();
  }, [onSkip]);

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    const logo = logoRef.current;
    const tagline = taglineRef.current;
    const particlesEl = particlesRef.current;
    if (!root || !logo || !tagline || !particlesEl) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      sessionStorage.setItem(LOADER_STORAGE_KEY, "1");
      onComplete();
      return;
    }

    const particles = createParticles(particlesEl);
    const words = tagline.querySelectorAll("[data-word]");

    gsap.set(root, { opacity: 1 });
    gsap.set([logo, tagline], { opacity: 0 });
    gsap.set(logo, { scale: 0.92, y: 12 });
    gsap.set(particles, { opacity: 0, scale: 0.6 });

    const tl = gsap.timeline({ onComplete: finish });
    tlRef.current = tl;

    // Golden particles
    tl.to(particles, { opacity: 0.7, scale: 1, duration: 0.45, stagger: 0.015, ease: GSAP_EASE.silk }, 0)
      .call(() => playLoaderSound(), undefined, 0.15);

    // Logo reveal
    tl.to(logo, { opacity: 1, scale: 1, y: 0, duration: 0.65, ease: GSAP_EASE.luxe }, 0.35);

    // Tagline reveal
    tl.to(tagline, { opacity: 1, duration: 0.4, ease: GSAP_EASE.silk }, 1.05)
      .from(words, { yPercent: 100, opacity: 0, duration: 0.55, stagger: 0.08, ease: GSAP_EASE.luxe }, 1.15);

    // Fade to hero (content visible beneath)
    tl.to([logo, tagline, particlesEl], { opacity: 0, duration: 0.55, ease: GSAP_EASE.silk }, 1.85)
      .to(root, { opacity: 0, duration: 0.45, ease: GSAP_EASE.silk }, 2.05);

    return () => {
      tl.kill();
      particles.forEach((p) => p.remove());
    };
  }, [finish, onComplete, playLoaderSound]);

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-label="Welcome"
      aria-live="polite"
      aria-busy="true"
      className="fixed inset-0 z-[100] bg-[radial-gradient(ellipse_at_center,#1a1510_0%,#050505_72%)]"
    >
      <p className="sr-only">Welcome to {SITE_CONFIG.name}</p>

      <button
        type="button"
        onClick={skipToEnd}
        className="absolute right-4 top-4 z-[110] min-h-[44px] rounded-full border border-[var(--gold)]/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)] transition-colors hover:border-[var(--gold)] hover:text-[#fff8eb] sm:right-6 sm:top-6"
      >
        Skip
      </button>

      <div ref={particlesRef} className="pointer-events-none absolute inset-0 z-[1]" />

      <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center px-6">
        <div ref={logoRef} className="brand-logo-gold mb-8 w-[min(72vw,220px)] opacity-0">
          <Image
            src={BRAND_LOGO_ASSETS.primary}
            alt={SITE_CONFIG.name}
            width={440}
            height={160}
            priority
            quality={100}
            className="brand-logo-gold__img h-auto w-full object-contain"
          />
        </div>

        <div ref={taglineRef} className="text-center opacity-0">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-[var(--gold)]">
            {SITE_CONFIG.name}
          </p>
          <h2 className="font-[family-name:var(--font-playfair)] text-[clamp(1.25rem,4vw,2rem)] font-semibold text-[#fff8eb]">
            {["The Next Era of", "Celebrations"].map((line) => (
              <span key={line} className="block overflow-hidden py-0.5">
                <span data-word className="inline-block">
                  {line}
                </span>
              </span>
            ))}
          </h2>
        </div>
      </div>
    </div>
  );
}

export const LuxuryLoader = UniverseLoader;
