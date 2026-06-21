import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

function getJwtSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET?.trim();
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("NEXTAUTH_SECRET is required in production");
  }
  return "dev-secret";
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
    const decoded = jwt.verify(token, secret) as { id: string; email: string; role: string };
    req.user = decoded;
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
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateBookingNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `Nexy-${date}-${random}`;
}

export function calculateGST(amount: number, rate = 0.18): { subtotal: number; gst: number; total: number } {
  const gst = Math.round(amount * rate * 100) / 100;
  return { subtotal: amount, gst, total: amount + gst };
}
