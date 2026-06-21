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

const LOGO_PRIMARY = "/brand/logo-primary.png";
const LOGO_SYMBOL = "/brand/logo-symbol.png";

function GoldLogoImage({
  priority,
  className,
  sizes,
}: {
  priority?: boolean;
  className?: string;
  sizes: string;
}) {
  return (
    <Image
      src={LOGO_PRIMARY}
      alt={SITE_CONFIG.name}
      width={440}
      height={160}
      priority={priority}
      sizes={sizes}
      quality={100}
      className={cn("brand-logo-gold__img h-auto w-full object-contain", className)}
    />
  );
}

function GoldLogoMark({
  priority,
  className,
}: {
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={LOGO_SYMBOL}
      alt=""
      width={96}
      height={96}
      priority={priority}
      quality={100}
      aria-hidden
      className={cn("brand-logo-gold__mark h-12 w-12 shrink-0 object-contain", className)}
    />
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
      <GoldLogoMark priority={priority} className={className} />
    );
  } else if (resolvedVariant === "image") {
    content = (
      <span className={cn("brand-logo-gold inline-block", className)}>
        <GoldLogoImage priority={priority} sizes="220px" />
      </span>
    );
  } else if (resolvedVariant === "menu") {
    content = (
      <span className={cn("brand-logo-gold brand-logo-gold--menu inline-flex items-center gap-3", className)}>
        <GoldLogoMark priority={priority} />
        <span className="flex min-w-0 flex-col">
          <GoldLogoImage priority={priority} sizes="200px" className="max-w-[200px]" />
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
      <span className={cn("brand-logo-gold brand-logo-gold--header inline-flex min-w-0 items-center gap-2.5", className)}>
        <GoldLogoMark priority={priority} className="md:hidden" />
        <span className="brand-logo-gold__word md:hidden font-[family-name:var(--font-cinzel)] text-sm font-semibold uppercase tracking-[0.14em]">
          Nexyyra
        </span>
        <span className="brand-logo-gold__desktop hidden md:block">
          <GoldLogoImage
            priority={priority}
            sizes="(max-width: 1023px) 140px, (max-width: 1439px) 180px, 220px"
          />
        </span>
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

export const BRAND_LOGO_ASSETS = {
  primary: LOGO_PRIMARY,
  symbol: LOGO_SYMBOL,
  horizontal: LOGO_PRIMARY,
  favicon: LOGO_SYMBOL,
} as const;
