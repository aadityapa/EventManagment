import { NextResponse } from "next/server";
import { AUTH_COOKIE, authCookieOptions } from "../../_lib/auth";
import { getApiBase } from "../../_lib/env";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const base = getApiBase();

    const res = await fetch(`${base}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = (await res.json().catch(() => ({}))) as { token?: string };
    if (!res.ok) return NextResponse.json(data, { status: res.status });

    const token = data.token?.trim();
    if (!token) return NextResponse.json({ error: "Missing token" }, { status: 502 });

    const out = NextResponse.json({ success: true }, { status: 200 });
    out.cookies.set(AUTH_COOKIE, token, authCookieOptions());
    return out;
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}

