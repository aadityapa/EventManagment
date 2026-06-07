import { Router } from "express";
import { authenticate, AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";

const router = Router();

router.post("/create-order", authenticate, async (req: AuthRequest, res) => {
  try {
    const { bookingId, amount, provider = "razorpay" } = req.body;
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, userId: req.user!.id },
    });
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const payment = await prisma.payment.create({
      data: {
        bookingId,
        userId: req.user!.id,
        amount: amount || booking.totalAmount,
        provider,
        providerId: orderId,
        status: "PENDING",
        invoiceNumber: `INV-${booking.bookingNumber}`,
      },
    });

    res.json({
      orderId,
      amount: payment.amount,
      currency: "INR",
      paymentId: payment.id,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch {
    res.status(500).json({ error: "Payment order creation failed" });
  }
});

router.post("/verify", authenticate, async (req: AuthRequest, res) => {
  try {
    const { paymentId, providerPaymentId } = req.body;
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: { status: "PAID", providerId: providerPaymentId },
    });

    await prisma.booking.update({
      where: { id: payment.bookingId },
      data: { paymentStatus: "PAID", status: "CONFIRMED" },
    });

    res.json({ message: "Payment verified", payment });
  } catch {
    res.status(500).json({ error: "Payment verification failed" });
  }
});

export default router;
