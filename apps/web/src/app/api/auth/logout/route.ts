import { NextResponse } from "next/server";
import { AUTH_COOKIE, clearAuthCookieOptions, rejectCrossSite } from "../../_lib/auth";

export async function POST(request: Request) {
  // A cross-site page must not be able to log the visitor out either.
  const blocked = rejectCrossSite(request);
  if (blocked) return blocked;

  const out = NextResponse.json({ success: true }, { status: 200 });
  // Same attributes as the login cookie (httpOnly, secure in prod, SameSite=Lax)
  // so the browser matches and removes the existing one.
  out.cookies.set(AUTH_COOKIE, "", clearAuthCookieOptions());
  return out;
}
