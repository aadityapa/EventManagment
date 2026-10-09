import { isValidElement, type ReactNode } from "react";
import { UiIcon } from "@/components/icons";
import { JsonLd } from "@/components/ui/json-ld";
import { faqSchema } from "@/lib/seo";
import { cn } from "@/lib/utils";

export type AccordionItem = {
  id: string;
  question: string;
  answer: ReactNode | string;
  /** Plain-text answer for the FAQ schema when `answer` is rich markup. */
  answerText?: string;
};

export type AccordionProps = {
  /** `<details name>` group: opening one item closes the others. */
  name: string;
  items: AccordionItem[];
  /** Emits FAQPage JSON-LD for exactly these items. */
  schema?: boolean;
  headingLevel?: 2 | 3;
  className?: string;
};

/** Plain text of a React tree — enough for FAQ JSON-LD from simple markup. */
export function textOf(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join(" ").replace(/\s+/g, " ").trim();
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

/** Native `<details name>` accordion: no hand-rolled aria, summary ≥ 44px, plus glyph rotates when open. */
export function Accordion({ name, items, schema = false, headingLevel = 3, className }: AccordionProps) {
  const Question = `h${headingLevel}` as const;
  return (
    <>
      {schema ? (
        <JsonLd
          data={faqSchema(
            items.map((item) => ({
              question: item.question,
              answer: item.answerText ?? (typeof item.answer === "string" ? item.answer : textOf(item.answer)),
            }))
          )}
        />
      ) : null}
      <div className={cn("lux-faq", className)}>
        {items.map((item) => (
          <details key={item.id} id={item.id} name={name} className="lux-faq__item">
            <summary>
              <Question className="lux-faq__question">{item.question}</Question>
              <UiIcon name="plus" size={20} />
            </summary>
            <div className="lux-faq__body lux-measure">
              {typeof item.answer === "string" ? <p>{item.answer}</p> : item.answer}
            </div>
          </details>
        ))}
      </div>
    </>
  );
}
