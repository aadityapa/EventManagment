import type { CSSProperties, JSX, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type RevealProps = {
  as?: keyof JSX.IntrinsicElements;
  /** Row index: keeps the stagger scroll-linked via per-row animation ranges. */
  index?: number;
  range?: "entry" | "cover";
  className?: string;
  children: ReactNode;
};

/**
 * Pure CSS scroll-driven rise (`animation-timeline: view()`); no JS and no
 * IntersectionObserver fallback — without support the element is simply visible.
 * Apply to chapter heads, ledger rows, index rows and concept cards, never to page wrappers.
 */
export function Reveal({ as = "div", index, range = "entry", className, children }: RevealProps) {
  // Typed as "div" only so JSX accepts className/style/children; the runtime tag is whatever `as` says.
  const Tag = as as "div";
  const style = index === undefined ? undefined : ({ "--i": index } as CSSProperties);
  return (
    <Tag className={cn("lux-reveal", range === "cover" && "lux-reveal--cover", className)} style={style}>
      {children}
    </Tag>
  );
}
