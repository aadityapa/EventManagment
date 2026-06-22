"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  HERO_CATEGORIES,
  HERO_FALLBACK,
} from "@/components/home/hero-carousel-data";
import { cn } from "@/lib/utils";

const SLIDES = HERO_CATEGORIES.map((s) => s.src);
const FADE_MS = 1200;
const INTERVAL_DESKTOP = 6000;
const INTERVAL_MOBILE = 8000;

function slideSrc(index: number, broken: Set<number>) {
  if (broken.has(index)) return HERO_FALLBACK;
  return SLIDES[index] ?? HERO_FALLBACK;
}

/**
 * Client hero background carousel — fade between slides, preloads next frame.
 */
export function HeroCarouselBackground() {
  const [active, setActive] = useState(0);
  const [broken, setBroken] = useState<Set<number>>(() => new Set());

  const markBroken = useCallback((index: number) => {
    setBroken((prev) => {
      if (prev.has(index)) return prev;
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const tick = () => setActive((i) => (i + 1) % SLIDES.length);
    let id: number | undefined;

    const start = () => {
      if (id !== undefined) window.clearInterval(id);
      id = window.setInterval(tick, mq.matches ? INTERVAL_MOBILE : INTERVAL_DESKTOP);
    };

    start();
    mq.addEventListener("change", start);
    return () => {
      if (id !== undefined) window.clearInterval(id);
      mq.removeEventListener("change", start);
    };
  }, []);

  useEffect(() => {
    const next = (active + 1) % SLIDES.length;
    const src = slideSrc(next, broken);
    const img = new window.Image();
    img.src = src;
  }, [active, broken]);

  return (
    <div className="absolute inset-0" aria-hidden>
      {SLIDES.map((_, index) => {
        const src = slideSrc(index, broken);
        const isActive = index === active;
        return (
          <Image
            key={`${index}-${src}`}
            src={src}
            alt=""
            fill
            priority={index === 0}
            fetchPriority={index === 0 ? "high" : "auto"}
            sizes="100vw"
            className={cn(
              "object-cover transition-opacity ease-in-out",
              isActive ? "opacity-100" : "opacity-0"
            )}
            style={{ transitionDuration: `${FADE_MS}ms` }}
            onError={() => markBroken(index)}
          />
        );
      })}
    </div>
  );
}
