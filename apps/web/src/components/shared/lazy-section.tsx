"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type LazySectionProps = {
  children: ReactNode;
  /** Reserved height to prevent CLS before the section mounts. */
  minHeight?: string;
  className?: string;
  /** Intersection root margin — load slightly before entering viewport. */
  rootMargin?: string;
};

/**
 * Defers mounting children until the placeholder nears the viewport.
 * Pairs with next/dynamic for below-fold homepage sections.
 */
export function LazySection({
  children,
  minHeight = "40vh",
  className,
  rootMargin = "280px 0px",
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
    <div
      ref={ref}
      className={cn(className)}
      style={{ minHeight }}
      aria-busy={!visible}
    >
      {visible ? children : null}
    </div>
  );
}
