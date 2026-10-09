import { Router } from "express";
import { randomUUID } from "crypto";
import { z } from "zod";
import prisma from "../lib/prisma";
import { logError, longText, parseBody, sendServerError, shortText } from "../lib/http";

const router = Router();

/* Limits: a chat turn is at most 2k characters and a session keeps the last
   MAX_HISTORY turns, so neither the JSON column nor the upstream prompt can
   grow without bound. */
const MAX_MESSAGE_CHARS = 2000;
const MAX_HISTORY = 24;
const MODEL_CONTEXT_TURNS = 12;

type ChatRole = "system" | "user" | "assistant";
type StoredChatMessage = { role: ChatRole; content: string; timestamp?: string };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function getOpenAIKey(): string | null {
  const key = process.env.OPENAI_API_KEY?.trim();
  return key ? key : null;
}

const UNAVAILABLE = { error: "The AI assistant is not available right now. Please WhatsApp or call us instead." };

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
      signal: AbortSignal.timeout(20_000),
    });

    if (!res.ok) {
      logError("ai.openai", new Error(`OpenAI responded ${res.status}`));
      return null;
    }
    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    return content || null;
  } catch (err) {
    logError("ai.openai", err);
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

function toStoredMessages(value: unknown): StoredChatMessage[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((m): m is StoredChatMessage => {
      if (typeof m !== "object" || m === null) return false;
      const { role, content } = m as { role?: unknown; content?: unknown };
      return (role === "user" || role === "assistant" || role === "system") && typeof content === "string";
    })
    .map((m) => ({ role: m.role, content: m.content, timestamp: m.timestamp }));
}

/* Lead scoring only — the reply itself always comes from the model. */
function scoreMessage(message: string): number {
  const lower = message.toLowerCase();
  if (lower.includes("book")) return 30;
  if (lower.includes("wedding") || lower.includes("corporate")) return 20;
  if (lower.includes("budget") || lower.includes("price") || lower.includes("cost")) return 15;
  if (lower.includes("venue")) return 10;
  return 0;
}

const SYSTEM_PROMPT =
  "You are the planning assistant for Nexyyra Events, a luxury event design and production company in India " +
  "(weddings, destination weddings, corporate events, launches, concerts, exhibitions). Be warm, confident and concise. " +
  "Ask one or two clarifying questions when needed (event type, city, date, guest count, budget). " +
  "Offer a free, no-obligation consultation; a planner replies the same day between 9am and 9pm IST. " +
  "Never invent statistics, client names, awards, venues or prices. Do not claim to have performed actions you cannot do.";

const chatSchema = z.object({
  message: z.string().trim().min(1).max(MAX_MESSAGE_CHARS),
  sessionId: z.string().trim().max(64).optional(),
});

router.post("/chat", async (req, res) => {
  const key = getOpenAIKey();
  if (!key) return res.status(503).json(UNAVAILABLE);

  const data = parseBody(chatSchema, req, res);
  if (!data) return;
  try {
    // Only accept ids we minted; anything else starts a fresh session.
    const sid = data.sessionId && UUID_RE.test(data.sessionId) ? data.sessionId : randomUUID();
    const existing = await prisma.chatSession.findUnique({ where: { sessionId: sid } });

    const userTurn: StoredChatMessage = { role: "user", content: data.message, timestamp: new Date().toISOString() };
    const history = [...toStoredMessages(existing?.messages), userTurn].slice(-MAX_HISTORY);

    const reply = await tryOpenAIChatReply({
      key,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...history.slice(-MODEL_CONTEXT_TURNS).map((m) => ({ role: m.role, content: m.content })),
      ],
    });
    if (!reply) return res.status(502).json({ error: "The assistant could not answer just now. Please try again." });

    const assistantTurn: StoredChatMessage = { role: "assistant", content: reply, timestamp: new Date().toISOString() };
    const messages = [...history, assistantTurn].slice(-MAX_HISTORY);
    const leadScore = (existing?.leadScore ?? 0) + scoreMessage(data.message);

    const session = await prisma.chatSession.upsert({
      where: { sessionId: sid },
      create: { sessionId: sid, messages, leadScore },
      update: { messages, leadScore },
      select: { sessionId: true, leadScore: true },
    });

    res.json({ reply, response: reply, sessionId: session.sessionId, leadScore: session.leadScore });
  } catch (err) {
    sendServerError(res, "ai.chat", err, "Chat failed");
  }
});

const planSchema = z.object({
  eventType: shortText(60).optional(),
  guestCount: z.number().int().min(1).max(100000).optional(),
  budget: z.number().min(0).max(1_000_000_000).optional(),
  city: shortText(60).optional(),
  preferences: longText(MAX_MESSAGE_CHARS).optional(),
});

const planAiSchema = z.object({
  summary: z.string().min(1),
  nextQuestions: z.array(z.string()).min(1).max(8),
  moodboardKeywords: z.array(z.string()).min(1).max(12),
  riskChecklist: z.array(z.string()).min(1).max(12),
});

router.post("/plan", async (req, res) => {
  const key = getOpenAIKey();
  if (!key) return res.status(503).json(UNAVAILABLE);

  const data = parseBody(planSchema, req, res);
  if (!data) return;
  try {
    const guestCount = data.guestCount ?? 100;
    const budget = data.budget ?? 500000;

    const venueSuggestions = await prisma.venue.findMany({
      where: {
        isActive: true,
        ...(data.city && { city: { contains: data.city, mode: "insensitive" } }),
        capacity: { gte: guestCount },
        pricePerDay: { lte: budget * 0.4 },
      },
      take: 3,
      orderBy: { rating: "desc" },
    });

    const vendorCategories = ["photographers", "decorators", "caterers", "djs"];
    const vendorSuggestions = await Promise.all(
      vendorCategories.map((cat) =>
        prisma.vendor.findFirst({
          where: { category: cat, isActive: true, ...(data.city && { city: { contains: data.city, mode: "insensitive" } }) },
          select: { id: true, businessName: true, slug: true, category: true, city: true, priceRange: true, rating: true },
          orderBy: { rating: "desc" },
        })
      )
    );
    const vendors = vendorSuggestions.filter((v): v is NonNullable<typeof v> => v != null);

    const timeline = [
      { phase: "6 months before", tasks: ["Set budget", "Choose venue", "Book vendors"] },
      { phase: "3 months before", tasks: ["Finalize guest list", "Menu tasting", "Send invitations"] },
      { phase: "1 month before", tasks: ["Final headcount", "Rehearsal", "Confirm logistics"] },
      { phase: "Event week", tasks: ["Setup coordination", "Vendor briefing", "Final walkthrough"] },
    ];

    const recommendations = {
      venues: venueSuggestions,
      vendors,
      budgetBreakdown: {
        venue: budget * 0.35,
        catering: budget * 0.25,
        decoration: budget * 0.15,
        entertainment: budget * 0.1,
        photography: budget * 0.1,
        miscellaneous: budget * 0.05,
      },
      timeline,
      tips: [
        `For ${data.eventType || "your event"} with ${guestCount} guests, start planning 6–8 months ahead`,
        "Off-season dates usually stretch the budget further",
        "A free consultation gets you an itemised proposal within 48 hours",
      ],
    };

    const prompt = [
      "Return ONLY a valid JSON object matching this exact schema:",
      `{ "summary": string, "nextQuestions": string[], "moodboardKeywords": string[], "riskChecklist": string[] }`,
      "",
      "Context: luxury event planning in India for Nexyyra Events.",
      `Event: ${data.eventType || "Not specified"}`,
      `City: ${data.city || "Not specified"}`,
      `Guests: ${guestCount}`,
      `Budget: ₹${budget}`,
      data.preferences ? `Preferences: ${data.preferences}` : "",
      venueSuggestions.length ? `Suggested venues: ${venueSuggestions.map((v) => `${v.name} (${v.city})`).join("; ")}` : "",
      vendors.length ? `Suggested vendors: ${vendors.map((v) => v.businessName).join("; ")}` : "",
      "",
      "Rules: be concise; no markdown; no extra keys; arrays must be short and practical; never invent statistics or venues.",
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

    const parsed = planAiSchema.safeParse(raw ? extractJsonObject(raw) : null);
    const ai = parsed.success ? parsed.data : null;

    res.json({
      recommendations,
      ai,
      input: { eventType: data.eventType, guestCount, budget, city: data.city, preferences: data.preferences },
    });
  } catch (err) {
    sendServerError(res, "ai.plan", err, "AI planning failed");
  }
});

export default router;
