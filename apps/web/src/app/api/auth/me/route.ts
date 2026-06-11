import { NextResponse } from "next/server";
import { getAuthToken } from "../../_lib/auth";
import { getApiBase } from "../../_lib/env";

export async function GET() {
  try {
    const token = await getAuthToken();
    if (!token) return NextResponse.json({ authenticated: false }, { status: 200 });

    const base = getApiBase();
    const res = await fetch(`${base}/auth/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return NextResponse.json({ authenticated: false }, { status: 200 });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json({ authenticated: true, ...data }, { status: 200 });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}

