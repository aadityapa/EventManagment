import path from "path";
import type { NextConfig } from "next";

const isDockerBuild = process.env.DOCKER_BUILD === "1";

/** Keep image/video binaries out of serverless traces (served as static assets). */
const mediaTraceExcludes = [
  "**/public/images/**",
  "**/public/videos/**",
  "**/public/placeholders/**",
  "**/public/logos/**",
];

const mediaApiRoutes = [
  "/api/media",
  "/api/admin/media/reindex",
  "/api/admin/media/upload",
];

const mediaPageRoutes = ["/gallery", "/portfolio", "/services/*"];

const routesNeedingManifest = [...mediaApiRoutes, ...mediaPageRoutes];

const isDev = process.env.NODE_ENV === "development";

/**
 * Content-Security-Policy — no nonces on purpose: a nonce forces every page
 * dynamic, and Next's own hydration/RSC payload is inline script, so
 * 'unsafe-inline' is the price of static pages. 'inline-speculation-rules'
 * allows the <script type="speculationrules"> in layout.tsx on browsers that
 * honour it separately. Third-party hosts: GA4 (gtag), Hotjar, Sentry ingest.
 * Keep vercel.json in sync (it mirrors the production string).
 */
const CSP_DIRECTIVES = [
  "default-src 'self'",
  // 'unsafe-eval' only in dev: React reconstructs server error stacks with eval.
  `script-src 'self' 'unsafe-inline' 'inline-speculation-rules'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://www.google-analytics.com https://static.hotjar.com https://script.hotjar.com`,
  "style-src 'self' 'unsafe-inline' https://*.hotjar.com",
  "img-src 'self' data: blob: https://lh3.googleusercontent.com https://drive.google.com https://www.google-analytics.com https://www.googletagmanager.com https://*.hotjar.com",
  "font-src 'self' data: https://*.hotjar.com",
  // GA4 beacons go to regional hosts (region1.google-analytics.com), hence the wildcard.
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://*.googletagmanager.com https://*.hotjar.com https://*.hotjar.io wss://*.hotjar.com https://*.ingest.sentry.io https://*.sentry.io",
  "frame-src https://www.youtube-nocookie.com",
  // Any Vercel customer could frame the site via *.vercel.app — clickjacking.
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  // Not in dev: LAN previews (allowedDevOrigins) run over plain http.
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
];

const CONTENT_SECURITY_POLICY = CSP_DIRECTIVES.join("; ");

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.15", "localhost", "https://192.168.1.15:3000"],
  turbopack: {
    root: path.join(__dirname),
  },
  serverExternalPackages: ["sharp"],
  outputFileTracingExcludes: {
    "/*": mediaTraceExcludes,
  },
  outputFileTracingIncludes: Object.fromEntries(
    routesNeedingManifest.map((route) => [route, ["**/public/media-manifest.json"]])
  ),
  images: {
    remotePatterns: [
      // Only the Google Drive hosts the media library actually uses.
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "drive.google.com" },
    ],
    formats: ["image/avif", "image/webp"],
    // Optimized images (/_next/image) default to a 60s cache — bump to 31 days
    // so repeat views and CDN hits stop re-fetching (Lighthouse "efficient cache lifetimes").
    minimumCacheTTL: 2678400,
    // SVG optimisation stays OFF: with Drive hosts allowed, an uploaded SVG
    // served via /_next/image would run script on this origin (stored XSS).
    // Logos are plain <img> tags and never need the optimizer.
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    // framer-motion dropped from the list: V6 imports none of it (removed at close-out).
    optimizePackageImports: ["lucide-react"],
    // React <ViewTransition> integration — route navigations run as transitions
    // (layout.tsx wraps children in <ViewTransition default="lux-crossfade">).
    viewTransition: true,
    // NOTE: do NOT enable experimental.inlineCss here — the CSS bundle is ~200 KiB,
    // so inlining it makes every HTML response heavier than the render-blocking
    // request it saves (measured: mobile Lighthouse dropped 76 → 63 with it on).
    // NOTE: cacheComponents stays off — it changes rendering semantics app-wide.
  },
  async redirects() {
    return [
      { source: "/experiences", destination: "/services", permanent: true },
      // V6: the testimonials path is retired — the page describes commitments, not reviews.
      { source: "/testimonials", destination: "/why-nexyyra", permanent: true },
      // V6 close-out: template routes retired (no real venues/vendors to list; the
      // AI planner invented plans). Send old links to the nearest real page.
      { source: "/ai", destination: "/book-event", permanent: true },
      { source: "/venues/:path*", destination: "/services", permanent: true },
      { source: "/vendors/:path*", destination: "/services", permanent: true },
      // Legacy /home links (flagged 404 in Search Console) → homepage
      { source: "/home", destination: "/", permanent: true },
      { source: "/index", destination: "/", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
      // Apex + non-www → canonical www (single 301 hop; HTTP handled at platform edge)
      {
        source: "/:path*",
        has: [{ type: "host", value: "nexyyra.com" }],
        destination: "https://www.nexyyra.com/:path*",
        permanent: true,
      },
      // HTTP → HTTPS on production hosts (Vercel also enforces at edge)
      {
        source: "/:path*",
        has: [
          { type: "host", value: "www.nexyyra.com" },
          { type: "header", key: "x-forwarded-proto", value: "http" },
        ],
        destination: "https://www.nexyyra.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
        ],
      },
      {
        // Build assets (JS/CSS/fonts) stay crawlable for rendering but out of the search index.
        source: "/_next/static/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
      {
        // Static media — long-lived cache (non-Vercel deploys; vercel.json covers Vercel edge).
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/brand/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=31536000" },
        ],
      },
      {
        source: "/:file(sitemap.*\\.xml)",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
  // Public source maps published the full application source; Lighthouse's
  // "missing source maps" note is informational and not worth that exposure.
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  // Optional alternate build dir (e.g. CI/agents building alongside a running dev server).
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
  ...(isDockerBuild ? { output: "standalone" as const } : {}),
};

export default nextConfig;
