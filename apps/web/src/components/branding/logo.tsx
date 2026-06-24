"use client";

/* Self-contained base64 SVG logos render via <img>; next/image would route
   SVGs through the optimizer (disabled for SVG). <img> is intentional here. */
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";

interface LogoProps {
  className?: string;
  /** @deprecated Use variant="symbol" */
  iconOnly?: boolean;
  href?: string;
  priority?: boolean;
  variant?: "responsive" | "symbol" | "image" | "menu" | "loader" | "footer";
  showTagline?: boolean;
}

/**
 * Official Nexyyra Events brand assets.
 * Source: scripts/assets/nexyyra-logo-raw.png -> scripts/generate-brand-assets.mjs.
 * SVGs are self-contained (base64-embedded transparent raster) so they render
 * correctly inside <img> tags with no external-reference blocking and no
 * checkerboard/opaque background.
 */
export const BRAND_LOGO_ASSETS = {
  full: "/brand/nexyyra-logo.svg",
  dark: "/brand/nexyyra-logo-dark.svg",
  light: "/brand/nexyyra-logo-light.svg",
  loader: "/brand/nexyyra-logo-dark.svg",
  og: "/brand/nexyyra-og.png",
  symbol: "/brand/nexyyra-monogram.svg",
  favicon: "/favicon.svg",
} as const;

type ThemeLogoImageProps = {
  className?: string;
  priority?: boolean;
  forceGold?: boolean;
  /** Fluid = width-driven (footer); otherwise height-driven square slot. */
  fluid?: boolean;
};

/** Dual-theme logo — CSS opacity swap, zero hydration flash, fully transparent. */
export function ThemeLogoImage({
  className,
  priority = true,
  forceGold = false,
  fluid = false,
}: ThemeLogoImageProps) {
  const fetchPriority = priority ? "high" : "auto";

  return (
    <span
      className={cn(
        "brand-logo__slot",
        fluid && "brand-logo__slot--fluid",
        forceGold && "brand-logo--force-gold",
        className,
      )}
    >
      <img
        src={BRAND_LOGO_ASSETS.light}
        alt={SITE_CONFIG.name}
        decoding="async"
        fetchPriority={fetchPriority}
        className="brand-logo__img brand-logo__img--theme-light"
      />
      <img
        src={BRAND_LOGO_ASSETS.dark}
        alt=""
        aria-hidden
        decoding="async"
        fetchPriority={fetchPriority}
        className="brand-logo__img brand-logo__img--theme-dark"
      />
    </span>
  );
}

export function Logo({
  className,
  iconOnly = false,
  href = "/",
  priority = true,
  variant,
  showTagline = false,
}: LogoProps) {
  const resolvedVariant = variant ?? (iconOnly ? "symbol" : "responsive");

  let content: ReactNode;

  if (resolvedVariant === "symbol") {
    content = (
      <img
        src={BRAND_LOGO_ASSETS.symbol}
        alt={SITE_CONFIG.name}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className={cn("brand-logo__mark", className)}
      />
    );
  } else if (resolvedVariant === "loader") {
    content = (
      <img
        src={BRAND_LOGO_ASSETS.loader}
        alt={SITE_CONFIG.name}
        fetchPriority="high"
        className={cn("brand-logo__img brand-logo__img--loader", className)}
      />
    );
  } else if (resolvedVariant === "footer") {
    content = (
      <span className={cn("brand-logo brand-logo--footer", className)}>
        <ThemeLogoImage priority={false} fluid />
      </span>
    );
  } else if (resolvedVariant === "image") {
    content = (
      <span className={cn("brand-logo", className)}>
        <ThemeLogoImage priority={priority} />
      </span>
    );
  } else if (resolvedVariant === "menu") {
    content = (
      <span className={cn("brand-logo brand-logo--menu", className)}>
        <ThemeLogoImage priority={priority} forceGold />
        {showTagline && (
          <span className="mt-2 text-[10px] font-medium uppercase tracking-[0.32em] text-[var(--footer-text-secondary,rgba(255,255,255,0.72))]">
            {SITE_CONFIG.tagline}
          </span>
        )}
      </span>
    );
  } else {
    content = (
      <span className={cn("brand-logo brand-logo--header", className)}>
        <ThemeLogoImage priority={priority} />
      </span>
    );
  }

  if (!href) return content;

  return (
    <Link
      href={href}
      aria-label={`${SITE_CONFIG.name} — Home`}
      className="brand-logo-link tap-target inline-flex shrink-0 items-center justify-center overflow-visible transition-opacity hover:opacity-95 focus-visible:opacity-95"
    >
      {content}
    </Link>
  );
}
