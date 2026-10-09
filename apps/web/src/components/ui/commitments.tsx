import { BRAND_COMMITMENTS } from "@/brand/data/content";
import type { Commitment } from "@/components/ui/types";
import { cn } from "@/lib/utils";

export type CommitmentsProps = {
  /** `grid` 2×2 → 4-up, `row` one hairline row, `cover` the first three on the cover's bottom rule. */
  variant?: "row" | "grid" | "cover";
  /** Full sentence per commitment at body size (why / company pages). */
  expanded?: boolean;
  items?: Commitment[];
  className?: string;
};

/** The trust block: business-controlled policies only. No statistics, ever — hence no numeric props. */
export function Commitments({ variant = "grid", expanded = false, items = BRAND_COMMITMENTS, className }: CommitmentsProps) {
  const list = variant === "cover" ? items.slice(0, 3) : items;
  return (
    <dl className={cn("lux-commit", `lux-commit--${variant}`, expanded && "lux-commit--expanded", className)}>
      {list.map((item) => (
        <div key={item.id} className="lux-commit__cell">
          <dt>{item.term}</dt>
          <dd>{item.detail}</dd>
        </div>
      ))}
    </dl>
  );
}
