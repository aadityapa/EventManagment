import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  href?: string;
  priority?: boolean;
}

export function Logo({ className, iconOnly = false, href = "/", priority = false }: LogoProps) {
  const src = iconOnly ? "/logo-icon.svg" : "/logo.svg";
  const width = iconOnly ? 40 : 180;
  const height = iconOnly ? 40 : 48;

  const image = (
    <Image
      src={src}
      alt="Glitz Events & Promotions"
      width={width}
      height={height}
      priority={priority}
      className={cn("h-auto w-auto object-contain", iconOnly ? "h-9 w-9 sm:h-10 sm:w-10" : "h-10 w-auto sm:h-12", className)}
    />
  );

  if (!href) return image;

  return (
    <Link href={href} className="inline-flex shrink-0 items-center transition-opacity hover:opacity-90">
      {image}
    </Link>
  );
}
