import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  AUTH_COOKIE,
  clearAuthCookieOptions,
  getSessionSecret,
  isProduction,
  verifySessionToken,
  type SessionRole,
} from "@/app/api/_lib/auth";

/**
 * Route protection (Next 16 `proxy` convention, formerly middleware.ts).
 *
 * Optimistic check only: the cookie's JWT is verified (signature + expiry) and
 * its role claim is enforced; no database or API call runs here. Route
 * handlers and server components still own their own authorisation.
 *
 *   /admin/**           ADMIN or STAFF
 *   /dashboard/vendor   VENDOR, ADMIN or STAFF
 *   /dashboard/**       any valid session
 */

const ADMIN_ROLES: ReadonlySet<SessionRole> = new Set(["ADMIN", "STAFF"]);
const VENDOR_ROLES: ReadonlySet<SessionRole> = new Set(["VENDOR", "ADMIN", "STAFF"]);

let warnedMissingSecret = false;

function requiredRoles(pathname: string): ReadonlySet<SessionRole> | null {
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return ADMIN_ROLES;
  if (pathname === "/dashboard/vendor" || pathname.startsWith("/dashboard/vendor/")) return VENDOR_ROLES;
  return null; // any valid session
}

function homeFor(role: SessionRole): string {
  if (ADMIN_ROLES.has(role)) return "/admin";
  if (role === "VENDOR") return "/dashboard/vendor";
  return "/dashboard";
}

function redirectToLogin(req: NextRequest): NextResponse {
  const { pathname, search } = req.nextUrl;
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  url.searchParams.set("next", `${pathname}${search}`);
  const res = NextResponse.redirect(url);
  // A bad or expired token is useless; drop it so the user gets a clean login.
  res.cookies.set(AUTH_COOKIE, "", clearAuthCookieOptions());
  return res;
}

export async function proxy(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE)?.value?.trim();
  if (!token) return redirectToLogin(req);

  if (!getSessionSecret()) {
    if (isProduction()) {
      // Fail closed: without the signing key no token can be trusted.
      console.error("[proxy] NEXTAUTH_SECRET (min 32 chars) is not set; refusing protected routes");
      return new NextResponse("Authentication is not configured on this deployment.", {
        status: 503,
        headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
      });
    }
    // Local dev without a secret: the API signs with a per-process random key we
    // cannot verify, so fall back to the old cookie-presence check and say so once.
    if (!warnedMissingSecret) {
      warnedMissingSecret = true;
      console.warn("[proxy] NEXTAUTH_SECRET not set; protected routes only check that a session cookie exists (dev only).");
    }
    return NextResponse.next();
  }

  const session = await verifySessionToken(token);
  if (!session) return redirectToLogin(req);

  const roles = requiredRoles(req.nextUrl.pathname);
  if (roles && !roles.has(session.role)) {
    // Signed in, wrong area: send them to their own home rather than a login loop.
    return NextResponse.redirect(new URL(homeFor(session.role), req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
