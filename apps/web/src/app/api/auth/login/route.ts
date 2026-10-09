import { NextResponse } from "next/server";
import { z } from "zod";
import { AUTH_COOKIE, authCookieOptions, rejectCrossSite } from "../../_lib/auth";
import { getApiBase } from "../../_lib/env";

const loginSchema = z.object({
  email: z.email().trim().toLowerCase().max(254),
  password: z.string().min(1).max(128),
});

/* The upstream reply is normalised to `{ error, fields? }` so a raw Zod tree
   (or anything else the API might emit) never reaches the browser. */
function upstreamError(data: unknown, fallback: string) {
  const obj = typeof data === "object" && data !== null ? (data as Record<string, unknown>) : {};
  const error = typeof obj.error === "string" ? obj.error : fallback;
  const fields = typeof obj.fields === "object" && obj.fields !== null ? obj.fields : undefined;
  return fields ? { error, fields } : { error };
}

export async function POST(request: Request) {
  const blocked = rejectCrossSite(request);
  if (blocked) return blocked;

  const parsed = loginSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", fields: z.flattenError(parsed.error).fieldErrors }, { status: 400 });
  }

  try {
    const res = await fetch(`${getApiBase()}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
    });

    const data = (await res.json().catch(() => ({}))) as { token?: unknown };
    if (!res.ok) return NextResponse.json(upstreamError(data, "Login failed"), { status: res.status });

    const token = typeof data.token === "string" ? data.token.trim() : "";
    if (!token) return NextResponse.json({ error: "Login failed" }, { status: 502 });

    const out = NextResponse.json({ success: true }, { status: 200 });
    out.cookies.set(AUTH_COOKIE, token, authCookieOptions());
    return out;
  } catch (err) {
    console.error("[api/auth/login]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
