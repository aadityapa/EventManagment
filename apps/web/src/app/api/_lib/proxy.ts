import { NextResponse } from "next/server";
import { getAuthToken } from "./auth";
import { getApiBase } from "./env";

export async function proxyAuthedJson(args: {
  path: string;
  method: "GET" | "POST" | "PATCH";
  body?: unknown;
}) {
  const token = await getAuthToken();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const base = getApiBase();
  const res = await fetch(`${base}${args.path.startsWith("/") ? args.path : `/${args.path}`}`, {
    method: args.method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: args.body === undefined ? undefined : JSON.stringify(args.body),
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function proxyPublicJson(args: {
  path: string;
  method: "GET" | "POST";
  body?: unknown;
}) {
  const base = getApiBase();
  const res = await fetch(`${base}${args.path.startsWith("/") ? args.path : `/${args.path}`}`, {
    method: args.method,
    headers: { "Content-Type": "application/json" },
    body: args.body === undefined ? undefined : JSON.stringify(args.body),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

