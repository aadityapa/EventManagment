import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type MarqueeItem = { label: string; href?: string; icon?: ReactNode };

export type MarqueeProps = {
  items: MarqueeItem[];
  /** Names the strip for assistive tech, e.g. "All twelve services". */
  ariaLabel: string;
  /** Seconds for one full loop of the track (default 60). */
  speed?: number;
  /** `data-cta-location` for the item links. */
  location?: string;
  className?: string;
};

function Track({ items, location, duplicate }: { items: MarqueeItem[]; location: string; duplicate?: boolean }) {
  return (
    <ul className="lux-marquee__track" role="list" aria-hidden={duplicate || undefined}>
      {items.map((item) => {
        const body = (
          <>
            {item.icon ? <span className="lux-marquee__icon">{item.icon}</span> : null}
            <span className="lux-marquee__label">{item.label}</span>
          </>
        );
        return (
          <li key={item.label} className="lux-marquee__item">
            {item.href ? (
              <Link
                href={item.href}
                prefetch={false}
                className="lux-marquee__link"
                // The duplicate exists only to close the loop: out of the tab order and the a11y tree.
                tabIndex={duplicate ? -1 : undefined}
                data-cta={duplicate ? undefined : `marquee_${item.href.split("/").pop()}`}
                data-cta-location={duplicate ? undefined : location}
              >
                {body}
              </Link>
            ) : (
              <span className="lux-marquee__link">{body}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * V7 ticker (server component). Decoration over information already on the
 * page: a duplicated track loops slowly, pauses on hover and focus, and has a
 * visible pause/play button (WCAG 2.2.2) wired by the MotionRuntime's
 * delegated `[data-marquee-toggle]` handler. Keyboard focus switches it to a
 * still, scrollable strip so the focused link is always in view; under
 * reduced motion it is that still strip from the start.
 */
export function Marquee({ items, ariaLabel, speed = 60, location = "marquee", className }: MarqueeProps) {
  if (!items.length) return null;
  return (
    <div
      className={cn("lux-marquee lux-bleed", className)}
      role="group"
      aria-label={ariaLabel}
      style={{ "--lux-marquee-dur": `${speed}s` } as CSSProperties}
    >
      <div className="lux-marquee__viewport">
        <Track items={items} location={location} />
        <Track items={items} location={location} duplicate />
      </div>
      <button type="button" className="lux-marquee__toggle" aria-pressed="false" data-marquee-toggle aria-label="Pause the moving list">
        <svg className="lux-marquee__glyph lux-marquee__glyph--pause" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
          <path d="M9 6v12M15 6v12" />
        </svg>
        <svg className="lux-marquee__glyph lux-marquee__glyph--play" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
          <path d="M8 5.5v13l10.5-6.5z" />
        </svg>
      </button>
    </div>
  );
}
