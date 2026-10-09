import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "../lib/prisma";
import { emailSchema, parseBody, phoneSchema, sendServerError, shortText } from "../lib/http";
import { authLimiter, otpLimiter, registerLimiter } from "../lib/rate-limit";
import { authenticate, AuthRequest, generateOTP, generateToken } from "../middleware/auth";

const router = Router();

const registerSchema = z.object({
  name: shortText(120).min(2),
  email: emailSchema,
  password: z.string().min(8).max(128).optional(),
  phone: phoneSchema.optional(),
  role: z.enum(["CLIENT", "VENDOR"]).default("CLIENT"),
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
});

function publicUser(user: { id: string; name: string; email: string; role: string }) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

router.post("/register", registerLimiter, async (req, res) => {
  const data = parseBody(registerSchema, req, res);
  if (!data) return;
  try {
    const existing = await prisma.user.findUnique({ where: { email: data.email }, select: { id: true } });
    if (existing) return res.status(409).json({ error: "An account with this email already exists" });

    const passwordHash = data.password ? await bcrypt.hash(data.password, 12) : null;
    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, phone: data.phone, passwordHash, role: data.role },
    });

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    res.status(201).json({ user: publicUser(user), token });
  } catch (err) {
    sendServerError(res, "auth.register", err, "Registration failed");
  }
});

router.post("/login", authLimiter, async (req, res) => {
  const data = parseBody(loginSchema, req, res);
  if (!data) return;
  try {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    // Compare against a dummy hash when the user is unknown so response time
    // does not reveal which emails are registered.
    const hash = user?.passwordHash ?? DUMMY_HASH;
    const valid = await bcrypt.compare(data.password, hash);
    if (!user?.passwordHash || !valid) return res.status(401).json({ error: "Invalid email or password" });

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    res.json({ user: publicUser(user), token });
  } catch (err) {
    sendServerError(res, "auth.login", err, "Login failed");
  }
});

const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);

/* OTP login is OFF unless OTP_LOGIN_ENABLED=true. The codes were never
   delivered (no SMS/email integration), any email — including the admin's —
   could be targeted, and there was no attempt limit, so the 900k-code space
   could be brute-forced into an account takeover. The web app does not use
   these routes. Before enabling: wire delivery, hash stored codes and cap
   attempts per code. */
const OTP_ENABLED = process.env.OTP_LOGIN_ENABLED === "true";
const PRIVILEGED_ROLES = new Set(["ADMIN", "STAFF"]);

const otpSendSchema = z
  .object({ email: emailSchema.optional(), phone: phoneSchema.optional() })
  .refine((v) => v.email || v.phone, { message: "Email or phone is required", path: ["email"] });

const otpVerifySchema = z.object({
  email: emailSchema,
  otp: z.string().trim().regex(/^\d{6}$/, "OTP must be 6 digits"),
});

router.post("/otp/send", otpLimiter, async (req, res) => {
  if (!OTP_ENABLED) return res.status(404).json({ error: "Not found" });
  const data = parseBody(otpSendSchema, req, res);
  if (!data) return;
  try {
    const otp = generateOTP();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    let user = await prisma.user.findFirst({
      where: data.email ? { email: data.email } : { phone: data.phone },
    });

    if (!user && data.email) {
      user = await prisma.user.create({
        data: { email: data.email, name: data.email.split("@")[0], phone: data.phone, otpCode: otp, otpExpires: expires },
      });
    } else if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { otpCode: otp, otpExpires: expires },
      });
    }

    // In production: send via SMS/email. Same response whether or not the user exists.
    res.json({ message: "If the account exists, an OTP has been sent", ...(process.env.NODE_ENV === "development" && { otp }) });
  } catch (err) {
    sendServerError(res, "auth.otp.send", err, "Failed to send OTP");
  }
});

router.post("/otp/verify", otpLimiter, async (req, res) => {
  if (!OTP_ENABLED) return res.status(404).json({ error: "Not found" });
  const data = parseBody(otpVerifySchema, req, res);
  if (!data) return;
  try {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (
      !user ||
      PRIVILEGED_ROLES.has(user.role) ||
      user.otpCode !== data.otp ||
      !user.otpExpires ||
      user.otpExpires < new Date()
    ) {
      return res.status(401).json({ error: "Invalid or expired OTP" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { otpCode: null, otpExpires: null, emailVerified: new Date() },
    });

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    res.json({ user: publicUser(user), token });
  } catch (err) {
    sendServerError(res, "auth.otp.verify", err, "OTP verification failed");
  }
});

router.get("/me", authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, name: true, email: true, phone: true, role: true, avatar: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    sendServerError(res, "auth.me", err, "Failed to fetch user");
  }
});

export default router;
