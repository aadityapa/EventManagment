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
  variant?: "responsive" | "symbol" | "image" | "menu";
  showTagline?: boolean;
}

export const BRAND_LOGO_ASSETS = {
  gold: {
    full: "/brand/logo-gold.svg",
    mark: "/brand/logo-mark-gold.svg",
    raster: "/brand/logo-primary.png",
  },
  light: {
    full: "/brand/logo-light.svg",
    mark: "/brand/logo-mark-light.svg",
    raster: "/brand/logo-primary.png",
  },
  symbol: "/brand/logo-symbol.png",
  favicon: "/brand/logo-symbol.png",
  /** @deprecated use gold.full */
  primary: "/brand/logo-primary.png",
  horizontal: "/brand/logo-primary.png",
} as const;

function DualThemeLogo({
  variant,
  className,
  alt = "",
  priority,
}: {
  variant: "full" | "mark";
  className?: string;
  alt?: string;
  priority?: boolean;
}) {
  const gold = variant === "mark" ? BRAND_LOGO_ASSETS.gold.mark : BRAND_LOGO_ASSETS.gold.full;
  const light = variant === "mark" ? BRAND_LOGO_ASSETS.light.mark : BRAND_LOGO_ASSETS.light.full;
  const width = variant === "mark" ? 96 : 440;
  const height = variant === "mark" ? 96 : 160;

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={gold}
        alt={alt}
        width={width}
        height={height}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        className={cn("brand-logo__theme-dark", className)}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={light}
        alt={alt}
        width={width}
        height={height}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        className={cn("brand-logo__theme-light", className)}
      />
    </>
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
      <DualThemeLogo variant="mark" priority={priority} className={cn("brand-logo__mark", className)} />
    );
  } else if (resolvedVariant === "image") {
    content = (
      <span className={cn("brand-logo inline-block", className)}>
        <DualThemeLogo variant="full" alt={SITE_CONFIG.name} priority={priority} className="brand-logo__full" />
      </span>
    );
  } else if (resolvedVariant === "menu") {
    content = (
      <span className={cn("brand-logo brand-logo--menu inline-flex items-center gap-3", className)}>
        <DualThemeLogo variant="mark" priority={priority} className="brand-logo__mark" />
        <span className="flex min-w-0 flex-col">
          <DualThemeLogo
            variant="full"
            alt={SITE_CONFIG.name}
            priority={priority}
            className="brand-logo__full brand-logo__full--menu"
          />
          {showTagline && (
            <span className="mt-2 text-[10px] font-medium uppercase tracking-[0.32em] text-[var(--footer-text-secondary,rgba(255,255,255,0.72))]">
              {SITE_CONFIG.tagline}
            </span>
          )}
        </span>
      </span>
    );
  } else {
    content = (
      <span className={cn("brand-logo brand-logo--header inline-flex min-w-0 items-center", className)}>
        <DualThemeLogo
          variant="full"
          alt={SITE_CONFIG.name}
          priority={priority}
          className="brand-logo__full"
        />
      </span>
    );
  }

  if (!href) return content;

  return (
    <Link
      href={href}
      aria-label={`${SITE_CONFIG.name} — Home`}
      className="brand-logo-link tap-target inline-flex max-w-full shrink-0 items-center transition-opacity hover:opacity-95 focus-visible:opacity-95"
    >
      {content}
    </Link>
  );
}
