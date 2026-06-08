import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.post("/chat", async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const session = await prisma.chatSession.upsert({
      where: { sessionId: sessionId || `session_${Date.now()}` },
      create: { sessionId: sessionId || `session_${Date.now()}`, messages: [{ role: "user", content: message, timestamp: new Date() }] },
      update: { messages: { push: { role: "user", content: message, timestamp: new Date() } } },
    });

    const lowerMsg = message.toLowerCase();
    let response = "Thank you for reaching out to Glitz Events & Promotions! How can I help you plan your perfect event today?";
    let leadScore = session.leadScore;

    if (lowerMsg.includes("wedding")) {
      response = "Wonderful! Glitz Events & Promotions specializes in luxury weddings and destination weddings. Our packages start from ₹5 Lakhs. Would you like to schedule a free consultation?";
      leadScore += 20;
    } else if (lowerMsg.includes("corporate")) {
      response = "We excel at corporate events, conferences, and product launches. We've managed 500+ corporate events. Shall I connect you with our corporate events specialist?";
      leadScore += 20;
    } else if (lowerMsg.includes("budget") || lowerMsg.includes("price") || lowerMsg.includes("cost")) {
      response = "Our event packages are customized based on your requirements. Use our Event Budget Calculator on the website, or share your budget range and guest count for a personalized quote.";
      leadScore += 15;
    } else if (lowerMsg.includes("book") || lowerMsg.includes("booking")) {
      response = "Great! You can book instantly through our online booking system at /book-event. It takes just 5 minutes. Would you like me to guide you through the process?";
      leadScore += 30;
    } else if (lowerMsg.includes("venue")) {
      response = "We have 200+ premium venues in our marketplace. Browse at /venues or tell me your city and guest count for personalized recommendations.";
      leadScore += 10;
    }

    await prisma.chatSession.update({
      where: { id: session.id },
      data: {
        messages: { push: { role: "assistant", content: response, timestamp: new Date() } },
        leadScore,
      },
    });

    res.json({ response, sessionId: session.sessionId, leadScore });
  } catch {
    res.status(500).json({ error: "Chat failed" });
  }
});

router.post("/plan", async (req, res) => {
  try {
    const { eventType, guestCount, budget, city, preferences } = req.body;

    const venueSuggestions = await prisma.venue.findMany({
      where: {
        ...(city && { city: { contains: city, mode: "insensitive" } }),
        capacity: { gte: guestCount || 50 },
        pricePerDay: { lte: (budget || 500000) * 0.4 },
      },
      take: 3,
      orderBy: { rating: "desc" },
    });

    const vendorCategories = ["photographers", "decorators", "caterers", "djs"];
    const vendorSuggestions = await Promise.all(
      vendorCategories.map((cat) =>
        prisma.vendor.findFirst({
          where: { category: cat, ...(city && { city: { contains: city, mode: "insensitive" } }) },
          orderBy: { rating: "desc" },
        })
      )
    );

    const timeline = [
      { phase: "6 months before", tasks: ["Set budget", "Choose venue", "Book vendors"] },
      { phase: "3 months before", tasks: ["Finalize guest list", "Menu tasting", "Send invitations"] },
      { phase: "1 month before", tasks: ["Final headcount", "Rehearsal", "Confirm logistics"] },
      { phase: "Event week", tasks: ["Setup coordination", "Vendor briefing", "Final walkthrough"] },
    ];

    res.json({
      recommendations: {
        venues: venueSuggestions,
        vendors: vendorSuggestions.filter(Boolean),
        budgetBreakdown: {
          venue: (budget || 500000) * 0.35,
          catering: (budget || 500000) * 0.25,
          decoration: (budget || 500000) * 0.15,
          entertainment: (budget || 500000) * 0.1,
          photography: (budget || 500000) * 0.1,
          miscellaneous: (budget || 500000) * 0.05,
        },
        timeline,
        tips: [
          `For ${eventType || "your event"} with ${guestCount || 100} guests, book 6-8 months in advance`,
          "Consider off-season dates for 20-30% savings",
          "Bundle services through Glitz for exclusive discounts",
        ],
      },
    });
  } catch {
    res.status(500).json({ error: "AI planning failed" });
  }
});

export default router;
