"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type LazySectionProps = {
  children: ReactNode;
  minHeight?: string;
  className?: string;
  rootMargin?: string;
  label?: string;
};

function SectionSkeleton({ minHeight, label }: { minHeight: string; label?: string }) {
  return (
    <div
      className="flex w-full animate-pulse flex-col justify-center border-b border-[var(--glitz-border)]/40 bg-[var(--background)]"
      style={{ minHeight }}
      aria-hidden
    >
      <div className="brand-container py-12 md:py-16">
        <div className="mx-auto mb-8 h-3 w-32 rounded-full bg-[var(--glitz-gold)]/20" />
        <div className="mx-auto mb-4 h-10 max-w-md rounded-lg bg-white/5" />
        <div className="mx-auto h-4 max-w-sm rounded bg-white/5" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="aspect-[4/3] rounded-xl bg-white/[0.04]" />
          ))}
        </div>
        {label ? <span className="sr-only">Loading {label}</span> : null}
      </div>
    </div>
  );
}

/**
 * Defers mounting children until the placeholder nears the viewport.
 * Shows skeleton placeholder — never renders blank.
 */
export function LazySection({
  children,
  minHeight = "40vh",
  className,
  rootMargin = "280px 0px",
  label,
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={cn(className)} style={{ minHeight }} aria-busy={!visible}>
      {visible ? children : <SectionSkeleton minHeight={minHeight} label={label} />}
    </div>
  );
}