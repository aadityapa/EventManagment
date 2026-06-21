"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { registerGsap } from "@/lib/gsap/use-gsap";

export const LOADER_STORAGE_KEY = "glitz-loader-seen";

/** Hook for optional cinematic audio — wire `playLoaderSound()` when assets are ready. */
export function useLoaderSound() {
  return useCallback(() => {
    // Sound-ready: dispatch custom event or call AudioContext here.
    // Example: new Audio("/sounds/glitz-intro.mp3").play().catch(() => {});
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
    const size = 2 + Math.random() * 4;
    p.className = "pointer-events-none absolute rounded-full";
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.background = `radial-gradient(circle, rgba(212,175,55,${0.5 + Math.random() * 0.5}), transparent)`;
    p.style.left = `${40 + Math.random() * 20}%`;
    p.style.top = `${40 + Math.random() * 20}%`;
    container.appendChild(p);
    fragments.push(p);
  }
  return fragments;
}

export function LuxuryLoader({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const ringInnerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const raysRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const playLoaderSound = useLoaderSound();

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    const ring = ringRef.current;
    const ringInner = ringInnerRef.current;
    const logo = logoRef.current;
    const glow = glowRef.current;
    const rays = raysRef.current;
    const dust = dustRef.current;
    const particlesEl = particlesRef.current;
    if (!root || !ring || !ringInner || !logo || !glow || !rays || !dust || !particlesEl) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      sessionStorage.setItem(LOADER_STORAGE_KEY, "1");
      onComplete();
      return;
    }

    const particles = createParticles(particlesEl);

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem(LOADER_STORAGE_KEY, "1");
        gsap.to(root, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete,
        });
      },
    });

    gsap.set(root, { opacity: 0 });
    gsap.set([ring, ringInner, logo, glow, rays, dust], { opacity: 0, scale: 0.8 });
    gsap.set(ring, { rotation: -120 });
    gsap.set(rays, { rotation: 0 });
    gsap.set(particles, { opacity: 0, scale: 0 });

    tl.to(root, { opacity: 1, duration: 0.4, ease: "power2.out" })
      .call(() => playLoaderSound(), undefined, 0.2)
      .to(glow, { opacity: 1, scale: 1, duration: 1, ease: "power3.out" }, 0.1)
      .to(rays, { opacity: 0.35, scale: 1.2, duration: 1.2, ease: "sine.out" }, 0.15)
      .to(logo, { opacity: 1, scale: 1, duration: 1, ease: "power3.out" }, 0.25)
      .to(ring, { opacity: 1, scale: 1, rotation: 0, duration: 1.4, ease: "power3.out" }, 0.2)
      .to(ringInner, { opacity: 1, scale: 1, duration: 1, ease: "power3.out" }, 0.35)
      .to(
        particles,
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: { each: 0.04, from: "random" },
          ease: "power2.out",
        },
        0.5
      )
      .to(
        particles,
        {
          x: () => (Math.random() - 0.5) * 120,
          y: () => (Math.random() - 0.5) * 120,
          opacity: 0,
          duration: 2,
          stagger: { each: 0.06, from: "random" },
          ease: "power1.out",
        },
        0.9
      )
      .to(dust, { opacity: 0.5, scale: 1.3, duration: 1.2, ease: "sine.out" }, 0.8)
      .to(ring, { rotation: 360, duration: 2.8, ease: "power1.inOut" }, 0.6)
      .to(rays, { rotation: 45, opacity: 0.2, duration: 2.5, ease: "none" }, 0.6)
      .to(glow, { opacity: 0.7, scale: 1.35, duration: 0.8, repeat: 2, yoyo: true, ease: "sine.inOut" }, 1.2)
      .to(logo, { scale: 1.06, duration: 0.5, yoyo: true, repeat: 1, ease: "sine.inOut" }, 1.4)
      .to(dust, { opacity: 0, scale: 1.6, duration: 0.6, ease: "power2.in" }, 2.8);

    return () => {
      tl.kill();
      particles.forEach((p) => p.remove());
    };
  }, [onComplete, playLoaderSound]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--v4-obsidian,#000000)] opacity-0"
      aria-hidden
      aria-busy="true"
      aria-label="Loading Glitz Events"
    >
      {/* Light rays */}
      <div
        ref={raysRef}
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{
          background:
            "conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(212,175,55,0.08) 30deg, transparent 60deg, rgba(230,198,122,0.06) 120deg, transparent 180deg, rgba(212,175,55,0.08) 240deg, transparent 300deg)",
        }}
      />

      {/* Gold dust field */}
      <div
        ref={dustRef}
        className="pointer-events-none absolute h-[120vmin] w-[120vmin] rounded-full opacity-0"
        style={{
          background:
            "radial-gradient(circle, rgba(212,175,55,0.12) 0%, rgba(216,178,110,0.04) 40%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative flex h-64 w-64 items-center justify-center sm:h-80 sm:w-80">
        {/* Ambient glow */}
        <div
          ref={glowRef}
          className="pointer-events-none absolute inset-[-20%] rounded-full opacity-0"
          style={{
            background:
              "radial-gradient(circle, rgba(212,175,55,0.4) 0%, rgba(201,162,39,0.15) 45%, transparent 70%)",
            filter: "blur(32px)",
          }}
        />

        {/* Outer luxury ring */}
        <div
          ref={ringRef}
          className="absolute inset-0 rounded-full opacity-0"
          style={{
            border: "2px solid rgba(212,175,55,0.35)",
            boxShadow:
              "0 0 60px rgba(212,175,55,0.25), inset 0 0 40px rgba(212,175,55,0.08)",
            background:
              "conic-gradient(from 0deg, transparent, rgba(212,175,55,0.4), transparent, rgba(230,198,122,0.25), transparent)",
          }}
        />

        {/* Inner ring */}
        <div
          ref={ringInnerRef}
          className="absolute inset-4 rounded-full opacity-0 sm:inset-6"
          style={{
            border: "1px solid rgba(230,198,122,0.25)",
            boxShadow: "0 0 30px rgba(212,175,55,0.15)",
          }}
        />

        {/* Gold particles container */}
        <div ref={particlesRef} className="absolute inset-0" />

        {/* Logo */}
        <div ref={logoRef} className="relative z-10 flex flex-col items-center gap-3 opacity-0">
          <Image
            src="/logo.jpg"
            alt="Glitz Events & Promotions"
            width={128}
            height={128}
            priority
            className="rounded-xl shadow-[0_0_48px_rgba(212,175,55,0.35)]"
          />
          <p className="v4-kicker text-[var(--v4-gold-luxury,#D4AF37)]">Luxury Events</p>
        </div>
      </div>
    </div>
  );
}
