"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { BLUR_DATA_URL, FALLBACK_IMAGE } from "@/lib/images";
import { cn } from "@/lib/utils";

type LuxuryImageProps = Omit<ImageProps, "onError"> & {
  fallbackSrc?: string;
};

export function LuxuryImage({
  src,
  alt,
  className,
  fallbackSrc = FALLBACK_IMAGE,
  placeholder = "blur",
  blurDataURL = BLUR_DATA_URL,
  ...props
}: LuxuryImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      className={cn("object-cover", className)}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      onError={() => {
        if (imgSrc !== fallbackSrc) setImgSrc(fallbackSrc);
      }}
    />
  );
}
