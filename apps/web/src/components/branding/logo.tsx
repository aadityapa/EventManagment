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

/** Official Nexyyra logos — light = black, dark = gold (CSS swap, no JS flash). */
export const BRAND_LOGO_ASSETS = {
  gold: "/logo-gold.png",
  goldAvif: "/logo-gold.avif",
  black: "/logo-black.png",
  blackAvif: "/logo-black.avif",
  light: "/logo-black.png",
  dark: "/logo-gold.png",
  primary: "/logo-gold.png",
  horizontal: "/logo-gold.png",
  full: "/logo-gold.png",
  loader: "/logo-gold.png",
  symbol: "/brand/logo-symbol.png",
  favicon: "/brand/logo-symbol.png",
} as const;

export const LOGO_DISPLAY_W = 180;
export const LOGO_DISPLAY_H = 60;

type ThemeLogoImageProps = {
  className?: string;
  priority?: boolean;
  /** Force gold logo (mobile menu on dark overlay). */
  forceGold?: boolean;
};

/** Dual-image theme logo — both raster assets in DOM; CSS toggles via `.dark`. */
export function ThemeLogoImage({
  className,
  priority = true,
  forceGold = false,
}: ThemeLogoImageProps) {
  const fetchPriority = priority ? "high" : "auto";

  return (
    <span
      className={cn(
        "brand-logo__slot relative block shrink-0",
        forceGold && "brand-logo--force-gold",
        className
      )}
      style={{
        width: LOGO_DISPLAY_W,
        height: LOGO_DISPLAY_H,
        minWidth: LOGO_DISPLAY_W,
        minHeight: LOGO_DISPLAY_H,
      }}
    >
      <picture className="brand-logo__img brand-logo__img--theme-light brand-logo__full">
        <source srcSet={BRAND_LOGO_ASSETS.blackAvif} type="image/avif" />
        <img
          src={BRAND_LOGO_ASSETS.black}
          alt={SITE_CONFIG.name}
          width={LOGO_DISPLAY_W}
          height={LOGO_DISPLAY_H}
          decoding="async"
          fetchPriority={fetchPriority}
          className="block h-full w-full object-contain object-center"
        />
      </picture>
      <picture className="brand-logo__img brand-logo__img--theme-dark brand-logo__full">
        <source srcSet={BRAND_LOGO_ASSETS.goldAvif} type="image/avif" />
        <img
          src={BRAND_LOGO_ASSETS.gold}
          alt=""
          aria-hidden
          width={LOGO_DISPLAY_W}
          height={LOGO_DISPLAY_H}
          decoding="async"
          fetchPriority={fetchPriority}
          className="block h-full w-full object-contain object-center"
        />
      </picture>
    </span>
  );
}

/** @deprecated Use ThemeLogoImage — kept for footer dual-stack callers migrating off CSS swap. */
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
        src={BRAND_LOGO_ASSETS.symbol}
        alt=""
        width={96}
        height={96}
        priority={priority}
        aria-hidden
        className={cn("brand-logo__mark", className)}
      />
    );
  } else if (resolvedVariant === "loader") {
    content = (
      <span
        className="brand-logo__slot relative block"
        style={{ width: LOGO_DISPLAY_W, height: LOGO_DISPLAY_H }}
      >
        <picture>
          <source srcSet={BRAND_LOGO_ASSETS.goldAvif} type="image/avif" />
          <img
            src={BRAND_LOGO_ASSETS.loader}
            alt={SITE_CONFIG.name}
            width={LOGO_DISPLAY_W}
            height={LOGO_DISPLAY_H}
            fetchPriority="high"
            className={cn("brand-logo__img brand-logo__img--loader block h-full w-full object-contain", className)}
          />
        </picture>
      </span>
    );
  } else if (resolvedVariant === "footer") {
    content = (
      <span className={cn("brand-logo brand-logo--footer inline-flex items-center justify-center", className)}>
        <ThemeLogoImage priority={false} className="brand-logo__full--footer" />
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
