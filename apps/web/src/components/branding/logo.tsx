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
  variant?: "responsive" | "symbol" | "image" | "menu";
  showTagline?: boolean;
}

/** Official Nexyyra raster logos — always preloaded, never lazy */
export const BRAND_LOGO_ASSETS = {
  gold: "/logo.png",
  dark: "/logo.png",
  jpg: "/logo.jpg",
  symbol: "/brand/logo-symbol.png",
  favicon: "/brand/logo-symbol.png",
  /** @deprecated use gold */
  primary: "/logo.png",
  horizontal: "/logo.png",
  full: "/logo.png",
} as const;

type BrandLogoImageProps = {
  className?: string;
  priority?: boolean;
  sizes?: string;
};

/** Theme-aware logo — one optimized image, CSS handles contrast per theme. */
export function BrandLogoImage({ className, priority = true, sizes = "(max-width: 768px) 140px, 220px" }: BrandLogoImageProps) {
  return (
    <Image
      src={BRAND_LOGO_ASSETS.gold}
      alt={SITE_CONFIG.name}
      width={440}
      height={160}
      priority={priority}
      fetchPriority="high"
      sizes={sizes}
      quality={100}
      className={cn("brand-logo__img brand-logo__img--theme-aware", className)}
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
        aria-hidden
        className={cn("brand-logo__mark", className)}
      />
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
