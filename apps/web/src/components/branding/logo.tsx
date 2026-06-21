import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  href?: string;
  priority?: boolean;
}

const LOGO_PRIMARY = "/brand/logo-primary.png";
const LOGO_SYMBOL = "/brand/logo-symbol.svg";

export function Logo({ className, iconOnly = false, href = "/", priority = false }: LogoProps) {
  const image = iconOnly ? (
    <Image
      src={LOGO_SYMBOL}
      alt={SITE_CONFIG.name}
      width={48}
      height={48}
      priority={priority}
      className={cn("h-9 w-9 sm:h-10 sm:w-10", className)}
    />
  ) : (
    <Image
      src={LOGO_PRIMARY}
      alt={SITE_CONFIG.name}
      width={240}
      height={96}
      priority={priority}
      className={cn(
        "h-auto w-auto object-contain",
        "h-10 w-auto max-w-[160px] sm:h-12 sm:max-w-[200px] md:max-w-[220px]",
        className
      )}
    />
  );

  if (!href) return image;

  return (
    <Link href={href} className="inline-flex shrink-0 items-center transition-opacity hover:opacity-90">
      {image}
    </Link>
  );
}

/** Brand asset paths for social/email templates */
export const BRAND_LOGO_ASSETS = {
  primary: LOGO_PRIMARY,
  symbol: LOGO_SYMBOL,
  horizontal: "/brand/logo-horizontal.svg",
  favicon: "/brand/favicon.svg",
} as const;
