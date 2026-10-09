import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The page's one editorial intro line: roman Cormorant, no quotation marks,
 * no attribution — house copy, never a testimonial. Pages assert "one per page".
 */
export function Deck({ className, children }: { className?: string; children: ReactNode }) {
  return <p className={cn("lux-deck", className)}>{children}</p>;
}
