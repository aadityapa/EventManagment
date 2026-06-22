"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { HERO_FALLBACK } from "@/components/home/hero-carousel-data";
import { cn } from "@/lib/utils";

const FADE_MS = 1200;
const INTERVAL_DESKTOP = 6000;
const INTERVAL_MOBILE = 8000;

function slideSrc(index: number, slides: string[], broken: Set<number>) {
  if (broken.has(index)) return HERO_FALLBACK;
  return slides[index] ?? HERO_FALLBACK;
}

function HeroCarouselSlides({
  slideList,
}: {
  slideList: string[];
}) {
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
    const tick = () => setActive((i) => (i + 1) % slideList.length);
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
  }, [slideList.length]);

  useEffect(() => {
    const next = (active + 1) % slideList.length;
    const src = slideSrc(next, slideList, broken);
    const img = new window.Image();
    img.src = src;
  }, [active, broken, slideList]);

  return (
    <>
      {slideList.map((src, index) => {
        const resolved = slideSrc(index, slideList, broken);
        const isActive = index === active;
        return (
          <Image
            key={`${index}-${src}`}
            src={resolved}
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
    </>
  );
}

type HeroCarouselBackgroundProps = {
  slides: string[];
};

/**
 * Client hero background carousel — slides from live Google Drive sync (server props).
 */
export function HeroCarouselBackground({ slides }: HeroCarouselBackgroundProps) {
  const slideList = slides.length > 0 ? slides : [HERO_FALLBACK];
  const slideKey = slideList.join("|");

  return (
    <div className="absolute inset-0" aria-hidden>
      <HeroCarouselSlides key={slideKey} slideList={slideList} />
    </div>
  );
}
