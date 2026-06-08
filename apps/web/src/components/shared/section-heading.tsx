"use client";

import { StitchReveal } from "@/components/stitch";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <StitchReveal
      variant="fadeUp"
      className={cn(
        "mb-10 md:mb-14",
        align === "center" && "mx-auto max-w-2xl text-center",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-3 font-brand text-xs font-medium uppercase tracking-[0.35em] text-primary">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base text-muted md:text-lg">{description}</p>
      )}
      <div className="mx-auto mt-6 h-px w-16 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
    </StitchReveal>
  );
}
