import type { ReactNode } from "react";
import { Deck } from "@/components/ui/deck";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Heading } from "@/components/ui/heading";
import { cn } from "@/lib/utils";

export type SectionHeadProps = {
  /** The owning section's id; the title gets `{id}-title` for `aria-labelledby`. */
  id: string;
  /** Chapter folio, e.g. "01" — the one Cinzel element, sits on the hairline at ≥ lg. */
  number?: string;
  eyebrow?: string;
  title: ReactNode;
  titleAs?: "h2" | "h3";
  deck?: ReactNode;
  lead?: ReactNode;
  /** Text links only. */
  actions?: ReactNode;
  className?: string;
};

export function SectionHead({ id, number, eyebrow, title, titleAs = "h2", deck, lead, actions, className }: SectionHeadProps) {
  return (
    <div className={cn("lux-section__head lux-col-text", className)}>
      {number ? (
        <span className="lux-folio" aria-hidden="true">
          {number}
        </span>
      ) : null}
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Heading as={titleAs} size={titleAs} id={`${id}-title`}>
        {title}
      </Heading>
      {deck ? <Deck>{deck}</Deck> : null}
      {lead ? <p className="lux-lead">{lead}</p> : null}
      {actions ? <div className="lux-section__actions">{actions}</div> : null}
    </div>
  );
}
