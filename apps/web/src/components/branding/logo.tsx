import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  href?: string;
  priority?: boolean;
}

const LOGO_SRC = "/logo.jpg";

export function Logo({ className, iconOnly = false, href = "/", priority = false }: LogoProps) {
  const image = (
    <Image
      src={LOGO_SRC}
      alt="Glitz Events & Promotions"
      width={iconOnly ? 48 : 240}
      height={iconOnly ? 48 : 96}
      priority={priority}
      className={cn(
        "h-auto w-auto object-contain",
        iconOnly ? "h-9 w-9 rounded-md sm:h-10 sm:w-10" : "h-10 w-auto max-w-[160px] sm:h-12 sm:max-w-[200px] md:max-w-[220px]",
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
