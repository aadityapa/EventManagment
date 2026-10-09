import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

/**
 * Session helpers shared by the route handlers and `src/proxy.ts`.
 *
 * The session is the Express API's JWT (HS256, signed with NEXTAUTH_SECRET)
 * stored in an httpOnly cookie. Verifying it here with `jose` means the proxy
 * and the admin routes can check identity and role without a network hop.
 */

export const AUTH_COOKIE = "glitz_token";

export type SessionRole = "CLIENT" | "VENDOR" | "ADMIN" | "STAFF";
export type Session = { id: string; email: string; role: SessionRole };

const ROLES: ReadonlySet<string> = new Set(["CLIENT", "VENDOR", "ADMIN", "STAFF"]);

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

/** The HS256 key, or null when NEXTAUTH_SECRET is unset or too short to be safe. */
export function getSessionSecret(): Uint8Array | null {
  const secret = process.env.NEXTAUTH_SECRET?.trim();
  if (!secret || secret.length < 32) return null;
  return new TextEncoder().encode(secret);
}

/** Verify signature + expiry and return the claims we rely on, or null. */
export async function verifySessionToken(token: string | undefined | null): Promise<Session | null> {
  if (!token) return null;
  const key = getSessionSecret();
  if (!key) return null;
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    const { id, email, role } = payload as { id?: unknown; email?: unknown; role?: unknown };
    if (typeof id !== "string" || typeof email !== "string" || typeof role !== "string" || !ROLES.has(role)) {
      return null;
    }
    return { id, email, role: role as SessionRole };
  } catch {
    return null;
  }
}

export async function getAuthToken(): Promise<string | null> {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE)?.value;
  return token && token.trim() ? token.trim() : null;
}

/** The verified session for the current request, or null. */
export async function getSession(): Promise<Session | null> {
  return verifySessionToken(await getAuthToken());
}

export function authCookieOptions() {
  return {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  };
}

/** Same attributes as the set call, otherwise some browsers keep the old cookie. */
export function clearAuthCookieOptions() {
  return { ...authCookieOptions(), maxAge: 0 };
}

/* ---- CSRF: same-origin check for cookie-authenticated POSTs ------------- */

function allowedHosts(request: Request): Set<string> {
  const hosts = new Set<string>();
  const forwarded = request.headers.get("x-forwarded-host");
  const host = request.headers.get("host");
  if (forwarded) hosts.add(forwarded.split(",")[0].trim().toLowerCase());
  if (host) hosts.add(host.toLowerCase());
  try {
    hosts.add(new URL(request.url).host.toLowerCase());
  } catch {
    /* request.url is always absolute in route handlers */
  }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl) {
    try {
      hosts.add(new URL(appUrl).host.toLowerCase());
    } catch {
      /* ignore a malformed env value */
    }
  }
  return hosts;
}

/**
 * Reject a request whose Origin (or, failing that, Referer) is not this site.
 * `SameSite=Lax` already blocks cross-site cookie sends for most POSTs; this is
 * the belt to that brace, and it also stops cross-site JSON posts that carry no
 * cookie from reaching the upstream API through our proxy routes.
 *
 * Returns a 403 response to send, or null when the request may proceed.
 */
export function rejectCrossSite(request: Request): NextResponse | null {
  const forbidden = () => NextResponse.json({ error: "Cross-site request rejected" }, { status: 403 });

  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite === "cross-site") return forbidden();

  const source = request.headers.get("origin") ?? request.headers.get("referer");
  // Browsers always send Origin on fetch/XHR POSTs; a missing header means a
  // non-browser client, which must talk to the API directly instead.
  if (!source || source === "null") return forbidden();

  let sourceHost: string;
  try {
    sourceHost = new URL(source).host.toLowerCase();
  } catch {
    return forbidden();
  }
  return allowedHosts(request).has(sourceHost) ? null : forbidden();
}
