"use client";

import { useEffect } from "react";
import { initSentry, isSentryEnabled } from "@/lib/monitoring/sentry";

/** Initializes Sentry on the client when DSN is configured */
export function SentryInit() {
  useEffect(() => {
    if (isSentryEnabled()) void initSentry();
  }, []);

  return null;
}
