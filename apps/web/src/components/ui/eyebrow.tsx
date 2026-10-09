import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type EyebrowProps = {
  as?: "p" | "span";
  /** `both` (default): leading rule on phones, both rules from md. `leading` keeps one rule everywhere. */
  rule?: "leading" | "both" | "none";
  id?: string;
  className?: string;
  children: ReactNode;
};

/** Gold Manrope caps — the existing `.lux-label` with its rule modifiers. */
export function Eyebrow({ as: Tag = "p", rule = "both", id, className, children }: EyebrowProps) {
  return (
    <Tag
      id={id}
      className={cn("lux-label", rule === "leading" && "lux-label--rule-leading", rule === "none" && "lux-label--rule-none", className)}
    >
      {children}
    </Tag>
  );
}
