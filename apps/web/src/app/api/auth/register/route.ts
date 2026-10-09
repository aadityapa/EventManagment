import { NextResponse } from "next/server";
import { z } from "zod";
import { AUTH_COOKIE, authCookieOptions, rejectCrossSite } from "../../_lib/auth";
import { getApiBase } from "../../_lib/env";

const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().trim().toLowerCase().max(254),
  password: z.string().min(8).max(128),
  phone: z
    .string()
    .trim()
    .min(6)
    .max(20)
    .regex(/^[+\d\s()-]+$/, "Invalid phone number")
    .optional(),
  // Self-service signup is for clients only; vendor accounts are provisioned by staff.
});

function upstreamError(data: unknown, fallback: string) {
  const obj = typeof data === "object" && data !== null ? (data as Record<string, unknown>) : {};
  const error = typeof obj.error === "string" ? obj.error : fallback;
  const fields = typeof obj.fields === "object" && obj.fields !== null ? obj.fields : undefined;
  return fields ? { error, fields } : { error };
}

export async function POST(request: Request) {
  const blocked = rejectCrossSite(request);
  if (blocked) return blocked;

  const parsed = registerSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", fields: z.flattenError(parsed.error).fieldErrors }, { status: 400 });
  }

  try {
    const res = await fetch(`${getApiBase()}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...parsed.data, role: "CLIENT" }),
      cache: "no-store",
    });

    const data = (await res.json().catch(() => ({}))) as { token?: unknown };
    if (!res.ok) return NextResponse.json(upstreamError(data, "Registration failed"), { status: res.status });

    const token = typeof data.token === "string" ? data.token.trim() : "";
    if (!token) return NextResponse.json({ error: "Registration failed" }, { status: 502 });

    const out = NextResponse.json({ success: true }, { status: 200 });
    out.cookies.set(AUTH_COOKIE, token, authCookieOptions());
    return out;
  } catch (err) {
    console.error("[api/auth/register]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
