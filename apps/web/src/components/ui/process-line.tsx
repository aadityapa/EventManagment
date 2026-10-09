import type { CSSProperties } from "react";
import { BRAND_PROCESS_STEPS } from "@/brand/data/content";
import { cn } from "@/lib/utils";

type Step = { step: string; title: string; desc: string };

type ProcessLineProps = {
  steps?: readonly Step[];
  /** `full` = numeral column + two text columns at ≥ 1024; `compact` keeps title and copy stacked. */
  variant?: "full" | "compact";
  columns?: 1 | 2;
  className?: string;
};

/**
 * The five-step method as an ordered list. A 1px gold rail draws down the
 * list on scroll and each numeral turns gold as it enters (CSS only, see
 * primitives-complex.css); without support or under reduced motion both
 * render fully drawn.
 */
export function ProcessLine({ steps = BRAND_PROCESS_STEPS, variant = "full", columns = 1, className }: ProcessLineProps) {
  return (
    <ol className={cn("lux-process", `lux-process--${variant}`, columns === 2 && "lux-process--cols-2", className)} role="list">
      {steps.map((s, i) => (
        <li key={s.step} className="lux-process__step lux-reveal" style={{ "--i": i } as CSSProperties}>
          <span className="lux-process__num" aria-hidden="true">{s.step}</span>
          <h3 className="lux-process__title">{s.title}</h3>
          <p className="lux-process__copy">{s.desc}</p>
        </li>
      ))}
    </ol>
  );
}
