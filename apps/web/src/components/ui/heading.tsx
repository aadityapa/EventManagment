import type { ReactNode } from "react";
import { ViewTransition } from "@/components/ui/view-transition";
import { cn } from "@/lib/utils";

export type HeadingProps = {
  as: "h1" | "h2" | "h3";
  /** Defaults to `display` for h1, otherwise the tag's own size. */
  size?: "display-xl" | "display" | "h2" | "h3";
  /** One word (or phrase) wrapped in `.lux-accent-purple` — allowed once per page, H1 only. Needs string children. */
  accent?: string;
  id?: string;
  /** Shared-element name for a morph (e.g. `service-title-{slug}`). */
  viewTransitionName?: string;
  className?: string;
  children: ReactNode;
};

function withAccent(children: ReactNode, accent?: string): ReactNode {
  if (!accent || typeof children !== "string") return children;
  const at = children.indexOf(accent);
  if (at < 0) return children;
  return (
    <>
      {children.slice(0, at)}
      <span className="lux-accent-purple">{accent}</span>
      {children.slice(at + accent.length)}
    </>
  );
}

export function Heading({ as: Tag, size, accent, id, viewTransitionName, className, children }: HeadingProps) {
  const resolved = size ?? (Tag === "h1" ? "display" : Tag);
  const el = (
    <Tag id={id} className={cn("lux-heading", `lux-heading--${resolved}`, className)}>
      {withAccent(children, accent)}
    </Tag>
  );
  return viewTransitionName ? <ViewTransition name={viewTransitionName}>{el}</ViewTransition> : el;
}
