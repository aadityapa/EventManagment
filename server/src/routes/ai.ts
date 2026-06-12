import { Router } from "express";
import prisma from "../lib/prisma";
import { z } from "zod";

const router = Router();

type ChatRole = "system" | "user" | "assistant";
type StoredChatMessage = { role: ChatRole; content: string; timestamp?: string };

function getOpenAIKey(): string | null {
  const key = process.env.OPENAI_API_KEY?.trim();
  return key ? key : null;
}

async function tryOpenAIChatReply(args: {
  key: string;
  messages: Array<{ role: ChatRole; content: string }>;
}): Promise<string | null> {
  try {
    const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${args.key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        max_tokens: 300,
        messages: args.messages,
      }),
    });

    if (!res.ok) return null;
    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    return content || null;
  } catch {
    return null;
  }
}

function extractJsonObject(text: string): unknown | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

const planAiSchema = z.object({
  summary: z.string().min(1),
  nextQuestions: z.array(z.string()).min(1).max(8),
  moodboardKeywords: z.array(z.string()).min(1).max(12),
  riskChecklist: z.array(z.string()).min(1).max(12),
});

router.post("/chat", async (req, res) => {
  try {
    const { message, sessionId } = (req.body ?? {}) as { message?: unknown; sessionId?: unknown };
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const sid =
      typeof sessionId === "string" && sessionId.trim()
        ? sessionId.trim()
        : `session_${Date.now()}`;

    const nowIso = new Date().toISOString();
    const session = await prisma.chatSession.upsert({
      where: { sessionId: sid },
      create: {
        sessionId: sid,
        messages: [{ role: "user", content: message, timestamp: nowIso }],
      },
      update: { messages: { push: { role: "user", content: message, timestamp: nowIso } } },
    });

    const lowerMsg = message.toLowerCase();
    let reply =
      "Thank you for reaching out to Glitz Events & Promotions! How can I help you plan your perfect event today?";
    let leadScore = session.leadScore;

    if (lowerMsg.includes("wedding")) {
      reply =
        "Wonderful! Glitz Events & Promotions specializes in luxury weddings and destination weddings. Our packages start from ₹5 Lakhs. Would you like to schedule a free consultation?";
      leadScore += 20;
    } else if (lowerMsg.includes("corporate")) {
      reply =
        "We excel at corporate events, conferences, and product launches. We've managed 500+ corporate events. Shall I connect you with our corporate events specialist?";
      leadScore += 20;
    } else if (lowerMsg.includes("budget") || lowerMsg.includes("price") || lowerMsg.includes("cost")) {
      reply =
        "Our event packages are customized based on your requirements. Use our Event Budget Calculator on the website, or share your budget range and guest count for a personalized quote.";
      leadScore += 15;
    } else if (lowerMsg.includes("book") || lowerMsg.includes("booking")) {
      reply =
        "Great! You can book instantly through our online booking system at /book-event. It takes just 5 minutes. Would you like me to guide you through the process?";
      leadScore += 30;
    } else if (lowerMsg.includes("venue")) {
      reply =
        "We have 200+ premium venues in our marketplace. Browse at /venues or tell me your city and guest count for personalized recommendations.";
      leadScore += 10;
    }

    const key = getOpenAIKey();
    if (key) {
      const history = (Array.isArray(session.messages) ? (session.messages as unknown as StoredChatMessage[]) : [])
        .slice(-12)
        .map((m) => ({
          role: m.role === "system" || m.role === "assistant" || m.role === "user" ? m.role : "user",
          content: String(m.content ?? ""),
        }))
        .filter((m) => m.content.trim().length > 0);

      const system: StoredChatMessage = {
        role: "system",
        content:
          "You are Glitz Events & Promotions' AI assistant for a luxury event management website in India. Be warm, confident, and concise. Ask 1-2 clarifying questions when needed (event type, city, date, guest count, budget). If the user is ready, guide them to book at /book-event or leave details for a consultation. Do not claim you performed actions you cannot actually do.",
      };

      const aiReply = await tryOpenAIChatReply({
        key,
        messages: [system, ...history],
      });
      if (aiReply) reply = aiReply;
    }

    await prisma.chatSession.update({
      where: { id: session.id },
      data: {
        messages: { push: { role: "assistant", content: reply, timestamp: new Date().toISOString() } },
        leadScore,
      },
    });

    res.json({ reply, response: reply, sessionId: session.sessionId, leadScore });
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

    const recommendations = {
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
    };

    let ai: z.infer<typeof planAiSchema> | null = null;
    const key = getOpenAIKey();
    if (key) {
      const venueNames = venueSuggestions
        .map((venue) => `${venue.name} (${venue.city})`)
        .slice(0, 3);
      const vendorNames = vendorSuggestions
        .filter((vendor): vendor is NonNullable<typeof vendor> => vendor != null)
        .map((vendor) => vendor.businessName || "Vendor")
        .slice(0, 4);

      const prompt = [
        "Return ONLY a valid JSON object matching this exact schema:",
        `{ "summary": string, "nextQuestions": string[], "moodboardKeywords": string[], "riskChecklist": string[] }`,
        "",
        `Context: luxury event planning in India for Glitz Events & Promotions.`,
        `Event: ${eventType || "Not specified"}`,
        `City: ${city || "Not specified"}`,
        `Guests: ${guestCount || 100}`,
        `Budget: ₹${budget || 500000}`,
        preferences ? `Preferences: ${preferences}` : "",
        venueNames.length ? `Suggested venues: ${venueNames.join("; ")}` : "",
        vendorNames.length ? `Suggested vendors: ${vendorNames.join("; ")}` : "",
        "",
        "Rules: be concise; no markdown; no extra keys; arrays must be short and practical.",
      ]
        .filter(Boolean)
        .join("\n");

      const raw = await tryOpenAIChatReply({
        key,
        messages: [
          { role: "system", content: "You are an expert luxury event planner. Output JSON only." },
          { role: "user", content: prompt },
        ],
      });

      const json = raw ? extractJsonObject(raw) : null;
      const parsed = planAiSchema.safeParse(json);
      if (parsed.success) ai = parsed.data;
    }

    res.json({
      recommendations,
      ai,
      input: { eventType, guestCount, budget, city, preferences },
    });
  } catch {
    res.status(500).json({ error: "AI planning failed" });
  }
});

export default router;
