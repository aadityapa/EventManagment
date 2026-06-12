"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { analytics } from "@/lib/analytics";
import type { GlitzFaq } from "@/brand/data/faq";

type BrandFaqAccordionProps = {
  items: GlitzFaq[];
  /** Analytics location slug, e.g. "home_faq" */
  location?: string;
  className?: string;
};

export function BrandFaqAccordion({ items, location, className }: BrandFaqAccordionProps) {
  const handleValueChange = (value: string) => {
    if (!value || !location) return;
    const index = Number(value.replace("item-", ""));
    const item = items[index];
    if (item) {
      analytics.featureClick(`faq_${item.question.slice(0, 40)}`, location);
    }
  };

  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      className={cn("w-full space-y-3", className)}
      onValueChange={handleValueChange}
    >
      {items.map((faq, i) => (
        <AccordionPrimitive.Item
          key={faq.question}
          value={`item-${i}`}
          className="group overflow-hidden rounded-xl border border-[var(--glitz-border)] bg-[var(--glitz-card)] transition-all duration-300 data-[state=open]:border-[var(--glitz-gold)]/50 data-[state=open]:shadow-[var(--shadow-glow-gold-sm)]"
        >
          <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger
              className={cn(
                "flex flex-1 items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-[var(--glitz-text)] transition-colors sm:px-6 sm:py-5 sm:text-base",
                "hover:text-[var(--glitz-gold)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glitz-gold)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--glitz-bg)]",
                "data-[state=open]:text-[var(--glitz-gold)]",
                "[&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg]:text-[var(--glitz-gold)]"
              )}
            >
              {faq.question}
              <ChevronDown
                className="h-4 w-4 shrink-0 text-[var(--glitz-muted)] transition-transform duration-300"
                aria-hidden="true"
              />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content
            className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
          >
            <div className="border-t border-[var(--glitz-gold)]/15 px-5 pb-5 pt-4 leading-relaxed text-[var(--glitz-muted)] sm:px-6 sm:pb-6">
              {faq.answer}
            </div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
