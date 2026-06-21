"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import type { MediaAsset } from "@/lib/media/types";
import { pickBestVariantSrc } from "@/lib/media/utils";
import { BRAND_BLUR, BRAND_FALLBACK } from "@/brand/data/imagery";
import { cn } from "@/lib/utils";

type Props = Omit<ImageProps, "src" | "blurDataURL" | "placeholder" | "alt"> & {
  asset: MediaAsset;
  targetWidth?: number;
  fallbackSrc?: string;
  alt?: string;
};

/**
 * Next.js Image wrapper with manifest blur + WebP variants.
 * Lazy loads by default; pass priority for LCP images.
 */
export function OptimizedMediaImage({
  asset,
  targetWidth = 1200,
  className,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  loading,
  priority,
  fallbackSrc = BRAND_FALLBACK,
  alt,
  ...props
}: Props) {
  const [current, setCurrent] = useState(pickBestVariantSrc(asset, targetWidth));

  return (
    <Image
      {...props}
      src={current}
      alt={alt ?? asset.alt}
      sizes={sizes}
      placeholder="blur"
      blurDataURL={asset.blurDataURL || BRAND_BLUR}
      loading={priority ? undefined : loading ?? "lazy"}
      priority={priority}
      className={cn("object-cover", className)}
      onError={() => {
        if (current !== fallbackSrc) setCurrent(fallbackSrc);
      }}
    />
  );
}
