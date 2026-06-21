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

/** Official Nexyyra SVG logos — theme-aware, retina-ready */
export const BRAND_LOGO_ASSETS = {
  gold: "/brand/logo-gold.svg",
  light: "/brand/logo-light.svg",
  dark: "/brand/logo-gold.svg",
  symbol: "/brand/logo-mark-gold.svg",
  symbolLight: "/brand/logo-mark-light.svg",
  favicon: "/brand/logo-mark-gold.svg",
  /** Loader always uses gold on black */
  loader: "/brand/logo-gold.svg",
  /** @deprecated use gold */
  primary: "/brand/logo-gold.svg",
  horizontal: "/brand/logo-gold.svg",
  full: "/brand/logo-gold.svg",
  jpg: "/logo.jpg",
} as const;

type BrandLogoImageProps = {
  className?: string;
  priority?: boolean;
  sizes?: string;
  forceGold?: boolean;
};

/** Theme-aware SVG logo */
export function BrandLogoImage({
  className,
  priority = true,
  sizes = "(max-width: 768px) 140px, 220px",
  forceGold = false,
}: BrandLogoImageProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isLight = mounted && resolvedTheme === "light" && !forceGold;
  const src = isLight ? BRAND_LOGO_ASSETS.light : BRAND_LOGO_ASSETS.gold;

  return (
    <Image
      src={src}
      alt={SITE_CONFIG.name}
      width={440}
      height={160}
      priority={priority}
      fetchPriority={priority ? "high" : undefined}
      sizes={sizes}
      unoptimized
      className={cn("brand-logo__img brand-logo__img--svg", className)}
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
  const symbolSrc = isLight ? BRAND_LOGO_ASSETS.symbolLight : BRAND_LOGO_ASSETS.symbol;

  let content: ReactNode;

  if (resolvedVariant === "symbol") {
    content = (
      <Image
        src={symbolSrc}
        alt=""
        width={96}
        height={96}
        priority={priority}
        fetchPriority="high"
        unoptimized
        aria-hidden
        className={cn("brand-logo__mark", className)}
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
      <span className={cn("brand-logo brand-logo--header inline-flex min-w-0 items-center", className)}>
        <BrandLogoImage priority={priority} className="brand-logo__full" />
      </span>
    );
  }

  if (!href) return content;

  return (
    <Link
      href={href}
      aria-label={`${SITE_CONFIG.name} — Home`}
      className="brand-logo-link tap-target inline-flex max-w-full shrink-0 items-center overflow-visible transition-opacity hover:opacity-95 focus-visible:opacity-95"
    >
      {content}
    </Link>
  );
}
