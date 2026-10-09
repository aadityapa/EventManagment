import Link from "next/link";
import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { UiIcon } from "@/components/icons";
import type { CtaProps } from "@/components/ui/types";
import { cn } from "@/lib/utils";

export type ButtonProps = CtaProps & {
  /** `primary` is the one purple action per viewport (a page responsibility). */
  variant?: "primary" | "ghost" | "text";
  size?: "md" | "compact" | "full";
  /** Renders a `<Link>` (or a plain `<a>` for tel:/mailto:/external URLs) instead of a `<button>`. */
  href?: string;
  /** Merge the classes and data attributes into the single child element instead of rendering a tag. */
  asChild?: boolean;
  /** Appends the long arrow glyph, translated 6px on hover. */
  arrow?: boolean;
  icon?: ReactNode;
  external?: boolean;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
  children: ReactNode;
};

const VARIANT_CLASS = {
  primary: "luxury-button--purple",
  ghost: "luxury-button--ghost",
  text: "luxury-button--text",
} as const;

const SIZE_CLASS = { md: "", compact: "luxury-button--compact", full: "luxury-button--full" } as const;

const PROTOCOL_LINK = /^(?:https?:|mailto:|tel:|sms:)/i;

/**
 * The site button. Stateless, so it stays a server component: analytics fire
 * from the delegated `[data-cta]` click handler in AnalyticsProvider — never
 * from an onClick here.
 */
export function Button({
  variant = "ghost",
  size = "md",
  href,
  asChild = false,
  arrow = false,
  icon,
  cta,
  location,
  external = false,
  type = "button",
  disabled,
  id,
  className,
  "aria-label": ariaLabel,
  children,
}: ButtonProps) {
  const cls = cn("luxury-button", VARIANT_CLASS[variant], SIZE_CLASS[size], arrow && "luxury-button--arrow", className);
  // V7: the primary action drifts toward a fine pointer (MotionRuntime); inert elsewhere.
  const data = { "data-cta": cta, "data-cta-location": location, ...(variant === "primary" && !disabled ? { "data-magnetic": "" } : {}) };

  if (asChild) {
    // cloneElement instead of Radix Slot: no hooks, so it renders in the RSC runtime.
    if (!isValidElement(children)) return null;
    const child = children as ReactElement<Record<string, unknown>>;
    return cloneElement(child, { ...data, id, className: cn(child.props.className as string | undefined, cls) });
  }

  const content = (
    <>
      {icon}
      {children}
      {arrow ? <UiIcon name="arrow-right" size={20} className="lux-icon-arrow" /> : null}
    </>
  );

  if (href) {
    if (external || PROTOCOL_LINK.test(href)) {
      return (
        <a
          id={id}
          href={href}
          className={cls}
          aria-label={ariaLabel}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          {...data}
        >
          {content}
        </a>
      );
    }
    return (
      <Link id={id} href={href} className={cls} aria-label={ariaLabel} {...data}>
        {content}
      </Link>
    );
  }

  return (
    <button id={id} type={type} disabled={disabled} className={cls} aria-label={ariaLabel} {...data}>
      {content}
    </button>
  );
}
