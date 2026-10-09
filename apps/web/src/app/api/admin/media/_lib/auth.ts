import { NextResponse } from "next/server";
import { getSession, getSessionSecret, type Session } from "../../../_lib/auth";

/**
 * Admin gate for the media routes. The role comes from the signed session
 * cookie (verified locally with jose), so these routes keep working on Vercel
 * where the Express API is not deployed. A role change takes effect when the
 * token is re-issued (7-day lifetime).
 */
export async function requireAdminSession(): Promise<
  { ok: true; user: Session } | { ok: false; response: NextResponse }
> {
  if (!getSessionSecret()) {
    // Fail closed: nothing can be verified without the signing key.
    console.error("[admin/media] NEXTAUTH_SECRET (min 32 chars) is not set");
    return {
      ok: false,
      response: NextResponse.json({ error: "Authentication is not configured" }, { status: 503 }),
    };
  }

  const session = await getSession();
  if (!session) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Authentication required" }, { status: 401 }),
    };
  }
  if (session.role !== "ADMIN" && session.role !== "STAFF") {
    return {
      ok: false,
      response: NextResponse.json({ error: "Admin access required" }, { status: 403 }),
    };
  }
  return { ok: true, user: session };
}

/** Dev-only bypass when MEDIA_ADMIN_BYPASS=1 (local uploads without an account). */
export function isDevAdminBypass(): boolean {
  return process.env.NODE_ENV === "development" && process.env.MEDIA_ADMIN_BYPASS === "1";
}
