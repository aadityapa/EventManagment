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
const LOGO_SYMBOL = "/brand/logo-symbol.png";

export function Logo({ className, iconOnly = false, href = "/", priority = false }: LogoProps) {
  const image = iconOnly ? (
    <Image
      src={LOGO_SYMBOL}
      alt={SITE_CONFIG.name}
      width={56}
      height={56}
      priority={priority}
      className={cn("h-10 w-10 object-contain sm:h-11 sm:w-11", className)}
    />
  ) : (
    <Image
      src={LOGO_PRIMARY}
      alt={SITE_CONFIG.name}
      width={200}
      height={120}
      priority={priority}
      className={cn(
        "h-auto w-auto object-contain",
        "h-12 w-auto max-w-[140px] sm:h-14 sm:max-w-[168px] md:max-w-[180px]",
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
  horizontal: LOGO_PRIMARY,
  favicon: LOGO_SYMBOL,
} as const;
