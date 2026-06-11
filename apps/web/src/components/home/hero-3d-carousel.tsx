"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap, registerGsap } from "@/lib/gsap/use-gsap";
import { cn } from "@/lib/utils";
import { HERO_CATEGORIES, type HeroSlide } from "./hero-carousel-data";
import { FALLBACK_IMAGE } from "@/lib/images";

const HeroCarouselDepth = dynamic(
  () => import("./hero-carousel-depth").then((m) => m.HeroCarouselDepth),
  { ssr: false }
);

const AUTO_MS = 4000;
const PERSPECTIVE_DESKTOP = 2500;
const PERSPECTIVE_TABLET = 1800;

type SlideStyle = {
  x: number;
  z: number;
  rotateY: number;
  rotateX: number;
  scale: number;
  opacity: number;
  zIndex: number;
  blur: number;
};

function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

function shortestOffset(from: number, to: number, length: number) {
  let diff = to - from;
  if (diff > length / 2) diff -= length;
  if (diff < -length / 2) diff += length;
  return diff;
}

function getRelativeIndex(index: number, active: number, length: number) {
  return shortestOffset(active, index, length);
}

function computeStyle(relative: number, mobile: boolean, tablet: boolean): SlideStyle {
  const abs = Math.abs(relative);
  if (mobile) {
    return {
      x: 0,
      z: relative === 0 ? 0 : -120,
      rotateY: 0,
      rotateX: 0,
      scale: relative === 0 ? 1 : 0.92,
      opacity: relative === 0 ? 1 : 0,
      zIndex: relative === 0 ? 20 : 0,
      blur: relative === 0 ? 0 : 6,
    };
  }

  const spread = tablet ? 160 : 210;
  const depth = tablet ? 70 : 95;

  return {
    x: relative * spread,
    z: relative === 0 ? 120 : -abs * depth,
    rotateY: relative * (tablet ? -32 : -42),
    rotateX: abs * 5,
    scale: relative === 0 ? 1 : abs === 1 ? 0.85 : abs === 2 ? 0.72 : 0.65,
    opacity: relative === 0 ? 1 : abs === 1 ? 0.6 : abs === 2 ? 0.3 : 0,
    zIndex: 30 - Math.round(abs * 10),
    blur: relative === 0 ? 0 : abs === 1 ? 0.5 : 2,
  };
}

function useBreakpoint() {
  const [bp, setBp] = useState<"mobile" | "tablet" | "desktop">("desktop");

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 768) setBp("mobile");
      else if (w < 1024) setBp("tablet");
      else setBp("desktop");
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return bp;
}

export function Hero3DCarousel() {
  const reducedMotion = useReducedMotion();
  const bp = useBreakpoint();
  const mobile = bp === "mobile";
  const tablet = bp === "tablet";

  const [slides, setSlides] = useState<HeroSlide[]>(HERO_CATEGORIES);
  const [broken, setBroken] = useState<Record<number, true>>({});
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [paused, setPaused] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeRef = useRef(0);
  const wheelLock = useRef(false);
  const pointerStart = useRef(0);
  const dragOffsetRef = useRef(0);

  const length = slides.length;
  const perspective = mobile ? 1200 : tablet ? PERSPECTIVE_TABLET : PERSPECTIVE_DESKTOP;

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch("/api/hero-images");
        const json = (await res.json()) as { slides?: HeroSlide[] };
        if (!ignore && Array.isArray(json.slides) && json.slides.length >= 4) {
          setSlides(json.slides);
        }
      } catch {
        /* keep fallback */
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const applyStyles = useCallback(
    (centerIndex: number, offset = 0, animate = true) => {
      registerGsap();
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const rel = getRelativeIndex(i, centerIndex, length) - offset;
        const style = computeStyle(rel, mobile, tablet);
        const props = {
          x: style.x,
          y: 0,
          z: style.z,
          rotateY: style.rotateY,
          rotateX: style.rotateX,
          scale: style.scale,
          opacity: style.opacity,
          filter: `blur(${style.blur}px)`,
          transformPerspective: perspective,
        };
        if (animate) {
          gsap.to(el, { ...props, duration: 0.85, ease: "power3.out" });
        } else {
          gsap.set(el, props);
        }
      });
    },
    [length, mobile, tablet, perspective]
  );

  const goTo = useCallback(
    (index: number, animate = true) => {
      const next = wrapIndex(index, length);
      if (next === activeRef.current && animate) return;
      activeRef.current = next;
      setActive(next);
      applyStyles(next, 0, animate);
    },
    [length, applyStyles]
  );

  const next = useCallback(() => goTo(activeRef.current + 1), [goTo]);
  const prev = useCallback(() => goTo(activeRef.current - 1), [goTo]);

  useEffect(() => {
    applyStyles(activeRef.current, 0, false);
  }, [slides, mobile, tablet, applyStyles]);

  useEffect(() => {
    if (reducedMotion || paused || dragging) return;
    const id = window.setInterval(() => goTo(activeRef.current + 1), AUTO_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion, paused, dragging, goTo]);

  useEffect(() => {
    if (reducedMotion || dragging) return;
    let raf = 0;
    const tick = () => {
      const el = cardRefs.current[activeRef.current];
      if (el) {
        const y = Math.sin(Date.now() / 1200) * 6;
        gsap.set(el, { y });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion, dragging, active]);

  const onPointerDown = (e: ReactPointerEvent) => {
    setDragging(true);
    pointerStart.current = e.clientX;
    dragOffsetRef.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!dragging) return;
    const delta = e.clientX - pointerStart.current;
    dragOffsetRef.current = delta / (mobile ? 280 : 420);
    applyStyles(activeRef.current, dragOffsetRef.current, false);
  };

  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    const delta = dragOffsetRef.current;
    if (delta > 0.18) prev();
    else if (delta < -0.18) next();
    else goTo(activeRef.current);
    dragOffsetRef.current = 0;
  };

  const onWheel = (e: ReactWheelEvent) => {
    e.preventDefault();
    if (wheelLock.current) return;
    wheelLock.current = true;
    if (e.deltaY > 0) next();
    else prev();
    window.setTimeout(() => {
      wheelLock.current = false;
    }, 700);
  };

  const visibleSlides = useMemo(() => slides.map((slide, i) => ({ slide, i })), [slides]);

  return (
    <div
      className="relative h-[min(72vh,640px)] w-full touch-pan-y select-none md:h-[min(78vh,720px)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onWheel={onWheel}
    >
      <HeroCarouselDepth activeIndex={active} />

      <div
        ref={stageRef}
        className="relative flex h-full w-full items-center justify-center"
        style={{ perspective, perspectiveOrigin: "50% 50%" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="relative h-[58%] w-full max-w-[920px] [transform-style:preserve-3d] md:h-[68%]">
          {visibleSlides.map(({ slide, i }) => {
            const rel = getRelativeIndex(i, active, length);
            const style = computeStyle(rel, mobile, tablet);
            const isActive = i === active;

            return (
              <div
                key={`${slide.category}-${i}`}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className={cn(
                  "absolute left-1/2 top-1/2 h-full w-[min(88vw,340px)] -translate-x-1/2 -translate-y-1/2 will-change-transform md:w-[min(42vw,420px)]",
                  dragging ? "cursor-grabbing" : "cursor-grab"
                )}
                style={{
                  transformStyle: "preserve-3d",
                  zIndex: style.zIndex,
                }}
              >
                <motion.div
                  className="relative h-full w-full overflow-hidden rounded-2xl border border-[#D4AF37]/25 bg-black/40 shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur-sm"
                  animate={
                    isActive && !dragging && !reducedMotion
                      ? {
                          boxShadow: [
                            "0 0 40px rgba(212,175,55,0.15)",
                            "0 0 70px rgba(212,175,55,0.35)",
                            "0 0 40px rgba(212,175,55,0.15)",
                          ],
                        }
                      : undefined
                  }
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-40" />
                  <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <Image
                    src={broken[i] ? FALLBACK_IMAGE : slide.src}
                    alt={slide.alt}
                    fill
                    priority={isActive}
                    loading={isActive ? "eager" : "lazy"}
                    sizes="(max-width: 768px) 88vw, 420px"
                    className="object-cover"
                    unoptimized
                    referrerPolicy="no-referrer"
                    onError={() => setBroken((b) => (b[i] ? b : { ...b, [i]: true }))}
                  />
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-4 md:p-5">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
                      Glitz Signature
                    </span>
                    <p className="mt-1 font-[family-name:var(--font-playfair)] text-lg font-semibold text-white md:text-xl">
                      {slide.category}
                    </p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-2 md:bottom-4">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === active ? "w-8 bg-[#D4AF37]" : "w-1.5 bg-white/30 hover:bg-white/50"
            )}
          />
        ))}
      </div>
    </div>
  );
}
