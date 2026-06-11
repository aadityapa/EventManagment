"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { IMAGES } from "@/lib/images";

type HeroImage = { src: string; alt: string };

const FALLBACK: HeroImage[] = IMAGES.gallery.slice(0, 12).map((src, i) => ({
  src,
  alt: `Event inspiration ${i + 1}`,
}));

function useReducedMotion() {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);
}

export function HeroImageOrbit({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const [images, setImages] = useState<HeroImage[]>(FALLBACK);
  const [broken, setBroken] = useState<Record<string, true>>({});
  const layout = useMemo(() => {
    if (typeof window === "undefined") return { radius: 220, size: 88 };
    const lg = window.matchMedia?.("(min-width: 1024px)")?.matches ?? true;
    return lg ? { radius: 220, size: 88 } : { radius: 170, size: 72 };
  }, []);
  const mobileLayout = { radius: 120, size: 56 };

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch("/api/hero-images", { method: "GET" });
        const json = (await res.json().catch(() => ({}))) as { images?: HeroImage[] };
        if (!ignore && Array.isArray(json.images) && json.images.length >= 6) {
          setImages(json.images);
        }
      } catch {
        // keep fallback
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const items = images.filter((img) => !broken[img.src]).slice(0, 10);

  return (
    <div className={cn("pointer-events-none absolute inset-0", className)} aria-hidden>
      {/* Mobile orbit (kept lighter and higher to avoid covering the CTAs) */}
      <div className="absolute left-1/2 top-24 -translate-x-1/2 md:hidden">
        <div className="relative h-[320px] w-[320px] opacity-[0.62]">
          <div className="absolute inset-0 rounded-full border border-[var(--glitz-border)] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12),transparent_60%)] backdrop-blur-sm" />
          <div
            className={cn("absolute inset-0", reduced ? "" : "animate-spin [animation-duration:42s]")}
            style={{
              maskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 78%)",
              WebkitMaskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 78%)",
            }}
          >
            {items.slice(0, 8).map((img, i) => {
              const angle = (i / 8) * 360;
              return (
                <div
                  key={`m_${img.src}_${i}`}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    transform: `rotate(${angle}deg) translateX(${mobileLayout.radius}px) rotate(${-angle}deg)`,
                    transformOrigin: "0 0",
                  }}
                >
                  <motion.div
                    className="relative"
                    style={{ width: mobileLayout.size, height: mobileLayout.size }}
                    animate={reduced ? undefined : { y: [0, -5, 0] }}
                    transition={reduced ? undefined : { duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
                  >
                    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(244,228,161,0.32),rgba(212,175,55,0.06),transparent_70%)] blur-[10px]" />
                    <div className="absolute inset-0 rounded-full border border-[var(--glitz-gold)]/20 bg-black/20" />
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={mobileLayout.size}
                      height={mobileLayout.size}
                      className="relative rounded-full object-cover"
                      sizes={`${mobileLayout.size}px`}
                      unoptimized
                      referrerPolicy="no-referrer"
                      onError={() => setBroken((b) => (b[img.src] ? b : { ...b, [img.src]: true }))}
                    />
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="absolute right-[-180px] top-1/2 hidden -translate-y-1/2 md:block lg:right-[-140px]">
        <div className="relative h-[460px] w-[460px] opacity-[0.92] lg:h-[560px] lg:w-[560px]">
          <div className="absolute inset-0 rounded-full border border-[var(--glitz-border)] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12),transparent_62%)] backdrop-blur-sm" />
          <div
            className={cn(
              "absolute inset-0",
              reduced ? "" : "animate-spin [animation-duration:36s]"
            )}
            style={{
              maskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 72%)",
              WebkitMaskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 72%)",
            }}
          >
            {items.map((img, i) => {
              const angle = (i / items.length) * 360;
              return (
                <div
                  key={`${img.src}_${i}`}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    transform: `rotate(${angle}deg) translateX(${layout.radius}px) rotate(${-angle}deg)`,
                    transformOrigin: "0 0",
                  }}
                >
                  <motion.div
                    className="relative"
                    style={{ width: layout.size, height: layout.size }}
                    animate={reduced ? undefined : { y: [0, -6, 0] }}
                    transition={reduced ? undefined : { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.08 }}
                  >
                    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(244,228,161,0.35),rgba(212,175,55,0.08),transparent_70%)] blur-[10px]" />
                    <div className="absolute inset-0 rounded-full border border-[var(--glitz-gold)]/25 bg-black/25" />
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={layout.size}
                      height={layout.size}
                      className="relative rounded-full object-cover shadow-[0_0_40px_rgba(212,175,55,0.12)]"
                      sizes={`${layout.size}px`}
                      unoptimized
                      referrerPolicy="no-referrer"
                      onError={() => setBroken((b) => (b[img.src] ? b : { ...b, [img.src]: true }))}
                    />
                  </motion.div>
                </div>
              );
            })}
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--glitz-gold)]/25 bg-black/35 px-6 py-4 text-center backdrop-blur">
            <p className="brand-label">Gallery</p>
            <p className="mt-1 font-display text-lg font-semibold text-white">Signature Moments</p>
          </div>
        </div>
      </div>
    </div>
  );
}

