"use client";

import { useEffect } from "react";
import {
  CACHE_VERSION_KEY,
  LEGACY_SESSION_KEYS,
  NEXYYRA_CACHE_VERSION,
} from "@/lib/cache-version";

/** One-time client cache bust after deploy — clears stale session keys */
export function CacheVersionClear() {
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CACHE_VERSION_KEY);
      if (stored === NEXYYRA_CACHE_VERSION) return;

      for (const key of LEGACY_SESSION_KEYS) {
        sessionStorage.removeItem(key);
      }

      localStorage.setItem(CACHE_VERSION_KEY, NEXYYRA_CACHE_VERSION);
    } catch {
      /* private browsing */
    }
  }, []);

  return null;
}
