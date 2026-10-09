import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, Manrope, Playfair_Display } from "next/font/google";
import { CacheVersionClear } from "@/components/providers/cache-version-clear";
import { BrandHeader } from "@/brand/shell/brand-header";
import { BrandFooter } from "@/brand/shell/brand-footer";
import { ActionBar } from "@/brand/shell/brand-action-bar";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { SentryInit } from "@/components/monitoring/sentry-init";
import { CookieConsent } from "@/components/shared/cookie-consent";
import { AnalyticsProvider } from "@/components/analytics/analytics-provider";
import { ViewTransition } from "@/components/ui/view-transition";
import { MotionRuntime } from "@/components/motion/motion-runtime";
import { MOTION_BOOT_SCRIPT } from "@/components/motion/motion-mode";
import { generateSEO, globalGraphSchema } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import "./globals.css";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap", preload: true });
// Only the body face (Manrope) and the display face used by every H1 (Cormorant)
// are preloaded; Playfair and Cinzel are accent faces that can swap in.
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], display: "swap", preload: false });
const cinzel = Cinzel({ variable: "--font-cinzel", subsets: ["latin"], display: "swap", preload: false });
// Montserrat + Poppins removed — Poppins had zero usages; Montserrat only backs the
// legacy stitch theme, which declares a system-ui fallback.
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", weight: ["400", "500", "600", "700"], subsets: ["latin"], display: "swap" });

/**
 * Speculation Rules — prerender the top conversion targets, prefetch the two
 * big indexes. Chrome already suppresses prefetch/prerender under Data Saver,
 * so there is no server-side gating (reading headers() here would force the
 * whole app dynamic). AnalyticsProvider and CookieConsent wait for
 * document.prerendering === false, so a prerendered page never counts a
 * pageview or stamps consent.
 */
const SPECULATION = JSON.stringify({
  prerender: [{ where: { href_matches: ["/services", "/book-event", "/contact", "/pricing"] }, eagerness: "moderate" }],
  prefetch: [{ where: { href_matches: ["/services/*", "/portfolio/*"] }, eagerness: "conservative" }],
});

export const metadata: Metadata = {
  ...generateSEO(),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/brand/android-chrome-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/brand/apple-touch-icon.png",
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#d8b26a" }],
  },
  manifest: "/manifest.json",
  category: "Event Management",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#050816" },
    { media: "(prefers-color-scheme: dark)", color: "#050816" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const globalSchema = globalGraphSchema();
  // JSON-LD via HTML string — avoids React 19 client <script> render warning.
  const jsonLdHtml = `<script type="application/ld+json">${JSON.stringify(globalSchema).replace(/</g, "\\u003c")}</script>`;

  return (
    // The next/font variable classes sit on <html> so the :root --lux-font-* tokens
    // (tokens.css), which are built from var(--font-*), resolve where they are declared.
    <html
      lang="en-IN"
      className={`${manrope.variable} ${playfair.variable} ${cinzel.variable} ${cormorant.variable} dark`}
      // data-motion / data-motion-source are written by the boot script before hydration.
      suppressHydrationWarning
    >
      <head>
        {/* Site motion preference (DESIGN.md §9): sets html[data-motion] before first paint from the
            stored "nx-motion" choice, else the OS setting; exposes window.__nxSetMotion. Render-blocking
            on purpose and tiny; CSP script-src already allows inline scripts. */}
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT_SCRIPT }} />
        <link rel="author" href={`${SITE_CONFIG.url}/llms.txt`} />
        <link rel="author" href={`${SITE_CONFIG.url}/llms-full.txt`} />
        <link rel="author" href={`${SITE_CONFIG.url}/humans.txt`} />
        <script type="speculationrules" dangerouslySetInnerHTML={{ __html: SPECULATION }} />
      </head>
      <body className="brand-root min-h-screen flex flex-col antialiased">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <CacheVersionClear />
        <SentryInit />
        <AnalyticsProvider />
        <BrandHeader />
        <ErrorBoundary>
          <main id="main-content" className="app-main flex flex-1 flex-col" tabIndex={-1}>
            {/* 200ms root crossfade on route change (globals.css: ::view-transition-*(.lux-crossfade)). */}
            <ViewTransition default="lux-crossfade">{children}</ViewTransition>
          </main>
        </ErrorBoundary>
        <BrandFooter />
        <ActionBar />
        <CookieConsent />
        {/* V7: tilt, magnetic, cursor light, smooth scroll and the reveal fallback — one small island. */}
        <MotionRuntime />
        <div hidden suppressHydrationWarning dangerouslySetInnerHTML={{ __html: jsonLdHtml }} />
      </body>
    </html>
  );
}
