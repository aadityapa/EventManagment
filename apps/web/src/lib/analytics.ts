export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-5WS115MZ5E";

/**
 * Hotjar site id, or null when Hotjar is not configured. Placeholder ids such
 * as the `0000000` in .env.example parse to 0 and count as unset, so Hotjar
 * only ever loads (and is only ever named in the consent banner and privacy
 * policy) when a real id is set.
 */
export const HOTJAR_ID: number | null = (() => {
  const id = Number.parseInt(process.env.NEXT_PUBLIC_HOTJAR_ID ?? "", 10);
  return Number.isInteger(id) && id > 0 ? id : null;
})();

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Resolves once the document is actually being shown. Pages prerendered via
 * Speculation Rules must not count a pageview, stamp consent or mount Hotjar
 * until the visitor navigates to them (`prerenderingchange` fires then).
 * Call before any pageview, consent write or third-party mount.
 */
export function whenActivated(): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();
  const doc = document as Document & { prerendering?: boolean };
  if (!doc.prerendering) return Promise.resolve();
  return new Promise<void>((resolve) => {
    document.addEventListener("prerenderingchange", () => resolve(), { once: true });
  });
}

export const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (typeof window === "undefined" || !GA_MEASUREMENT_ID) return;
  window.gtag?.("event", eventName, params);
};

/** Fired by the delegated `[data-cta]` handler in AnalyticsProvider; `location` is optional. */
const ctaClick = (ctaName: string, location?: string | null) => {
  if (!ctaName) return;
  trackEvent("cta_click", { cta_name: ctaName, ...(location ? { location } : {}) });
};

const signupStart = (method = "email") => {
  trackEvent("signup_start", { method });
};

const signupComplete = (method = "email") => {
  trackEvent("signup_complete", { method });
};

const featureClick = (featureName: string, location?: string) => {
  trackEvent("feature_click", { feature_name: featureName, ...(location ? { location } : {}) });
};

const scrollDepth = (percent: number) => {
  trackEvent("scroll_depth", { percent });
};

export const analytics = {
  ctaClick,
  signupStart,
  signupComplete,
  featureClick,
  scrollDepth,
};
