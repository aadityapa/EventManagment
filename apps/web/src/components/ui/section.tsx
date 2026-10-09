import type { ReactNode } from "react";
import { SectionHead } from "@/components/ui/section-head";
import { cn } from "@/lib/utils";

export type SectionProps = {
  id: string;
  number?: string;
  eyebrow?: string;
  title?: ReactNode;
  titleAs?: "h2" | "h3";
  deck?: ReactNode;
  lead?: ReactNode;
  actions?: ReactNode;
  /** `plate` = `--lux-surface-1` (ledgers, inquiry, price table only). */
  tone?: "page" | "plate";
  space?: "section" | "block" | "tight";
  /** Span the full page width; the content keeps the page rails via an inner wrapper. */
  bleed?: boolean;
  /** Below-fold chapters: `content-visibility: auto`. */
  lazy?: boolean;
  className?: string;
  children?: ReactNode;
};

/** A numbered chapter: hairline top rule, folio on the rule, left-aligned head. */
export function Section({
  id,
  number,
  eyebrow,
  title,
  titleAs = "h2",
  deck,
  lead,
  actions,
  tone = "page",
  space = "section",
  bleed = false,
  lazy = false,
  className,
  children,
}: SectionProps) {
  const head = title ? (
    <SectionHead id={id} number={number} eyebrow={eyebrow} title={title} titleAs={titleAs} deck={deck} lead={lead} actions={actions} />
  ) : number ? (
    <span className="lux-folio" aria-hidden="true">
      {number}
    </span>
  ) : null;

  return (
    <section
      id={id}
      aria-labelledby={title ? `${id}-title` : undefined}
      className={cn(
        "lux-section",
        tone === "plate" && "lux-section--plate",
        space === "block" && "lux-section--tight",
        space === "tight" && "lux-section--tighter",
        bleed && "lux-bleed",
        lazy && "lux-section--lazy",
        className
      )}
    >
      {bleed ? (
        <div className="lux-section__inner">
          {head}
          {children}
        </div>
      ) : (
        <>
          {head}
          {children}
        </>
      )}
    </section>
  );
}
