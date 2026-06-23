const PRODUCTION_URL = "https://www.nexyyra.com";

function isDevUrl(url: string): boolean {
  return (
    url.includes("localhost") ||
    url.includes("127.0.0.1") ||
    url.includes("192.168.") ||
    url.includes("10.0.") ||
    url.startsWith("http://")
  );
}

/** Canonical public site URL — never expose local/dev URLs in production. */
export function resolveSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");

  if (process.env.VERCEL_ENV === "production") {
    if (!fromEnv || isDevUrl(fromEnv)) return PRODUCTION_URL;
    return fromEnv;
  }

  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return PRODUCTION_URL;
}

export const SITE_URL = resolveSiteUrl();
