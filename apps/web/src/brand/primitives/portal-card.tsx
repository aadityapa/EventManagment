"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandImage } from "@/brand/primitives/brand-image";
import { ComingSoonOverlay } from "@/components/media/coming-soon-overlay";
import { isComingSoonImage } from "@/lib/media/placeholders";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import { cn } from "@/lib/utils";
import type { WorldPresetId } from "@/lib/adaptive-theme/world-presets";

export type PortalCardProps = {
  title: string;
  subtitle: string;
  href: string;
  image: string;
  world: WorldPresetId;
  onEnter?: () => void;
  className?: string;
};

/**
 * V5 floating portal card — atmosphere glow on hover, links into a world/service route.
 */
export function PortalCard({
  title,
  subtitle,
  href,
  image,
  world,
  onEnter,
  className,
}: PortalCardProps) {
  const comingSoon = isComingSoonImage(image);

  return (
    <Link
      href={href}
      data-world={world}
      onClick={onEnter}
      className={cn(
        "group portal-card relative block overflow-hidden rounded-[var(--v5-radius-lg,var(--v4-radius-lg))] transition-transform duration-500 hover:-translate-y-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--glitz-gold)]",
        className
      )}
      aria-label={`Enter ${title}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[3/4]">
        <BrandImage
          src={image}
          alt=""
          fill
          sizes="(max-width: 640px) 85vw, 25vw"
          className="object-cover transition-transform duration-[1.2s] ease-[var(--v4-ease-luxe)] group-hover:scale-110"
        />
        {comingSoon ? <ComingSoonOverlay /> : null}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at 50% 80%, var(--adaptive-atmosphere, rgba(245,215,110,0.16)) 0%, transparent 70%)`,
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--v5-obsidian,#050505)]/85 via-[var(--v5-obsidian,#050505)]/25 to-transparent" />
      </div>

      <GlassPanel
        variant="portal"
        className="absolute inset-x-4 bottom-4 px-4 py-4 transition-shadow duration-500 group-hover:shadow-[var(--v4-glow-gold)]"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--glitz-gold)]">
          {subtitle}
        </p>
        <div className="mt-1 flex items-end justify-between gap-2">
          <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[var(--text-primary)] sm:text-xl">
            {title}
          </h3>
          <span className="flex shrink-0 items-center gap-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--glitz-gold)] opacity-0 transition-all duration-300 group-hover:opacity-100">
            Enter
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </span>
        </div>
      </GlassPanel>
    </Link>
  );
}
