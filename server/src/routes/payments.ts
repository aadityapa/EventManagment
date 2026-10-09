import { Router } from "express";
import { z } from "zod";
import Razorpay from "razorpay";
import crypto from "crypto";
import { authenticate, AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";
import { idSchema, logError, parseBody, sendServerError } from "../lib/http";

const router = Router();

function getRazorpayClient() {
  const key_id = process.env.RAZORPAY_KEY_ID?.trim();
  const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!key_id || !key_secret) return null;
  return new Razorpay({ key_id, key_secret });
}

function computeRazorpayCheckoutSignature(args: { orderId: string; paymentId: string; secret: string }): string {
  return crypto.createHmac("sha256", args.secret).update(`${args.orderId}|${args.paymentId}`).digest("hex");
}

function computeRazorpayWebhookSignature(args: { body: string; secret: string }): string {
  return crypto.createHmac("sha256", args.secret).update(args.body).digest("hex");
}

/** Constant-time hex signature comparison (plain `!==` leaks timing). */
function signaturesMatch(expected: string, received: string): boolean {
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(received, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Advance due at checkout — always computed server-side from the booking. */
const ADVANCE_RATE = 0.3;

const NOT_CONFIGURED = { error: "Online payment is not available right now" };

/** Sum of captured payments → booking payment status. */
async function settleBooking(bookingId: string) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) return;
  const paid = await prisma.payment.aggregate({
    where: { bookingId, status: "PAID" },
    _sum: { amount: true },
  });
  const total = paid._sum.amount ?? 0;
  const fullyPaid = total + 0.5 >= booking.totalAmount;
  await prisma.booking.update({
    where: { id: bookingId },
    data: { paymentStatus: fullyPaid ? "PAID" : "PARTIAL", status: "CONFIRMED" },
  });
}

/* Any client-supplied `amount` is dropped by the schema: accepting it let a
   visitor pay ₹1 and still get the booking marked PAID/CONFIRMED. */
const createOrderSchema = z.object({ bookingId: idSchema });

router.post("/razorpay/create-order", authenticate, async (req: AuthRequest, res) => {
  const data = parseBody(createOrderSchema, req, res);
  if (!data) return;
  try {
    const booking = await prisma.booking.findFirst({
      where: { id: data.bookingId, userId: req.user!.id },
    });
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const rp = getRazorpayClient();
    if (!rp) {
      logError("payments.create-order", new Error("RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET not set"));
      return res.status(503).json(NOT_CONFIGURED);
    }

    if (booking.paymentStatus === "PAID") return res.status(400).json({ error: "Booking already paid" });
    const advance = Math.max(1, Math.round(booking.totalAmount * ADVANCE_RATE * 100) / 100);
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
        bookingId: booking.id,
        userId: req.user!.id,
        amount: advance,
        provider: "razorpay",
        providerId: order.id,
        status: "PENDING",
        // Unique per attempt: a retried checkout must not collide on the invoice number.
        invoiceNumber: `INV-${booking.bookingNumber}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`,
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
  } catch (err) {
    sendServerError(res, "payments.create-order", err, "Could not start the payment");
  }
});

const razorpayId = z.string().trim().min(1).max(64);
const verifySchema = z.object({
  paymentId: idSchema,
  razorpay_order_id: razorpayId,
  razorpay_payment_id: razorpayId,
  razorpay_signature: z.string().trim().regex(/^[0-9a-f]{64}$/i, "Invalid signature"),
});

router.post("/razorpay/verify", authenticate, async (req: AuthRequest, res) => {
  const data = parseBody(verifySchema, req, res);
  if (!data) return;
  try {
    const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim();
    const rp = getRazorpayClient();
    if (!key_secret || !rp) {
      logError("payments.verify", new Error("RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET not set"));
      return res.status(503).json(NOT_CONFIGURED);
    }

    const payment = await prisma.payment.findFirst({
      where: { id: data.paymentId, userId: req.user!.id },
    });
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    if (payment.provider !== "razorpay") return res.status(400).json({ error: "Invalid provider" });
    if (payment.providerId !== data.razorpay_order_id) return res.status(400).json({ error: "Order mismatch" });

    const expected = computeRazorpayCheckoutSignature({
      orderId: data.razorpay_order_id,
      paymentId: data.razorpay_payment_id,
      secret: key_secret,
    });
    if (!signaturesMatch(expected, data.razorpay_signature)) return res.status(400).json({ error: "Invalid signature" });

    // Confirm with Razorpay that this payment was captured for this order and amount.
    const rpPayment = await rp.payments.fetch(data.razorpay_payment_id);
    const expectedPaise = Math.round(payment.amount * 100);
    if (
      rpPayment.order_id !== data.razorpay_order_id ||
      Number(rpPayment.amount) !== expectedPaise ||
      !["captured", "authorized"].includes(String(rpPayment.status))
    ) {
      return res.status(400).json({ error: "Payment not captured for this order" });
    }

    const updated = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "PAID",
        metadata: { razorpay_payment_id: data.razorpay_payment_id },
      },
    });

    await settleBooking(payment.bookingId);

    res.json({ message: "Payment verified", payment: updated });
  } catch (err) {
    sendServerError(res, "payments.verify", err, "Payment verification failed");
  }
});

/* Webhook payload — only the fields we act on; everything else is ignored. */
const webhookSchema = z.object({
  payload: z
    .object({
      payment: z
        .object({
          entity: z
            .object({
              id: z.string().optional(),
              order_id: z.string().optional(),
              status: z.string().optional(),
              amount: z.coerce.number().optional(),
            })
            .optional(),
        })
        .optional(),
    })
    .optional(),
});

// The JSON body parser in index.ts keeps `rawBody`, which the signature covers.
router.post("/razorpay/webhook", async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
    if (!secret) return res.status(400).json({ error: "Webhook not configured" });

    const signature = String(req.headers["x-razorpay-signature"] || "");
    const rawBody = (req as unknown as { rawBody?: string }).rawBody;
    if (!rawBody) return res.status(400).json({ error: "Raw body missing" });

    const expected = computeRazorpayWebhookSignature({ body: rawBody, secret });
    if (!signaturesMatch(expected, signature)) return res.status(400).json({ error: "Invalid webhook signature" });

    const parsed = webhookSchema.safeParse(JSON.parse(rawBody));
    if (!parsed.success) return res.json({ ok: true });

    const entity = parsed.data.payload?.payment?.entity;
    const orderId = entity?.order_id;
    const paymentId = entity?.id;
    if (!orderId || !paymentId) return res.json({ ok: true });

    if (entity.status === "captured") {
      const payment = await prisma.payment.findFirst({ where: { provider: "razorpay", providerId: orderId } });
      const capturedPaise = Number(entity.amount);
      if (payment && payment.status !== "PAID" && capturedPaise === Math.round(payment.amount * 100)) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: "PAID", metadata: { razorpay_payment_id: paymentId } },
        });
        await settleBooking(payment.bookingId);
      }
    }

    res.json({ ok: true });
  } catch (err) {
    sendServerError(res, "payments.webhook", err, "Webhook error");
  }
});

export default router;
