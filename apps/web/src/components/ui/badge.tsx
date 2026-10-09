import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({ tone = "neutral", className, children }: { tone?: "neutral" | "gold"; className?: string; children: ReactNode }) {
  return <span className={cn("lux-badge", tone === "gold" && "lux-badge--gold", className)}>{children}</span>;
}

/**
 * The honesty label on every illustrative case study. Fixed text, no props —
 * it cannot be renamed or omitted where a concept is shown.
 */
export function ConceptTag() {
  return (
    <span className="lux-concept-tag" title="Illustrative concept, not a delivered event">
      Concept
    </span>
  );
}
