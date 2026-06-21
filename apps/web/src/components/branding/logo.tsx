import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";

interface LogoProps {
  className?: string;
  /** @deprecated Use variant="symbol" */
  iconOnly?: boolean;
  href?: string;
  priority?: boolean;
  /** responsive = breakpoint-aware wordmark; symbol = icon only; image = legacy PNG */
  variant?: "responsive" | "symbol" | "image" | "menu";
  showTagline?: boolean;
}

const LOGO_PRIMARY = "/brand/logo-primary.png";
const LOGO_SYMBOL = "/brand/logo-symbol.png";

function LogoSymbol({
  priority,
  className,
}: {
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={LOGO_SYMBOL}
      alt=""
      width={48}
      height={48}
      priority={priority}
      aria-hidden
      className={cn(
        "brand-logo__mark h-12 w-12 shrink-0 object-contain",
        className
      )}
    />
  );
}

function ResponsiveWordmark({ showTagline }: { showTagline?: boolean }) {
  return (
    <span className="brand-logo__wordmark flex min-w-0 flex-col justify-center whitespace-nowrap">
      <span className="brand-logo__line flex items-baseline gap-[0.35em]">
        <span className="brand-logo__name font-[family-name:var(--font-cinzel)] font-semibold uppercase tracking-[0.18em] text-[var(--adaptive-text,var(--text-primary))]">
          NEXYYRA
        </span>
        <span className="brand-logo__events hidden font-[family-name:var(--font-cinzel)] font-semibold uppercase tracking-[0.18em] text-[var(--adaptive-text,var(--text-primary))] lg:inline">
          EVENTS
        </span>
      </span>
      {showTagline && (
        <span className="brand-logo__tagline mt-2 font-[family-name:var(--font-manrope)] text-[10px] font-medium uppercase tracking-[0.32em] text-[var(--adaptive-muted,var(--text-muted))]">
          {SITE_CONFIG.tagline}
        </span>
      )}
    </span>
  );
}

export function Logo({
  className,
  iconOnly = false,
  href = "/",
  priority = false,
  variant,
  showTagline = false,
}: LogoProps) {
  const resolvedVariant = variant ?? (iconOnly ? "symbol" : "responsive");

  let content: ReactNode;

  if (resolvedVariant === "symbol") {
    content = (
      <Image
        src={LOGO_SYMBOL}
        alt={SITE_CONFIG.name}
        width={48}
        height={48}
        priority={priority}
        className={cn("h-12 w-12 object-contain", className)}
      />
    );
  } else if (resolvedVariant === "image") {
    content = (
      <Image
        src={LOGO_PRIMARY}
        alt={SITE_CONFIG.name}
        width={220}
        height={80}
        priority={priority}
        className={cn("h-auto max-h-14 w-auto max-w-[220px] object-contain", className)}
      />
    );
  } else if (resolvedVariant === "menu") {
    content = (
      <span className={cn("brand-logo brand-logo--menu inline-flex items-start gap-3", className)}>
        <LogoSymbol priority={priority} />
        <ResponsiveWordmark showTagline={showTagline} />
      </span>
    );
  } else {
    content = (
      <span
        className={cn(
          "brand-logo brand-logo--header inline-flex min-w-0 items-center gap-2.5 [container-type:inline-size]",
          className
        )}
      >
        <LogoSymbol priority={priority} className="md:hidden" />
        <ResponsiveWordmark />
      </span>
    );
  }

  if (!href) return content;

  return (
    <Link
      href={href}
      aria-label={`${SITE_CONFIG.name} — Home`}
      className="brand-logo-link tap-target inline-flex max-w-full shrink-0 items-center transition-opacity hover:opacity-90 focus-visible:opacity-90"
    >
      {content}
    </Link>
  );
}

/** Brand asset paths for social/email templates */
export const BRAND_LOGO_ASSETS = {
  primary: LOGO_PRIMARY,
  symbol: LOGO_SYMBOL,
  horizontal: LOGO_PRIMARY,
  favicon: LOGO_SYMBOL,
} as const;
