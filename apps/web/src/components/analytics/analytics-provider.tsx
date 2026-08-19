"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { Hotjar } from "@/components/analytics/hotjar";
import { ScrollDepthTracker } from "@/components/analytics/scroll-depth-tracker";

const INTERACTION_EVENTS = ["pointerdown", "keydown", "touchstart", "wheel", "scroll"] as const;

/**
 * Third-party analytics loader — deferred so gtag/Hotjar never compete with
 * page load. Scripts mount on the first user interaction, or on idle a few
 * seconds after the window `load` event, whichever comes first. (gtag queues
 * the pageview whenever it loads, so no data is lost.)
 */
export function AnalyticsProvider() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;

    let idleId: number | undefined;
    let timeoutId: number | undefined;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    const activate = () => setReady(true);

    const scheduleAfterLoad = () => {
      timeoutId = window.setTimeout(() => {
        if (w.requestIdleCallback) {
          idleId = w.requestIdleCallback(activate, { timeout: 3000 });
        } else {
          activate();
        }
      }, 3500);
    };

    for (const evt of INTERACTION_EVENTS) {
      window.addEventListener(evt, activate, { once: true, passive: true });
    }

    if (document.readyState === "complete") {
      scheduleAfterLoad();
    } else {
      window.addEventListener("load", scheduleAfterLoad, { once: true });
    }

    return () => {
      for (const evt of INTERACTION_EVENTS) {
        window.removeEventListener(evt, activate);
      }
      window.removeEventListener("load", scheduleAfterLoad);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
    };
  }, [ready]);

  if (!ready) return null;

  return (
    <>
      <GoogleAnalytics />
      <Hotjar />
      <ScrollDepthTracker />
    </>
  );
}
