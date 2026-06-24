"use client";

import Image from "next/image";
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

/** Official Nexyyra Events brand assets — master: /brand/nexyyra-logo-source.png */
export const BRAND_LOGO_ASSETS = {
  full: "/brand/nexyyra-logo.svg",
  dark: "/brand/nexyyra-logo-dark.svg",
  light: "/brand/nexyyra-logo-light.svg",
  gold: "/brand/nexyyra-logo-dark.png",
  black: "/brand/nexyyra-logo-light.png",
  primary: "/brand/nexyyra-logo-dark.png",
  horizontal: "/brand/nexyyra-logo-dark.png",
  loader: "/brand/nexyyra-logo-dark.png",
  og: "/brand/nexyyra-og.png",
  symbol: "/brand/nexyyra-monogram.svg",
  monogram: "/brand/nexyyra-monogram.png",
  favicon: "/favicon.svg",
} as const;

export const LOGO_DISPLAY_W = 56;
export const LOGO_DISPLAY_H = 56;
export const LOGO_FOOTER_H = 72;
export const LOGO_LOADER_MAX = 220;

type ThemeLogoImageProps = {
  className?: string;
  priority?: boolean;
  forceGold?: boolean;
  height?: number;
};

/** Dual SVG theme logo — CSS swap, zero hydration flash */
export function ThemeLogoImage({
  className,
  priority = true,
  forceGold = false,
  height = LOGO_DISPLAY_H,
}: ThemeLogoImageProps) {
  const width = height;

  return (
    <span
      className={cn(
        "brand-logo__slot relative block shrink-0",
        forceGold && "brand-logo--force-gold",
        className,
      )}
      style={{ width, height, minWidth: width, minHeight: height }}
    >
      <img
        src={BRAND_LOGO_ASSETS.light}
        alt={SITE_CONFIG.name}
        width={width}
        height={height}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className="brand-logo__img brand-logo__img--theme-light brand-logo__full block h-full w-full object-contain object-center"
      />
      <img
        src={BRAND_LOGO_ASSETS.dark}
        alt=""
        aria-hidden
        width={width}
        height={height}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className="brand-logo__img brand-logo__img--theme-dark brand-logo__full block h-full w-full object-contain object-center"
      />
    </span>
  );
}

/** @deprecated Use ThemeLogoImage */
export function BrandLogoImage({
  className,
  priority = true,
}: {
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return <ThemeLogoImage className={className} priority={priority} />;
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
      <Image
        src={BRAND_LOGO_ASSETS.monogram}
        alt=""
        width={48}
        height={48}
        priority={priority}
        aria-hidden
        className={cn("brand-logo__mark", className)}
      />
    );
  } else if (resolvedVariant === "loader") {
    content = (
      <span className="brand-logo__slot brand-logo__slot--loader relative block">
        <img
          src={BRAND_LOGO_ASSETS.dark}
          alt={SITE_CONFIG.name}
          width={280}
          height={280}
          fetchPriority="high"
          className={cn(
            "brand-logo__img brand-logo__img--loader relative z-[2] mx-auto max-h-[clamp(120px,28vw,220px)] w-auto max-w-full object-contain",
            className,
          )}
        />
      </span>
    );
  } else if (resolvedVariant === "footer") {
    content = (
      <span
        className={cn(
        "brand-logo brand-logo--footer inline-flex items-center justify-center transition-[filter] duration-300 hover:drop-shadow-[0_0_14px_rgba(201,162,39,0.5)] hover:[filter:drop-shadow(0_0_6px_rgba(138,43,226,0.35))]",
          className,
        )}
      >
        <ThemeLogoImage priority={false} height={LOGO_FOOTER_H} className="brand-logo__full--footer" />
      </span>
    );
  } else if (resolvedVariant === "image") {
    content = (
      <span className={cn("brand-logo inline-flex items-center justify-center", className)}>
        <ThemeLogoImage priority={priority} />
      </span>
    );
  } else if (resolvedVariant === "menu") {
    content = (
      <span className={cn("brand-logo brand-logo--menu inline-flex min-w-0 items-center gap-3", className)}>
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
      <span className={cn("brand-logo brand-logo--header inline-flex items-center justify-center", className)}>
        <ThemeLogoImage priority={priority} className="brand-logo__full--header" />
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
