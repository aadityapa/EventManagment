import path from "path";
import type { NextConfig } from "next";

const isDockerBuild = process.env.DOCKER_BUILD === "1";

/** Keep image/video binaries out of serverless traces (served as static assets). */
const mediaTraceExcludes = [
  "./public/images/**/*",
  "./public/videos/**/*",
  "./public/placeholders/**/*",
  "./public/logos/**/*",
];

const mediaApiRoutes = [
  "/api/media",
  "/api/admin/media/reindex",
  "/api/admin/media/upload",
];

const mediaPageRoutes = ["/gallery", "/portfolio"];

const tracedMediaRoutes = [...mediaApiRoutes, ...mediaPageRoutes];

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.15", "localhost", "https://192.168.1.15:3000"],
  turbopack: {
    root: path.join(__dirname),
  },
  serverExternalPackages: ["sharp"],
  outputFileTracingExcludes: Object.fromEntries(
    tracedMediaRoutes.map((route) => [route, mediaTraceExcludes])
  ),
  outputFileTracingIncludes: Object.fromEntries(
    tracedMediaRoutes.map((route) => [route, ["./public/media-manifest.json"]])
  ),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "pixabay.com" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  async redirects() {
    return [{ source: "/experiences", destination: "/services", permanent: true }];
  },
  poweredByHeader: false,
  ...(isDockerBuild ? { output: "standalone" as const } : {}),
};

export default nextConfig;
