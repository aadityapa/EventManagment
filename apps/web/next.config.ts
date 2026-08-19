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
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "lh4.googleusercontent.com" },
      { protocol: "https", hostname: "lh5.googleusercontent.com" },
      { protocol: "https", hostname: "lh6.googleusercontent.com" },
      { protocol: "https", hostname: "drive.google.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "pixabay.com" },
    ],
    formats: ["image/avif", "image/webp"],
    // Optimized images (/_next/image) default to a 60s cache — bump to 31 days
    // so repeat views and CDN hits stop re-fetching (Lighthouse "efficient cache lifetimes").
    minimumCacheTTL: 2678400,
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
    // NOTE: do NOT enable experimental.inlineCss here — the CSS bundle is ~200 KiB,
    // so inlining it makes every HTML response heavier than the render-blocking
    // request it saves (measured: mobile Lighthouse dropped 76 → 63 with it on).
  },
  async redirects() {
    return [
      { source: "/experiences", destination: "/services", permanent: true },
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
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://vercel.com https://*.vercel.com https://*.vercel.app",
          },
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
  // Fixes Lighthouse "Missing source maps for large first-party JavaScript".
  productionBrowserSourceMaps: true,
  poweredByHeader: false,
  // Optional alternate build dir (e.g. CI/agents building alongside a running dev server).
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
  ...(isDockerBuild ? { output: "standalone" as const } : {}),
};

export default nextConfig;
