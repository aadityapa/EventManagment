"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState, type ReactNode } from "react";
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
 * Official Nexyyra brand logos — raster PNG (retina-ready), theme-aware via CSS.
 * SVG wrappers under /brand/*.svg embed PNG via <image href> which fails when loaded
 * through Next/Image; use PNG sources directly for reliable rendering.
 */
export const BRAND_LOGO_ASSETS = {
  gold: "/brand/logo-primary.png",
  light: "/brand/logo-primary.png",
  dark: "/brand/logo-primary.png",
  symbol: "/brand/logo-symbol.png",
  symbolLight: "/brand/logo-symbol.png",
  favicon: "/brand/logo-symbol.png",
  /** Loader — gold mark on black cinematic background */
  loader: "/brand/logo-primary.png",
  /** Alias paths for legacy references */
  primary: "/brand/logo-primary.png",
  horizontal: "/brand/logo-primary.png",
  full: "/brand/logo-primary.png",
  svgGold: "/brand/logo-gold.svg",
  svgLight: "/brand/logo-light.svg",
  jpg: "/logo.jpg",
} as const;

type BrandLogoImageProps = {
  className?: string;
  priority?: boolean;
  sizes?: string;
  forceGold?: boolean;
};

/** Theme-aware header/footer logo (~180px wide, retina-ready) */
export function BrandLogoImage({
  className,
  priority = true,
  sizes = "(max-width: 768px) 140px, 180px",
  forceGold = false,
}: BrandLogoImageProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isLight = mounted && resolvedTheme === "light" && !forceGold;

  return (
    <Image
      src={BRAND_LOGO_ASSETS.primary}
      alt={SITE_CONFIG.name}
      width={440}
      height={160}
      priority={priority}
      fetchPriority={priority ? "high" : undefined}
      sizes={sizes}
      unoptimized
      className={cn(
        "brand-logo__img brand-logo__img--raster",
        isLight && "brand-logo__img--light-theme",
        className
      )}
    />
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
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isLight = mounted && resolvedTheme === "light";

  let content: ReactNode;

  if (resolvedVariant === "symbol") {
    content = (
      <Image
        src={BRAND_LOGO_ASSETS.symbol}
        alt=""
        width={96}
        height={96}
        priority={priority}
        fetchPriority="high"
        unoptimized
        aria-hidden
        className={cn(
          "brand-logo__mark",
          isLight && "brand-logo__img--light-theme",
          className
        )}
      />
    );
  } else if (resolvedVariant === "loader") {
    content = (
      <Image
        src={BRAND_LOGO_ASSETS.loader}
        alt={SITE_CONFIG.name}
        width={880}
        height={320}
        priority
        fetchPriority="high"
        unoptimized
        className={cn("brand-logo__img brand-logo__img--loader", className)}
      />
    );
  } else if (resolvedVariant === "footer") {
    content = (
      <span className={cn("brand-logo brand-logo--footer inline-block", className)}>
        <BrandLogoImage priority={false} sizes="180px" className="brand-logo__full brand-logo__full--footer" />
      </span>
    );
  } else if (resolvedVariant === "image") {
    content = (
      <span className={cn("brand-logo inline-block", className)}>
        <BrandLogoImage priority={priority} className="brand-logo__full" />
      </span>
    );
  } else if (resolvedVariant === "menu") {
    content = (
      <span className={cn("brand-logo brand-logo--menu inline-flex min-w-0 items-center gap-3", className)}>
        <BrandLogoImage priority={priority} className="brand-logo__full brand-logo__full--menu" />
        {showTagline && (
          <span className="mt-2 text-[10px] font-medium uppercase tracking-[0.32em] text-[var(--footer-text-secondary,rgba(255,255,255,0.72))]">
            {SITE_CONFIG.tagline}
          </span>
        )}
      </span>
    );
  } else {
    content = (
      <span className={cn("brand-logo brand-logo--header inline-flex min-w-0 items-center justify-center", className)}>
        <BrandLogoImage priority={priority} className="brand-logo__full brand-logo__full--header" />
      </span>
    );
  }

  if (!href) return content;

  return (
    <Link
      href={href}
      aria-label={`${SITE_CONFIG.name} — Home`}
      className="brand-logo-link tap-target inline-flex max-w-full shrink-0 items-center justify-center overflow-visible transition-opacity hover:opacity-95 focus-visible:opacity-95"
    >
      {content}
    </Link>
  );
}
