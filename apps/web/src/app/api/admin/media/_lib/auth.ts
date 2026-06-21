import { NextResponse } from "next/server";
import { getAuthToken } from "../../../_lib/auth";
import { getApiBase } from "../../../_lib/env";

export async function requireAdminSession(): Promise<
  { ok: true; user: Record<string, unknown> } | { ok: false; response: NextResponse }
> {
  const token = await getAuthToken();
  if (!token) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Authentication required" }, { status: 401 }),
    };
  }

  try {
    const base = getApiBase();
    const res = await fetch(`${base}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) {
      return {
        ok: false,
        response: NextResponse.json({ error: "Invalid session" }, { status: 401 }),
      };
    }
    const user = await res.json();
    const role = user?.role as string | undefined;
    if (role !== "ADMIN" && role !== "STAFF") {
      return {
        ok: false,
        response: NextResponse.json({ error: "Admin access required" }, { status: 403 }),
      };
    }
    return { ok: true, user };
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: "Auth service unavailable" }, { status: 503 }),
    };
  }
}

/** Dev-only bypass when MEDIA_ADMIN_BYPASS=1 (local uploads without API) */
export function isDevAdminBypass(): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.MEDIA_ADMIN_BYPASS === "1"
  );
}
