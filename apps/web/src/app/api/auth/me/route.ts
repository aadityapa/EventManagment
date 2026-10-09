import { NextResponse } from "next/server";
import { AUTH_COOKIE, clearAuthCookieOptions, getAuthToken, getSessionSecret, verifySessionToken } from "../../_lib/auth";
import { getApiBase } from "../../_lib/env";

export const dynamic = "force-dynamic";

function anonymous(clearCookie = false) {
  const out = NextResponse.json({ authenticated: false }, { status: 200, headers: { "cache-control": "no-store" } });
  if (clearCookie) out.cookies.set(AUTH_COOKIE, "", clearAuthCookieOptions());
  return out;
}

export async function GET() {
  try {
    const token = await getAuthToken();
    if (!token) return anonymous();

    // Cheap local check first: a forged or expired token never reaches the API,
    // and the dead cookie is cleared so the proxy stops redirecting on it.
    if (getSessionSecret() && !(await verifySessionToken(token))) return anonymous(true);

    const res = await fetch(`${getApiBase()}/auth/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return anonymous(res.status === 401);

    const data = (await res.json().catch(() => ({}))) as { user?: unknown };
    return NextResponse.json({ authenticated: true, user: data.user ?? null }, { status: 200, headers: { "cache-control": "no-store" } });
  } catch (err) {
    console.error("[api/auth/me]", err instanceof Error ? err.message : err);
    return anonymous();
  }
}
