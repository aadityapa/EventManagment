import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ProseProps = {
  /** `text` = 44rem articles/legal/FAQ answers, `wide` = 72rem. */
  measure?: "text" | "wide";
  size?: "body" | "lead";
  /** Playfair gold drop cap on the first paragraph — essays and articles only. */
  dropcap?: boolean;
  as?: "div" | "article";
  id?: string;
  className?: string;
  children: ReactNode;
};

/** Running copy: Manrope body, gold link underlines, numbered h2/h3 inside via CSS counters. */
export function Prose({ measure = "text", size = "body", dropcap = false, as: Tag = "div", id, className, children }: ProseProps) {
  return (
    <Tag
      id={id}
      className={cn(
        "lux-prose",
        measure === "wide" ? "lux-wide" : "lux-measure",
        size === "lead" && "lux-prose--lead",
        dropcap && "lux-dropcap",
        className
      )}
    >
      {children}
    </Tag>
  );
}
