"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { BRAND_BLUR, LOCAL_IMAGE_FALLBACK as BRAND_FALLBACK } from "@/brand/data/image-placeholders";
import { cn } from "@/lib/utils";

type BrandImageProps = Omit<ImageProps, "onError"> & {
  /** Curated focal point (0–1) → `object-position`, so portrait crops of 3:2 frames stay safe. */
  focal?: { x: number; y: number };
};

export function BrandImage({ src, alt, className, placeholder = "blur", blurDataURL = BRAND_BLUR, focal, style, ...props }: BrandImageProps) {
  const [current, setCurrent] = useState(src);
  const objectPosition = focal ? `${Math.round(focal.x * 100)}% ${Math.round(focal.y * 100)}%` : undefined;
  return (
    <Image
      {...props}
      src={current}
      alt={alt}
      className={cn("object-cover", className)}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      style={objectPosition ? { ...style, objectPosition } : style}
      onError={() => { if (current !== BRAND_FALLBACK) setCurrent(BRAND_FALLBACK); }}
    />
  );
}
