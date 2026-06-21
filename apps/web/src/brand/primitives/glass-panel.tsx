import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  /** Apply dune-glow atmospheric gradient behind the panel. */
  glow?: boolean;
  /** Use stronger glass opacity variant. Default true (liquid). */
  liquid?: boolean;
  as?: "div" | "section" | "article";
}

/**
 * V4 liquid-glass surface primitive. Wraps `.v4-glass-liquid` with optional
 * dune-glow atmosphere — use for invitation panels, stat cards, and CTAs.
 */
export function GlassPanel({
  children,
  className,
  glow = false,
  liquid = true,
  as: Tag = "div",
}: GlassPanelProps) {
  return (
    <Tag
      className={cn(
        liquid ? "v4-glass-liquid" : "v4-glass",
        glow && "v4-dune-glow",
        className
      )}
    >
      {children}
    </Tag>
  );
}
