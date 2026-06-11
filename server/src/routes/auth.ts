import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest, generateOTP, generateToken } from "../middleware/auth";

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8).optional(),
  phone: z.string().optional(),
  role: z.enum(["CLIENT", "VENDOR"]).default("CLIENT"),
});

router.post("/register", async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return res.status(400).json({ error: "Email already registered" });

    const passwordHash = data.password ? await bcrypt.hash(data.password, 12) : null;
    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, phone: data.phone, passwordHash, role: data.role },
    });

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user?.passwordHash) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch {
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/otp/send", async (req, res) => {
  try {
    const { email, phone } = req.body;
    const otp = generateOTP();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    let user = await prisma.user.findFirst({
      where: email ? { email } : { phone },
    });

    if (!user && email) {
      user = await prisma.user.create({
        data: { email, name: email.split("@")[0], phone, otpCode: otp, otpExpires: expires },
      });
    } else if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { otpCode: otp, otpExpires: expires },
      });
    }

    // In production: send via SMS/email
    res.json({ message: "OTP sent", ...(process.env.NODE_ENV === "development" && { otp }) });
  } catch {
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

router.post("/otp/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.otpCode !== otp || !user.otpExpires || user.otpExpires < new Date()) {
      return res.status(401).json({ error: "Invalid or expired OTP" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { otpCode: null, otpExpires: null, emailVerified: new Date() },
    });

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch {
    res.status(500).json({ error: "OTP verification failed" });
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
  } catch {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;
