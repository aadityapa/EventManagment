"use client";

import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { Hotjar } from "@/components/analytics/hotjar";
import { ScrollDepthTracker } from "@/components/analytics/scroll-depth-tracker";

export function AnalyticsProvider() {
  return (
    <>
      <GoogleAnalytics />
      <Hotjar />
      <ScrollDepthTracker />
    </>
  );
}
