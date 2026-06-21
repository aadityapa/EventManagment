"use client";

import Image from "next/image";
import Link from "next/link";
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
import { usePremiere } from "@/components/providers/premiere-context";
import { EASE } from "@/lib/motion";
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
    subtitle: "Galas & summits",
    preset: "corporate" as WorldPresetId,
    href: "/services/corporate-events?world=corporate",
    image: BRAND_IMAGES.corporate[0],
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
    id: "celebrity",
    title: "Celebrity World",
    subtitle: "VIP & red carpet",
    preset: "culture" as WorldPresetId,
    href: "/services/celebrity-management?world=culture",
    image: BRAND_IMAGES.hero.palace,
  },
  {
    id: "fashion",
    title: "Fashion World",
    subtitle: "Runway & front row",
    preset: "culture" as WorldPresetId,
    href: "/services/fashion-shows?world=culture",
    image: BRAND_IMAGES.gallery[12],
  },
  {
    id: "brand",
    title: "Brand Activations",
    subtitle: "Experiential marketing",
    preset: "corporate" as WorldPresetId,
    href: "/services/brand-promotions?world=corporate",
    image: BRAND_IMAGES.gallery[8],
  },
] as const;

const cardEntrance = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1,
      ease: EASE.silk,
      delay: 0.4 + i * 0.08,
    },
  }),
};

type Props = {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  className?: string;
};

export function HeroWorldCards({ mouseX, mouseY, className }: Props) {
  const reducedMotion = useReducedMotion();
  const { skipPremiere, handoffActive } = usePremiere();
  const cardsReady = skipPremiere || handoffActive || !!reducedMotion;
  const groupX = useTransform(mouseX, (v) => v * 14);
  const groupY = useTransform(mouseY, (v) => v * 10);

  return (
    <motion.div
      style={{ x: groupX, y: groupY }}
      className={cn("relative w-full min-w-0 max-w-xl transform-gpu lg:max-w-none", className)}
      aria-label="Experience worlds"
    >
      <div className="grid grid-cols-1 gap-4 min-[375px]:grid-cols-2 lg:hidden">
        {HERO_WORLDS.map((world, i) => (
          <WorldCard
            key={world.id}
            world={world}
            index={i}
            reducedMotion={!!reducedMotion}
            compact
            ready={cardsReady}
          />
        ))}
      </div>

      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-3 xl:gap-4">
        {HERO_WORLDS.map((world, i) => (
          <WorldCard
            key={world.id}
            world={world}
            index={i}
            reducedMotion={!!reducedMotion}
            compact
            ready={cardsReady}
          />
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
  ready,
}: {
  world: (typeof HERO_WORLDS)[number];
  index: number;
  reducedMotion: boolean;
  compact?: boolean;
  ready: boolean;
}) {
  const floatOffset = index % 2 === 0 ? -5 : 5;
  const staggerY = index === 1 || index === 4 ? "lg:translate-y-5" : index === 2 || index === 5 ? "lg:-translate-y-1" : "";

  return (
    <motion.div
      data-world-card=""
      className={cn(compact ? "" : staggerY, "transform-gpu will-change-transform")}
      custom={index}
      initial={reducedMotion ? false : "hidden"}
      animate={ready ? "visible" : "hidden"}
      variants={cardEntrance}
    >
      <motion.div
        animate={reducedMotion ? undefined : { y: [floatOffset, floatOffset - 7, floatOffset] }}
        transition={
          reducedMotion
            ? undefined
            : { duration: 5.5 + index * 0.35, repeat: Infinity, ease: "easeInOut" }
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
              compact ? "min-h-[148px]" : "min-h-[128px] lg:min-h-[118px]"
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/32 to-black/12" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,transparent_42%)] opacity-60" />
            </div>
            <div className="relative flex min-h-[inherit] flex-col justify-end p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--adaptive-accent,var(--glitz-gold))]">
                {world.subtitle}
              </p>
              <div className="mt-1 flex items-end justify-between gap-2">
                <p className="font-[family-name:var(--font-playfair)] text-base font-semibold text-white drop-shadow-md lg:text-[0.9375rem]">
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
    </motion.div>
  );
}
