"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { analytics } from "@/lib/analytics";

const MILESTONES = [25, 50, 75, 90] as const;

/**
 * Reports scroll_depth milestones once per page. Lives in the root layout, so
 * it survives client-side navigations: the fired set resets on every pathname
 * change, and the new page is measured from its own starting position.
 */
export function ScrollDepthTracker() {
  const pathname = usePathname();
  const fired = useRef<Set<number>>(new Set());

  useEffect(() => {
    fired.current = new Set();

    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const percent = Math.round((window.scrollY / docHeight) * 100);

      for (const milestone of MILESTONES) {
        if (percent >= milestone && !fired.current.has(milestone)) {
          fired.current.add(milestone);
          analytics.scrollDepth(milestone);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return null;
}
