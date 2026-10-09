import rateLimit, { type Options } from "express-rate-limit";
import type { Request } from "express";

/**
 * Per-route rate limiters, all keyed by client IP. `app.set("trust proxy", 1)`
 * in index.ts makes `req.ip` the real client behind nginx / a load balancer
 * instead of the proxy itself, so every visitor gets their own bucket.
 */

const WINDOW_15_MIN = 15 * 60 * 1000;

/** IPv6 clients get a /64 bucket so one host can't rotate through its block. */
function ipKey(req: Request): string {
  const ip = req.ip ?? "unknown";
  if (ip.includes(":") && !ip.startsWith("::ffff:")) {
    return ip.split(":").slice(0, 4).join(":");
  }
  return ip;
}

function makeLimiter(limit: number, windowMs: number, message: string, extra: Partial<Options> = {}) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    keyGenerator: ipKey,
    message: { error: message },
    ...extra,
  });
}

const TOO_MANY = "Too many requests. Please try again in a few minutes.";

/** Whole-API ceiling (kept from the original setup). */
export const globalLimiter = makeLimiter(200, WINDOW_15_MIN, TOO_MANY);

/** Default for read-mostly routers: venues, vendors, cms, bookings, payments, admin. */
export const moderateLimiter = makeLimiter(120, WINDOW_15_MIN, TOO_MANY);

/** Credential endpoints: slows password guessing and signup spam. */
export const authLimiter = makeLimiter(10, WINDOW_15_MIN, "Too many sign-in attempts. Please wait 15 minutes.", {
  skipSuccessfulRequests: true,
});
export const registerLimiter = makeLimiter(5, 60 * 60 * 1000, "Too many accounts created from this network. Try later.");
export const otpLimiter = makeLimiter(5, WINDOW_15_MIN, "Too many OTP requests. Please wait 15 minutes.");

/** Lead + newsletter forms: generous for humans, hostile to bots. */
export const leadLimiter = makeLimiter(10, WINDOW_15_MIN, "Too many submissions. Please try again later.");

/** AI routes call a paid upstream — keep them tight. */
export const aiLimiter = makeLimiter(30, WINDOW_15_MIN, "The assistant is busy. Please try again shortly.");

/** Price calculator: public, unauthenticated, hits the DB per call. */
export const calculateLimiter = makeLimiter(60, WINDOW_15_MIN, TOO_MANY);
