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

/** Official Nexyyra logos — gold PNG for dark backgrounds, black PNG for light. */
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
  symbolLight: "/brand/logo-symbol.png",
  favicon: "/brand/logo-symbol.png",
  jpg: "/logo.jpg",
} as const;

type BrandLogoImageProps = {
  className?: string;
  priority?: boolean;
  sizes?: string;
  forceGold?: boolean;
};

function ThemeLogoImage({
  className,
  priority = true,
  sizes = "(max-width: 768px) 140px, 180px",
  forceGold = false,
}: BrandLogoImageProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isLight = mounted && resolvedTheme === "light" && !forceGold;
  const src = isLight ? BRAND_LOGO_ASSETS.black : BRAND_LOGO_ASSETS.gold;

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
      className={cn("brand-logo__img brand-logo__img--raster", className)}
    />
  );
}

/** Theme-aware header/footer logo (~180px wide, retina-ready) */
export function BrandLogoImage(props: BrandLogoImageProps) {
  return <ThemeLogoImage {...props} />;
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
        width={440}
        height={160}
        priority
        fetchPriority="high"
        unoptimized
        className={cn("brand-logo__img brand-logo__img--loader", className)}
      />
    );
  } else if (resolvedVariant === "footer") {
    content = (
      <span className={cn("brand-logo brand-logo--footer inline-block", className)}>
        <ThemeLogoImage priority={false} sizes="180px" className="brand-logo__full brand-logo__full--footer" />
      </span>
    );
  } else if (resolvedVariant === "image") {
    content = (
      <span className={cn("brand-logo inline-block", className)}>
        <ThemeLogoImage priority={priority} className="brand-logo__full" />
      </span>
    );
  } else if (resolvedVariant === "menu") {
    content = (
      <span className={cn("brand-logo brand-logo--menu inline-flex min-w-0 items-center gap-3", className)}>
        <ThemeLogoImage priority={priority} className="brand-logo__full brand-logo__full--menu" />
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
        <ThemeLogoImage priority={priority} className="brand-logo__full brand-logo__full--header" />
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
