import { Router } from "express";
import { authenticate, AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";
import Razorpay from "razorpay";
import crypto from "crypto";

const router = Router();

function getRazorpayClient() {
  const key_id = process.env.RAZORPAY_KEY_ID?.trim();
  const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!key_id || !key_secret) return null;
  return new Razorpay({ key_id, key_secret });
}

function computeRazorpayCheckoutSignature(args: {
  orderId: string;
  paymentId: string;
  secret: string;
}): string {
  return crypto
    .createHmac("sha256", args.secret)
    .update(`${args.orderId}|${args.paymentId}`)
    .digest("hex");
}

function computeRazorpayWebhookSignature(args: { body: string; secret: string }): string {
  return crypto.createHmac("sha256", args.secret).update(args.body).digest("hex");
}

router.post("/razorpay/create-order", authenticate, async (req: AuthRequest, res) => {
  try {
    const { bookingId, amount } = req.body as { bookingId?: string; amount?: number };
    if (!bookingId) return res.status(400).json({ error: "bookingId required" });

    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, userId: req.user!.id },
    });
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const rp = getRazorpayClient();
    if (!rp) return res.status(500).json({ error: "Razorpay is not configured" });

    const requested = typeof amount === "number" && amount > 0 ? amount : undefined;
    const advance = Math.max(1, Math.round((requested ?? booking.totalAmount * 0.3) * 100) / 100);
    const amountPaise = Math.round(advance * 100);

    const order = await rp.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `rcpt_${booking.bookingNumber}`,
      notes: {
        bookingId: booking.id,
        bookingNumber: booking.bookingNumber,
        userId: req.user!.id,
      },
    });

    const payment = await prisma.payment.create({
      data: {
        bookingId,
        userId: req.user!.id,
        amount: advance,
        provider: "razorpay",
        providerId: order.id,
        status: "PENDING",
        invoiceNumber: `INV-${booking.bookingNumber}`,
      },
    });

    res.json({
      orderId: order.id,
      amount: payment.amount,
      currency: "INR",
      paymentId: payment.id,
      key: process.env.RAZORPAY_KEY_ID,
      bookingNumber: booking.bookingNumber,
    });
  } catch {
    res.status(500).json({ error: "Razorpay order creation failed" });
  }
});

router.post("/razorpay/verify", authenticate, async (req: AuthRequest, res) => {
  try {
    const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim();
    if (!key_secret) return res.status(500).json({ error: "Razorpay is not configured" });

    const {
      paymentId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body as {
      paymentId?: string;
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
    };

    if (!paymentId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing Razorpay fields" });
    }

    const payment = await prisma.payment.findFirst({
      where: { id: paymentId, userId: req.user!.id },
      include: { booking: true },
    });
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    if (payment.provider !== "razorpay") return res.status(400).json({ error: "Invalid provider" });
    if (payment.providerId !== razorpay_order_id) return res.status(400).json({ error: "Order mismatch" });

    const expected = computeRazorpayCheckoutSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      secret: key_secret,
    });
    if (expected !== razorpay_signature) return res.status(400).json({ error: "Invalid signature" });

    const updated = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "PAID",
        providerId: razorpay_order_id,
        metadata: { razorpay_payment_id, razorpay_signature },
      },
    });

    await prisma.booking.update({
      where: { id: payment.bookingId },
      data: { paymentStatus: "PAID", status: "CONFIRMED" },
    });

    res.json({ message: "Payment verified", payment: updated });
  } catch {
    res.status(500).json({ error: "Payment verification failed" });
  }
});

// Raw webhook body verification needs express.raw middleware at mount time.
// If you want webhooks, mount this route with raw body in server/src/index.ts.
router.post("/razorpay/webhook", async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
    if (!secret) return res.status(400).json({ error: "Webhook not configured" });

    const signature = String(req.headers["x-razorpay-signature"] || "");
    const rawBody = (req as unknown as { rawBody?: string }).rawBody;
    if (!rawBody) return res.status(400).json({ error: "Raw body missing" });

    const expected = computeRazorpayWebhookSignature({ body: rawBody, secret });
    if (expected !== signature) return res.status(400).json({ error: "Invalid webhook signature" });

    const payload = JSON.parse(rawBody) as any;
    const entity = payload?.payload?.payment?.entity;
    const orderId = entity?.order_id as string | undefined;
    const paymentId = entity?.id as string | undefined;
    const status = entity?.status as string | undefined;

    if (!orderId || !paymentId) return res.json({ ok: true });

    if (status === "captured") {
      const payment = await prisma.payment.findFirst({ where: { provider: "razorpay", providerId: orderId } });
      if (payment && payment.status !== "PAID") {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: "PAID", metadata: { razorpay_payment_id: paymentId } },
        });
        await prisma.booking.update({
          where: { id: payment.bookingId },
          data: { paymentStatus: "PAID", status: "CONFIRMED" },
        });
      }
    }

    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Webhook error" });
  }
});

export default router;
