import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

/* Per-process random secret for local development only. The old fixed
   "dev-secret" fallback applied whenever NODE_ENV !== "production" — which
   included the Docker image — so anyone could mint ADMIN tokens. */
const DEV_SECRET = crypto.randomBytes(48).toString("hex");

function getJwtSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET?.trim();
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("NEXTAUTH_SECRET (min 32 chars) is required in production");
  }
  // Unguessable, and tokens simply expire on restart.
  return DEV_SECRET;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = header.split(" ")[1];
  let secret: string;
  try {
    secret = getJwtSecret();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Auth misconfigured" });
  }

  try {
    const decoded = jwt.verify(token, secret, { algorithms: ["HS256"] });
    // A signed token with the wrong shape is still not a session we trust.
    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof decoded.id !== "string" ||
      typeof decoded.email !== "string" ||
      typeof decoded.role !== "string"
    ) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}

export function generateToken(payload: { id: string; email: string; role: string }) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d", algorithm: "HS256" });
}

export function generateOTP(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

export function generateBookingNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  // crypto, not Math.random: booking numbers appear on invoices and must not be guessable.
  const random = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `NEXY-${date}-${random}`;
}

export function calculateGST(amount: number, rate = 0.18): { subtotal: number; gst: number; total: number } {
  const gst = Math.round(amount * rate * 100) / 100;
  return { subtotal: amount, gst, total: amount + gst };
}
