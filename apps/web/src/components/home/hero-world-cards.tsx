"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  motion,
  useReducedMotion,
  type MotionValue,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import { applyWorldPreset, type WorldPresetId } from "@/lib/adaptive-theme/world-presets";
import { gsap, registerGsap } from "@/lib/gsap/use-gsap";
import { GSAP_EASE } from "@/lib/motion";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const HERO_WORLDS = [
  {
    id: "wedding",
    title: "Wedding World",
    subtitle: "Ceremonies & vows",
    preset: "wedding" as WorldPresetId,
    href: "/services/wedding-planning?world=wedding",
    image: BRAND_IMAGES.weddings[0],
  },
  {
    id: "corporate",
    title: "Corporate World",
    subtitle: "Galas & launches",
    preset: "corporate" as WorldPresetId,
    href: "/services/corporate-events?world=corporate",
    image: BRAND_IMAGES.corporate[0],
  },
  {
    id: "concert",
    title: "Concert World",
    subtitle: "Stadium scale",
    preset: "celebration" as WorldPresetId,
    href: "/services/concert-management?world=celebration",
    image: BRAND_IMAGES.gallery[3],
  },
  {
    id: "destination",
    title: "Destination World",
    subtitle: "Palaces & shores",
    preset: "destination" as WorldPresetId,
    href: "/services/destination-weddings?world=destination",
    image: BRAND_IMAGES.destinations[1],
  },
  {
    id: "fashion",
    title: "Fashion World",
    subtitle: "Runway & front row",
    preset: "culture" as WorldPresetId,
    href: "/services/fashion-shows?world=culture",
    image: BRAND_IMAGES.gallery[12],
  },
] as const;

type Props = {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  className?: string;
};

export function HeroWorldCards({ mouseX, mouseY, className }: Props) {
  const reducedMotion = useReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);
  const groupX = useTransform(mouseX, (v) => v * 14);
  const groupY = useTransform(mouseY, (v) => v * 10);

  useEffect(() => {
    if (reducedMotion) return;
    registerGsap();
    const cards = gridRef.current?.querySelectorAll("[data-world-card]");
    if (!cards?.length) return;
    const ctx = gsap.context(() => {
      gsap.from(cards, {
        y: 48,
        opacity: 0,
        scale: 0.94,
        duration: 0.9,
        stagger: 0.1,
        ease: GSAP_EASE.luxe,
        delay: 1.05,
      });
    }, gridRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <motion.div
      ref={gridRef}
      style={{ x: groupX, y: groupY }}
      className={cn("relative w-full", className)}
      aria-label="Experience worlds"
    >
      {/* Desktop — staggered floating grid */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-4 xl:gap-5">
        {HERO_WORLDS.map((world, i) => (
          <WorldCard key={world.id} world={world} index={i} reducedMotion={!!reducedMotion} />
        ))}
      </div>

      {/* Mobile — horizontal scroll snap */}
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
        {HERO_WORLDS.map((world, i) => (
          <div key={world.id} className="w-[72vw] max-w-[280px] shrink-0 snap-center first:pl-1 last:pr-1">
            <WorldCard world={world} index={i} reducedMotion={!!reducedMotion} compact />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function WorldCard({
  world,
  index,
  reducedMotion,
  compact,
}: {
  world: (typeof HERO_WORLDS)[number];
  index: number;
  reducedMotion: boolean;
  compact?: boolean;
}) {
  const floatOffset = index % 2 === 0 ? -6 : 6;

  return (
    <motion.div
      data-world-card=""
      className={cn(compact ? "" : index === 1 || index === 4 ? "lg:translate-y-6" : index === 2 ? "lg:-translate-y-2" : "")}
      animate={
        reducedMotion
          ? undefined
          : { y: [floatOffset, floatOffset - 8, floatOffset] }
      }
      transition={
        reducedMotion
          ? undefined
          : { duration: 5 + index * 0.4, repeat: Infinity, ease: "easeInOut" }
      }
    >
      <Link
        href={world.href}
        onMouseEnter={() => applyWorldPreset(world.preset)}
        onFocus={() => applyWorldPreset(world.preset)}
        onClick={() => analytics.featureClick(world.id, "hero_world_card")}
        className="group block"
      >
        <GlassPanel
          variant="liquid"
          glow
          className={cn(
            "relative overflow-hidden p-0 transition-all duration-500",
            "hover:-translate-y-1.5 hover:shadow-[var(--v4-glow-gold)]",
            compact ? "min-h-[168px]" : "min-h-[148px]"
          )}
        >
          <div className="absolute inset-0">
            <Image
              src={world.image}
              alt={world.title}
              fill
              sizes={compact ? "280px" : "(max-width:1024px) 50vw, 320px"}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/28 to-black/10" />
          </div>
          <div className="relative flex min-h-[inherit] flex-col justify-end p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--adaptive-accent,var(--glitz-gold))]">
              {world.subtitle}
            </p>
            <div className="mt-1 flex items-end justify-between gap-2">
              <p className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-white drop-shadow-md">
                {world.title}
              </p>
              <ArrowUpRight
                className="h-4 w-4 shrink-0 text-[var(--glitz-gold)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden
              />
            </div>
          </div>
        </GlassPanel>
      </Link>
    </motion.div>
  );
}
