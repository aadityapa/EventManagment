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

/** Official Nexyyra logos — gold + black PNG, CSS theme swap (no hydration CLS). */
export const BRAND_LOGO_ASSETS = {
  gold: "/logo.png",
  black: "/logo-black.png",
  light: "/logo-black.png",
  dark: "/logo.png",
  primary: "/logo.png",
  horizontal: "/logo.png",
  full: "/logo.png",
  loader: "/logo.png",
  symbol: "/brand/logo-symbol.png",
  favicon: "/brand/logo-symbol.png",
} as const;

const LOGO_W = 440;
const LOGO_H = 160;

type BrandLogoImageProps = {
  className?: string;
  priority?: boolean;
  sizes?: string;
};

/** Dual raster logos — CSS shows correct variant per theme without client swap. */
export function BrandLogoImage({
  className,
  priority = true,
  sizes = "(max-width: 768px) 140px, 180px",
}: BrandLogoImageProps) {
  const shared = {
    width: LOGO_W,
    height: LOGO_H,
    sizes,
    className: cn("brand-logo__img brand-logo__img--raster", className),
  };

  return (
    <>
      <Image
        src={BRAND_LOGO_ASSETS.gold}
        alt=""
        aria-hidden
        priority={priority}
        fetchPriority={priority ? "high" : "auto"}
        {...shared}
        className={cn(shared.className, "brand-logo__img--theme-dark")}
      />
      <Image
        src={BRAND_LOGO_ASSETS.black}
        alt={SITE_CONFIG.name}
        priority={priority}
        fetchPriority={priority ? "auto" : undefined}
        {...shared}
        className={cn(shared.className, "brand-logo__img--theme-light")}
      />
    </>
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
      <Image
        src={BRAND_LOGO_ASSETS.loader}
        alt={SITE_CONFIG.name}
        width={LOGO_W}
        height={LOGO_H}
        priority
        fetchPriority="high"
        className={cn("brand-logo__img brand-logo__img--loader", className)}
      />
    );
  } else if (resolvedVariant === "footer") {
    content = (
      <span className={cn("brand-logo brand-logo--footer relative inline-block", className)}>
        <BrandLogoImage priority={false} sizes="180px" className="brand-logo__full brand-logo__full--footer" />
      </span>
    );
  } else if (resolvedVariant === "image") {
    content = (
      <span className={cn("brand-logo relative inline-block", className)}>
        <BrandLogoImage priority={priority} className="brand-logo__full" />
      </span>
    );
  } else if (resolvedVariant === "menu") {
    content = (
      <span className={cn("brand-logo brand-logo--menu relative inline-flex min-w-0 items-center gap-3", className)}>
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
      <span className={cn("brand-logo brand-logo--header relative inline-flex min-w-0 items-center justify-center", className)}>
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
