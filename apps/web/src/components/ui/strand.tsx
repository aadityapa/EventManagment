import { useId, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { StrandNav } from "@/components/ui/strand-nav";

type StrandProps = {
  as?: "ul" | "div";
  ariaLabel: string;
  /** Item width on phones (CSS length); default `78vw`. */
  itemWidth?: string;
  snap?: "mandatory" | "proximity";
  /** Mounts the StrandNav island and keeps the strip scrollable at every width. */
  nav?: boolean;
  id?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Horizontal, user-driven strip: scroll-snap on phones, a 12-column grid from
 * 768px unless `nav` (then it stays a scroller with prev/next on hover devices).
 * Children are the items (`<li>` when `as="ul"`). Never auto-scrolls.
 */
export function Strand({ as: Tag = "ul", ariaLabel, itemWidth, snap = "proximity", nav = false, id, className, children }: StrandProps) {
  const autoId = useId();
  const strandId = id ?? `strand-${autoId}`;
  const style = itemWidth ? ({ "--lux-strand-item": itemWidth } as CSSProperties) : undefined;
  return (
    <div className={cn("lux-strand-wrap", nav && "lux-strand-wrap--nav", className)}>
      <Tag
        id={strandId}
        className={cn("lux-strand", `lux-strand--${snap}`, nav && "lux-strand--nav")}
        role={Tag === "div" ? "group" : undefined}
        aria-label={ariaLabel}
        style={style}
      >
        {children}
      </Tag>
      {nav ? <StrandNav targetId={strandId} /> : null}
    </div>
  );
}
