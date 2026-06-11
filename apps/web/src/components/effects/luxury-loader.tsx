"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { registerGsap } from "@/lib/gsap/use-gsap";

export const LOADER_STORAGE_KEY = "glitz-loader-seen";

export function LuxuryLoader({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    const ring = ringRef.current;
    const logo = logoRef.current;
    const glow = glowRef.current;
    if (!root || !ring || !logo || !glow) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      sessionStorage.setItem(LOADER_STORAGE_KEY, "1");
      onComplete();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem(LOADER_STORAGE_KEY, "1");
        gsap.to(root, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.inOut",
          onComplete,
        });
      },
    });

    gsap.set([ring, logo, glow], { opacity: 0, scale: 0.85 });
    gsap.set(ring, { rotation: -90 });

    tl.to(root, { opacity: 1, duration: 0.3 })
      .to(logo, { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }, "-=0.1")
      .to(ring, { opacity: 1, scale: 1, rotation: 0, duration: 1.2, ease: "power3.out" }, "-=0.5")
      .to(glow, { opacity: 1, scale: 1.1, duration: 0.8, ease: "sine.out" }, "-=0.6")
      .to(ring, { rotation: 360, duration: 2.4, ease: "power1.inOut" }, "-=1.2")
      .to(glow, { opacity: 0.6, scale: 1.25, duration: 0.6, repeat: 2, yoyo: true, ease: "sine.inOut" }, "-=2")
      .to(logo, { scale: 1.05, duration: 0.4, yoyo: true, repeat: 1, ease: "sine.inOut" }, "-=1.5");

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000000] opacity-0"
      aria-hidden
    >
      <div className="relative flex h-56 w-56 items-center justify-center sm:h-72 sm:w-72">
        <div
          ref={glowRef}
          className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(194,178,128,0.35),transparent_65%)] blur-2xl"
        />
        <div
          ref={ringRef}
          className="absolute inset-0 rounded-full border-2 border-[var(--glitz-gold)]/40 shadow-[0_0_60px_rgba(194,178,128,0.25)]"
          style={{
            background:
              "conic-gradient(from 0deg, transparent, rgba(194,178,128,0.35), transparent, rgba(224,216,191,0.2), transparent)",
          }}
        />
        <div ref={logoRef} className="relative z-10 flex flex-col items-center gap-3">
          <Image src="/logo.jpg" alt="Glitz Events & Promotions" width={120} height={120} priority className="rounded-xl shadow-[0_0_40px_rgba(194,178,128,0.2)]" />
          <p className="brand-label text-[var(--glitz-gold)]">Luxury Events</p>
        </div>
      </div>
    </div>
  );
}
