import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type CardProps = {
  /** Solid surface level: 1 plates/ledgers, 2 inputs/panels, 3 toasts/row tint. */
  level: 1 | 2 | 3;
  /** Navy glass + blur — permitted only over photography (lightbox counter), never in the reading flow. */
  glass?: boolean;
  /** Hover: border turns gold, lifts 2px (hover-capable devices only). */
  interactive?: boolean;
  as?: "div" | "article" | "li";
  padding?: "sm" | "md" | "lg";
  className?: string;
  children: ReactNode;
};

export function Card({ level, glass = false, interactive = false, as: Tag = "div", padding = "md", className, children }: CardProps) {
  return (
    <Tag
      className={cn(
        `lux-card--l${level}`,
        glass && "lux-card--glass",
        interactive && "lux-card--interactive",
        `lux-card--pad-${padding}`,
        className
      )}
    >
      {children}
    </Tag>
  );
}
