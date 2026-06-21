"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type RefObject } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { gsap, registerGsap } from "@/lib/gsap/use-gsap";
import { HERO_VIDEO_FALLBACK, type HeroVideoSlide } from "./hero-video-data";
import { BLUR_DATA_URL } from "@/lib/images";

type Props = {
  slides: HeroVideoSlide[];
  active: number;
  broken: Record<number, true>;
  onBroken: (index: number) => void;
  videoRef?: RefObject<HTMLVideoElement | null>;
};

function KenBurnsPoster({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  const zoomRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    registerGsap();
    const el = zoomRef.current;
    if (!el) return;
    gsap.killTweensOf(el);
    gsap.fromTo(el, { scale: 1.02 }, { scale: 1.1, duration: 8, ease: "none" });
  }, [src, reducedMotion]);

  return (
    <div ref={zoomRef} className="absolute inset-[-3%] will-change-transform">
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="100vw"
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        className="object-cover object-center brightness-[1.02] contrast-[1.04] saturate-[1.06]"
        unoptimized
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

export function HeroVideoBackground({ slides, active, broken, onBroken, videoRef }: Props) {
  const reducedMotion = useReducedMotion();
  const [loaded, setLoaded] = useState<Record<number, true>>({});
  const [allowVideo, setAllowVideo] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setAllowVideo(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const slide = slides[active];
  const usePoster = reducedMotion || broken[active] || !slide?.video || !allowVideo;
  const posterSrc = broken[active] ? HERO_VIDEO_FALLBACK : slide?.poster ?? HERO_VIDEO_FALLBACK;

  useEffect(() => {
    const video = videoRef?.current;
    if (!video || usePoster) return;
    void video.play().catch(() => onBroken(active));
  }, [active, usePoster, onBroken, videoRef]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[var(--glitz-bg)]">
      <AnimatePresence mode="sync">
        <motion.div
          key={active}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.85, ease: [0.22, 1, 0.36, 1] }}
        >
          {usePoster ? (
            <KenBurnsPoster src={posterSrc} alt={slide?.alt ?? "Luxury event"} priority={active === 0} />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              poster={posterSrc}
              className="absolute inset-0 h-full w-full object-cover object-center brightness-[1.02] contrast-[1.04] saturate-[1.06]"
              aria-hidden
              onLoadedData={() => setLoaded((l) => ({ ...l, [active]: true }))}
              onError={() => onBroken(active)}
            >
              <source src={slide.video} type="video/mp4" />
            </video>
          )}

          {!usePoster && !loaded[active] && (
            <KenBurnsPoster src={posterSrc} alt={slide?.alt ?? "Luxury event"} priority={active === 0} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Cinematic readability overlay — always-on on hero media */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        aria-hidden
        style={{
          background:
            "linear-gradient(105deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.52) 38%, rgba(0,0,0,0.28) 62%, rgba(0,0,0,0.18) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-95"
        aria-hidden
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 42%, transparent 68%)",
        }}
      />
      {/* Adaptive scrim — layered with static cinematic base */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: "var(--adaptive-scrim, transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-90"
        style={{ background: "var(--adaptive-scrim-bottom, transparent)" }}
      />
    </div>
  );
}
