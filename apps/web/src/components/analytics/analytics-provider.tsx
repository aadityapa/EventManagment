"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { Hotjar } from "@/components/analytics/hotjar";
import { ScrollDepthTracker } from "@/components/analytics/scroll-depth-tracker";
import { CONSENT_EVENT, readConsent } from "@/components/shared/cookie-consent";
import { analytics, HOTJAR_ID, whenActivated } from "@/lib/analytics";

function subscribeConsent(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

const INTERACTION_EVENTS = ["pointerdown", "keydown", "touchstart", "wheel", "scroll"] as const;

/**
 * Arms the deferred activation: first user interaction, or idle a few seconds
 * after `load`, whichever comes first. Returns the teardown.
 */
function scheduleActivation(activate: () => void) {
  let idleId: number | undefined;
  let timeoutId: number | undefined;
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };

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
}

/**
 * Third-party analytics loader — deferred so gtag/Hotjar never compete with
 * page load. Scripts mount on the first user interaction, or on idle a few
 * seconds after the window `load` event, whichever comes first. (gtag queues
 * the pageview whenever it loads, so no data is lost.)
 *
 * Nothing loads until the visitor accepts analytics in the cookie banner
 * (India DPDP Act: consent needs a clear affirmative action), and nothing
 * loads while the document is only being prerendered (Speculation Rules).
 * Hotjar mounts only when a real NEXT_PUBLIC_HOTJAR_ID is set; the banner and
 * privacy policy name it under the same condition. Consent is withdrawn from
 * the "Cookie settings" control (see CookieConsent), which unmounts all three.
 *
 * Also owns the ONE delegated click listener for `[data-cta]`, so Button,
 * ActionBar, Footer and index rows stay server components with no onClick.
 */
export function AnalyticsProvider() {
  const [ready, setReady] = useState(false);
  const consented = useSyncExternalStore(subscribeConsent, () => readConsent() === "accepted", () => false);

  // Delegated CTA tracking. gtag is a no-op until consent + load, so mounting
  // this early is harmless; keyboard activation of links also fires `click`.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const el = target.closest<HTMLElement>("[data-cta]");
      if (el?.dataset.cta) analytics.ctaClick(el.dataset.cta, el.dataset.ctaLocation);
    };
    document.addEventListener("click", onClick, { passive: true });
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (ready) return;

    let cancelled = false;
    let teardown: (() => void) | undefined;

    // Prerendered documents wait for activation before the timers even start.
    void whenActivated().then(() => {
      if (cancelled) return;
      teardown = scheduleActivation(() => setReady(true));
    });

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [ready]);

  if (!ready || !consented) return null;

  return (
    <>
      <GoogleAnalytics />
      {HOTJAR_ID !== null && <Hotjar />}
      <ScrollDepthTracker />
    </>
  );
}
