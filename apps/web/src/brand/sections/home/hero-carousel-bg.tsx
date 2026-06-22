"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { HERO_FALLBACK } from "@/components/home/hero-carousel-data";
import { BLUR_DATA_URL } from "@/lib/images";
import { cn } from "@/lib/utils";

const FADE_S = 0.9;
const INTERVAL_MS = 5000;

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
    const tick = () => setActive((i) => (i + 1) % slideList.length);
    const id = window.setInterval(tick, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [slideList.length]);

  useEffect(() => {
    const next = (active + 1) % slideList.length;
    const src = slideSrc(next, slideList, broken);
    const img = new window.Image();
    img.src = src;
  }, [active, broken, slideList]);

  const resolved = slideSrc(active, slideList, broken);

  return (
    <div className="absolute inset-0 bg-[var(--glitz-bg,#050505)]">
      <AnimatePresence mode="sync">
        <motion.div
          key={`${active}-${resolved}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_S, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={resolved}
            alt=""
            fill
            priority={active === 0}
            fetchPriority={active === 0 ? "high" : "auto"}
            loading={active === 0 ? "eager" : "lazy"}
            sizes="100vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className={cn("object-cover object-center")}
            onError={() => markBroken(active)}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

type HeroCarouselBackgroundProps = {
  slides: string[];
};

/**
 * Client hero background carousel — 5s autoplay, blur placeholders, Framer Motion fades.
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
