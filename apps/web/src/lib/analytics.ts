const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-5WS115MZ5E";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (typeof window === "undefined" || !GA_MEASUREMENT_ID) return;
  window.gtag?.("event", eventName, params);
};

const ctaClick = (ctaName: string, location?: string) => {
  trackEvent("cta_click", { cta_name: ctaName, ...(location ? { location } : {}) });
};

const pricingView = () => {
  trackEvent("pricing_view");
};

const pricingToggle = (mode: string) => {
  trackEvent("pricing_toggle", { billing_mode: mode });
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

const demoRequest = (source?: string) => {
  trackEvent("demo_request", { ...(source ? { source } : {}) });
};

const scrollDepth = (percent: number) => {
  trackEvent("scroll_depth", { percent });
};

export const analytics = {
  ctaClick,
  pricingView,
  pricingToggle,
  signupStart,
  signupComplete,
  featureClick,
  demoRequest,
  scrollDepth,
};
