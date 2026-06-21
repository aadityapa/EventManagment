"use client";

import { useEffect, useRef } from "react";
import { ScrollReveal, registerScene, revealChildren } from "@/lib/motion";
import { PortalCard } from "@/brand/primitives/portal-card";
import { applyWorldPreset, clearWorldPreset, type WorldPresetId } from "@/lib/adaptive-theme/world-presets";
import { BRAND_IMAGES } from "@/brand/data/imagery";

const EXPERIENCE_WORLDS = [
  { id: "wedding", title: "Wedding World", subtitle: "Ceremonies & vows", preset: "wedding" as WorldPresetId, href: "/services/wedding-planning?world=wedding", image: BRAND_IMAGES.weddings[0] },
  { id: "corporate", title: "Corporate World", subtitle: "Galas & launches", preset: "corporate" as WorldPresetId, href: "/services/corporate-events?world=corporate", image: BRAND_IMAGES.corporate[0] },
  { id: "concert", title: "Concert World", subtitle: "Stadium scale", preset: "celebration" as WorldPresetId, href: "/services/concert-management?world=celebration", image: BRAND_IMAGES.gallery?.[3] ?? BRAND_IMAGES.corporate[1] },
  { id: "celebrity", title: "Celebrity World", subtitle: "VIP & red carpet", preset: "culture" as WorldPresetId, href: "/services/celebrity-management?world=culture", image: BRAND_IMAGES.hero.palace },
  { id: "exhibition", title: "Exhibition World", subtitle: "Trade & brand", preset: "corporate" as WorldPresetId, href: "/services/exhibitions?world=corporate", image: BRAND_IMAGES.gallery?.[11] ?? BRAND_IMAGES.corporate[2] },
  { id: "fashion", title: "Fashion World", subtitle: "Runway & front row", preset: "culture" as WorldPresetId, href: "/services/fashion-shows?world=culture", image: BRAND_IMAGES.gallery?.[7] ?? BRAND_IMAGES.weddings[2] },
] as const;
import { analytics } from "@/lib/analytics";

/**
 * V5 Ch.3 — Experience Worlds portal grid.
 */
export function HomeExperienceWorlds() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unregister = registerScene("home-worlds", {
      priority: 3,
      onEnter: () => {
        revealChildren(gridRef.current, { preset: "scaleIn", stagger: "loose" });
      },
      onExit: () => clearWorldPreset(),
    });
    return unregister;
  }, []);

  return (
    <section
      id="worlds"
      className="v4-section v5-dune-glow relative overflow-hidden bg-[var(--glitz-bg)]"
      aria-labelledby="worlds-heading"
    >
      <div className="brand-container">
        <ScrollReveal preset="reveal">
          <span className="v4-kicker mb-6">Discover</span>
        </ScrollReveal>
        <ScrollReveal preset="reveal" delay={0.08}>
          <h2 id="worlds-heading" className="v4-display max-w-2xl">
            Experience <span className="v4-gold-text">Worlds</span>
          </h2>
        </ScrollReveal>
        <ScrollReveal preset="fade" delay={0.14}>
          <p className="v4-standfirst mt-5 max-w-xl">
            Six immersive atmospheres — each a portal into weddings, galas, concerts, and celebrations
            crafted with cinematic precision.
          </p>
        </ScrollReveal>

        <div
          ref={gridRef}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6"
        >
          {EXPERIENCE_WORLDS.map((world) => (
            <PortalCard
              key={world.id}
              title={world.title}
              subtitle={world.subtitle}
              href={world.href}
              image={world.image}
              world={world.preset}
              onEnter={() => {
                applyWorldPreset(world.preset);
                analytics.featureClick(world.id, "home_world_portal");
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
