/**
 * Lightweight Sentry integration — no-op when NEXT_PUBLIC_SENTRY_DSN is unset.
 * Uses @sentry/browser dynamically to avoid bundle cost when disabled.
 */

let initialized = false;

export function isSentryEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN);
}

export async function initSentry(): Promise<void> {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn || initialized || typeof window === "undefined") return;

  try {
    const Sentry = await import("@sentry/browser");
    Sentry.init({
      dsn,
      environment: process.env.NODE_ENV,
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 0,
    });
    initialized = true;
  } catch {
    // Graceful no-op — monitoring must never break the app
  }
}

export function captureException(error: unknown, context?: Record<string, unknown>): void {
  if (!isSentryEnabled()) return;

  void import("@sentry/browser")
    .then(async (Sentry) => {
      if (!initialized) await initSentry();
      Sentry.captureException(error, context ? { extra: context } : undefined);
    })
    .catch(() => {
      // Swallow — error reporting should never surface to users
    });
}

export function captureMessage(message: string, level: "info" | "warning" | "error" = "info"): void {
  if (!isSentryEnabled()) return;

  void import("@sentry/browser")
    .then(async (Sentry) => {
      if (!initialized) await initSentry();
      Sentry.captureMessage(message, level);
    })
    .catch(() => {});
}
