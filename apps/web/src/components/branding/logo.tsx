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

/** Theme-aware SVG logo paths — use native img (SVG embeds PNG; Next/Image breaks them). */
export const BRAND_LOGO_ASSETS = {
  gold: "/logos/logo-gold.svg",
  black: "/logos/logo-black.svg",
  light: "/logos/logo-black.svg",
  dark: "/logos/logo-gold.svg",
  symbol: "/brand/logo-symbol.png",
  symbolLight: "/brand/logo-symbol.png",
  favicon: "/brand/logo-symbol.png",
  loader: "/logos/logo-gold.svg",
  primary: "/logos/logo-gold.svg",
  horizontal: "/logos/logo-gold.svg",
  full: "/logos/logo-gold.svg",
  svgGold: "/logos/logo-gold.svg",
  svgLight: "/logos/logo-black.svg",
  jpg: "/logo.jpg",
} as const;

type BrandLogoImageProps = {
  className?: string;
  priority?: boolean;
  sizes?: string;
  forceGold?: boolean;
};

function ThemeLogoImg({
  className,
  priority = true,
  forceGold = false,
}: BrandLogoImageProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isLight = mounted && resolvedTheme === "light" && !forceGold;
  const src = isLight ? BRAND_LOGO_ASSETS.black : BRAND_LOGO_ASSETS.gold;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={SITE_CONFIG.name}
      width={440}
      height={160}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className={cn("brand-logo__img brand-logo__img--svg", className)}
    />
  );
}

/** Theme-aware header/footer logo (~180px wide, retina-ready) */
export function BrandLogoImage(props: BrandLogoImageProps) {
  return <ThemeLogoImg {...props} />;
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
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={BRAND_LOGO_ASSETS.gold}
        alt={SITE_CONFIG.name}
        width={220}
        height={80}
        decoding="async"
        fetchPriority="high"
        className={cn("brand-logo__img brand-logo__img--loader", className)}
      />
    );
  } else if (resolvedVariant === "footer") {
    content = (
      <span className={cn("brand-logo brand-logo--footer inline-block", className)}>
        <ThemeLogoImg priority={false} className="brand-logo__full brand-logo__full--footer" />
      </span>
    );
  } else if (resolvedVariant === "image") {
    content = (
      <span className={cn("brand-logo inline-block", className)}>
        <ThemeLogoImg priority={priority} className="brand-logo__full" />
      </span>
    );
  } else if (resolvedVariant === "menu") {
    content = (
      <span className={cn("brand-logo brand-logo--menu inline-flex min-w-0 items-center gap-3", className)}>
        <ThemeLogoImg priority={priority} className="brand-logo__full brand-logo__full--menu" />
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
        <ThemeLogoImg priority={priority} className="brand-logo__full brand-logo__full--header" />
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
