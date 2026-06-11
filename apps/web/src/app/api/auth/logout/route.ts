import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "../../_lib/auth";

export async function POST() {
  const out = NextResponse.json({ success: true }, { status: 200 });
  out.cookies.set(AUTH_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return out;
}

