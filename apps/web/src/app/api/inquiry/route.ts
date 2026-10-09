import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { rejectCrossSite } from "@/app/api/_lib/auth";
import { getApiBase } from "@/app/api/_lib/env";
import { SITE_CONFIG } from "@/lib/constants";
import { inquirySchema } from "@/lib/inquiry-schema";
import {
  eventTypeLabel,
  inquirySummary,
  type Inquiry,
  type InquiryFieldErrors,
  type InquiryResponse,
} from "@/lib/inquiry";

/**
 * POST /api/inquiry — the single lead endpoint for every form on the site.
 *
 * Delivery channels (any that are configured run in parallel; the lead counts
 * as received when at least one accepts it):
 *   1. INQUIRY_WEBHOOK_URL  — JSON POST (Google Apps Script → Sheet, Zapier,
 *      Make, Slack workflow, CRM webhook…)
 *   2. RESEND_API_KEY       — email to INQUIRY_EMAIL_TO (defaults to the
 *      company inbox) from INQUIRY_EMAIL_FROM
 *   3. Express backend      — /leads/consultation when NEXT_PUBLIC_API_URL
 *      points at a real, separate API host
 *
 * When nothing accepts the lead the client is told so (503 + whatsapp
 * fallback) — it never shows a fake success.
 */

// Best-effort, per-instance limits (serverless instances don't share memory):
// a loose cap on all requests, a tighter one on accepted submissions so a
// visitor fixing validation errors is never locked out.
const RATE_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 30;
const MAX_SUBMISSIONS = 5;
const MAX_TRACKED_IPS = 5000;
const MAX_BODY_BYTES = 16 * 1024;
const requestHits = new Map<string, number[]>();
const submissionHits = new Map<string, number[]>();

function overLimit(store: Map<string, number[]>, ip: string, max: number) {
  const now = Date.now();
  const recent = (store.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  // Re-insert so Map order is least-recently-seen first, then evict from the
  // front: a flood of new addresses pushes out stale entries, never everyone's.
  store.delete(ip);
  store.set(ip, recent);
  for (const key of store.keys()) {
    if (store.size <= MAX_TRACKED_IPS) break;
    store.delete(key);
  }
  return recent.length > max;
}

/**
 * The visitor's address as the hosting proxy saw it. x-real-ip and
 * x-vercel-forwarded-for are set by the platform; the first x-forwarded-for
 * entry is whatever the client claimed, so only its last hop (appended by the
 * nearest proxy) is used as a fallback.
 */
function clientIp(request: Request) {
  const h = request.headers;
  const direct = h.get("x-real-ip") ?? h.get("x-vercel-forwarded-for")?.split(",")[0];
  if (direct?.trim()) return direct.trim();
  return h.get("x-forwarded-for")?.split(",").pop()?.trim() || "unknown";
}

/** Fields the form renders an error beside; any other issue gets the generic banner. */
const FORM_FIELDS = new Set<keyof InquiryFieldErrors>([
  "name",
  "phone",
  "email",
  "eventType",
  "eventDate",
  "city",
  "guests",
  "budget",
  "message",
]);

/** Prisma EventType has no value for these site-only ids; the Express API gets the closest one. */
const BACKEND_EVENT_TYPE: Record<string, string> = { EVENT_PRODUCTION: "OTHER" };

const UNREADABLE: Extract<InquiryResponse, { ok: false }> = {
  ok: false,
  error: "We couldn't read your inquiry. Please try again, or send it on WhatsApp — your details are filled in.",
  fallback: "whatsapp",
};

const TOO_MANY: InquiryResponse = {
  ok: false,
  error: "Too many requests — please call or WhatsApp us instead.",
  fallback: "whatsapp",
};

function json(body: InquiryResponse, status: number) {
  return NextResponse.json(body, { status });
}

async function deliverWebhook(lead: Record<string, unknown>) {
  const url = process.env.INQUIRY_WEBHOOK_URL;
  if (!url) return null;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`webhook ${res.status}`);
  return "webhook";
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

async function deliverEmail(inquiry: Inquiry, reference: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  const to = process.env.INQUIRY_EMAIL_TO || SITE_CONFIG.email;
  const from = process.env.INQUIRY_EMAIL_FROM || `Nexyyra Website <inquiries@${new URL(SITE_CONFIG.url).hostname.replace(/^www\./, "")}>`;
  const summary = inquirySummary(inquiry);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: to.split(",").map((s) => s.trim()),
      reply_to: inquiry.email,
      subject: `New inquiry ${reference}: ${eventTypeLabel(inquiry.eventType) ?? "Event"} — ${inquiry.name}`,
      text: `${summary}\n\nSource: ${inquiry.source}${inquiry.page ? ` (${inquiry.page})` : ""}\nReference: ${reference}`,
      html: `<pre style="font:14px/1.6 system-ui,sans-serif;white-space:pre-wrap">${escapeHtml(summary)}</pre><p style="color:#666;font:12px system-ui">Source: ${escapeHtml(inquiry.source)} · Reference: ${reference}</p>`,
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`email ${res.status}`);
  return "email";
}

async function deliverBackend(inquiry: Inquiry, requestHost: string | null) {
  // The backend lead schema requires an email address.
  if (!process.env.NEXT_PUBLIC_API_URL || !inquiry.email) return null;
  const base = getApiBase();
  const host = new URL(base).host;
  // Skip localhost in production and never loop back into this app.
  if (/^(localhost|127\.0\.0\.1)(:|$)/.test(host) && process.env.NODE_ENV === "production") return null;
  if (requestHost && host === requestHost) return null;
  const res = await fetch(`${base}/leads/consultation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      eventType: inquiry.eventType ? (BACKEND_EVENT_TYPE[inquiry.eventType] ?? inquiry.eventType) : undefined,
      eventTypeLabel: eventTypeLabel(inquiry.eventType),
      collection: inquiry.collection,
      message: inquiry.message,
      eventDate: inquiry.eventDate,
      city: inquiry.city,
      guests: inquiry.guests,
      budgetRange: inquiry.budget,
      origin: inquiry.source,
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`backend ${res.status}`);
  return "backend";
}

export async function POST(request: Request) {
  // Same rule as every other POST route: only this site's own pages may post.
  // Browsers send text/plain cross-site without a preflight, so both the
  // Origin check and the JSON content type are required.
  const blocked = rejectCrossSite(request);
  if (blocked) return blocked;
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return json(UNREADABLE, 415);
  }

  const ip = clientIp(request);
  if (overLimit(requestHits, ip, MAX_REQUESTS)) return json(TOO_MANY, 429);

  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return json(UNREADABLE, 413);
  const raw = await request.text().catch(() => "");
  if (raw.length > MAX_BODY_BYTES) return json(UNREADABLE, 413);
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(UNREADABLE, 400);
  }

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    // Field issues go beside their field; anything else (unknown keys, a bad
    // source) has no field to sit beside, so the client shows the banner.
    const fieldErrors: InquiryFieldErrors = {};
    let unplaced = false;
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof InquiryFieldErrors | undefined;
      if (key && FORM_FIELDS.has(key)) {
        fieldErrors[key] ??= issue.message;
      } else {
        unplaced = true;
      }
    }
    if (!Object.keys(fieldErrors).length) return json(UNREADABLE, 400);
    if (unplaced) return json({ ...UNREADABLE, fieldErrors }, 400);
    return json({ ok: false, error: "Please check the highlighted fields.", fieldErrors }, 400);
  }

  const inquiry = parsed.data;
  const reference = `NX-${randomUUID().slice(0, 8).toUpperCase()}`;

  // Honeypot filled → pretend success so bots learn nothing; deliver nothing.
  if (inquiry.company_website) return json({ ok: true, reference }, 200);
  if (overLimit(submissionHits, ip, MAX_SUBMISSIONS)) return json(TOO_MANY, 429);

  const fields: Partial<typeof inquiry> = { ...inquiry };
  delete fields.company_website;
  const lead = {
    reference,
    receivedAt: new Date().toISOString(),
    ...fields,
    eventTypeLabel: eventTypeLabel(inquiry.eventType),
    summary: inquirySummary(inquiry),
  };

  const results = await Promise.allSettled([
    deliverWebhook(lead),
    deliverEmail(inquiry, reference),
    deliverBackend(inquiry, request.headers.get("host")),
  ]);

  const delivered = results.filter((r) => r.status === "fulfilled" && r.value).length;
  const failures = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");
  for (const f of failures) console.error("[inquiry] delivery failed:", f.reason instanceof Error ? f.reason.message : f.reason);

  if (delivered === 0) {
    // Last-resort record in the server logs so the lead is recoverable.
    console.error(
      `[inquiry] ${reference} NOT DELIVERED — configure INQUIRY_WEBHOOK_URL or RESEND_API_KEY.\n${lead.summary}`,
    );
    return json(
      {
        ok: false,
        error: "We couldn't send your inquiry online right now. Please send it on WhatsApp — your details are already filled in.",
        fallback: "whatsapp",
      },
      503,
    );
  }

  return json({ ok: true, reference }, 200);
}
