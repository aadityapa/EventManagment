import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = "glitz_token";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const protectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  if (!protectedRoute) return NextResponse.next();

  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (token && token.trim()) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};

