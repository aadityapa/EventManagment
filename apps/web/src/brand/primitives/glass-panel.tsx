import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  /** Apply dune-glow atmospheric gradient behind the panel. */
  glow?: boolean;
  /** Use stronger glass opacity variant. Default true (liquid). */
  liquid?: boolean;
  /** V5 variant — portal (strong blur) or commission (warm sand tint). */
  variant?: "standard" | "liquid" | "portal" | "commission";
  as?: "div" | "section" | "article";
}

const VARIANT_CLASS: Record<NonNullable<GlassPanelProps["variant"]>, string> = {
  standard: "v5-glass v4-glass",
  liquid: "v5-glass-liquid v4-glass-liquid",
  portal: "v5-glass-portal",
  commission: "v5-glass-commission",
};

/**
 * V5 liquid-glass surface primitive. Wraps dune-glow atmosphere — use for
 * invitation panels, stat cards, dashboard tiles, and CTAs.
 */
export function GlassPanel({
  children,
  className,
  glow = false,
  liquid = true,
  variant,
  as: Tag = "div",
}: GlassPanelProps) {
  const resolved = variant ?? (liquid ? "liquid" : "standard");

  return (
    <Tag
      className={cn(
        VARIANT_CLASS[resolved],
        glow && "v5-dune-glow v4-dune-glow",
        className
      )}
    >
      {children}
    </Tag>
  );
}
