"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { useAdaptiveBackdrop } from "./adaptive-theme-provider";
import type { SampleRegion } from "@/lib/adaptive-theme";

type AdaptiveBackdropProps = {
  children: ReactNode;
  className?: string;
  imageSrc?: string;
  videoRef?: { current: HTMLVideoElement | null };
  region?: SampleRegion;
  priority?: number;
  as?: "section" | "div";
  id?: string;
};

export function AdaptiveBackdrop({
  children,
  className,
  imageSrc,
  videoRef,
  region = "left-third",
  priority = 1,
  as: Tag = "section",
  id,
}: AdaptiveBackdropProps) {
  const setRef = useAdaptiveBackdrop({ imageSrc, videoRef, region, priority });

  return (
    <Tag
      id={id}
      ref={setRef}
      data-adaptive-backdrop=""
      className={cn("adaptive-backdrop transition-[color] duration-500", className)}
    >
      {children}
    </Tag>
  );
}
