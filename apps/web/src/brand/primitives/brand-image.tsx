"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { BRAND_BLUR, BRAND_FALLBACK } from "@/brand/data/imagery";
import { cn } from "@/lib/utils";

type BrandImageProps = Omit<ImageProps, "onError">;

export function BrandImage({ src, alt, className, placeholder = "blur", blurDataURL = BRAND_BLUR, ...props }: BrandImageProps) {
  const [current, setCurrent] = useState(src);
  return (
    <Image
      {...props}
      src={current}
      alt={alt}
      className={cn("object-cover", className)}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      onError={() => { if (current !== BRAND_FALLBACK) setCurrent(BRAND_FALLBACK); }}
    />
  );
}
