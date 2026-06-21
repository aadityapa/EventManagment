"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bot,
  Calculator,
  Calendar,
  MapPin,
  Sparkles,
  Users,
  Wallet,
  MessageSquare,
} from "lucide-react";
import { BrandButton } from "@/brand/primitives/brand-button";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import { HomeAiPlanner } from "@/brand/sections/home/ai-planner";
import { ScrollReveal } from "@/lib/motion";
import { cn, getApiUrl } from "@/lib/utils";

const TOOLS = [
  { id: "architect", icon: Sparkles, label: "Event Architect", desc: "Conversational planning assistant" },
  { id: "budget", icon: Calculator, label: "Budget Planner", desc: "Estimate investment tiers" },
  { id: "venue", icon: MapPin, label: "Venue Recommender", desc: "Match destinations to your brief" },
  { id: "vendor", icon: Users, label: "Vendor Matching", desc: "Curated vendor shortlists" },
  { id: "timeline", icon: Calendar, label: "Timeline Generator", desc: "Phase-by-phase production plan" },
  { id: "consult", icon: MessageSquare, label: "Consultation Assistant", desc: "Ask anything before you book" },
] as const;

type ToolId = (typeof TOOLS)[number]["id"];

export function AiExperienceView() {
  const [active, setActive] = useState<ToolId>("architect");
  const [chatInput, setChatInput] = useState("");
  const [chatLog, setChatLog] = useState<Array<{ role: "user" | "assistant"; text: string }>>([]);
  const [chatLoading, setChatLoading] = useState(false);

  const sendChat = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatInput("");
    setChatLog((l) => [...l, { role: "user", text: msg }]);
    setChatLoading(true);
    try {
      const res = await fetch(getApiUrl("/ai/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, sessionId: "v5-hub" }),
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string };
      setChatLog((l) => [...l, { role: "assistant", text: data.reply ?? "Tell me more about your event vision." }]);
    } catch {
      setChatLog((l) => [...l, { role: "assistant", text: "Our team is ready — book a consultation at /book-event." }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="brand-root">
      <section className="v4-section v4-dune-glow bg-[var(--glitz-bg)]">
        <div className="brand-container">
          <ScrollReveal preset="reveal">
            <span className="v4-kicker mb-4">AI Experience Hub</span>
            <h1 className="v4-display max-w-3xl">
              Meet the <span className="v4-gold-text">Oracle</span>
            </h1>
            <p className="v4-standfirst mt-5 max-w-2xl">
              Six intelligent tools — event architect, budget planner, venue recommender, and more — wired to our
              secure planning APIs.
            </p>
          </ScrollReveal>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActive(t.id)}
                className={cn(
                  "v4-glass flex items-start gap-3 rounded-xl p-4 text-left transition-all",
                  active === t.id && "ring-2 ring-[var(--glitz-gold)]/50 shadow-[var(--v4-glow-gold-sm)]"
                )}
              >
                <t.icon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--glitz-gold)]" aria-hidden />
                <span>
                  <span className="block font-semibold text-[var(--text-primary)]">{t.label}</span>
                  <span className="mt-1 block text-xs text-[var(--text-muted)]">{t.desc}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="v4-section bg-[var(--glitz-surface)]">
        <div className="brand-container">
          {active === "architect" && (
            <GlassPanel glow className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <Bot className="h-5 w-5 text-[var(--glitz-gold)]" aria-hidden />
                <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold">AI Event Architect</h2>
              </div>
              <div className="max-h-64 space-y-3 overflow-y-auto rounded-lg border border-[var(--glitz-border)] p-4" aria-live="polite">
                {chatLog.length === 0 && (
                  <p className="text-sm text-[var(--text-muted)]">Describe your dream event — type, city, guest count, budget.</p>
                )}
                {chatLog.map((m, i) => (
                  <p key={i} className={cn("text-sm", m.role === "user" ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]")}>
                    <strong>{m.role === "user" ? "You" : "Oracle"}:</strong> {m.text}
                  </p>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendChat()}
                  placeholder="Plan a 300-guest wedding in Udaipur…"
                  className="flex-1 rounded-lg border border-[var(--glitz-border)] bg-transparent px-4 py-2.5 text-sm"
                  aria-label="Chat message"
                />
                <button
                  type="button"
                  onClick={sendChat}
                  disabled={chatLoading}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-lg btn-gold-metallic px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
                >
                  Send
                </button>
              </div>
            </GlassPanel>
          )}

          {(active === "budget" || active === "timeline") && (
            <div id="ai-planner">
              <HomeAiPlanner />
            </div>
          )}

          {active === "venue" && (
            <GlassPanel className="p-6">
              <MapPin className="mb-3 h-6 w-6 text-[var(--glitz-gold)]" aria-hidden />
              <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold">Venue Recommender</h2>
              <p className="mt-3 text-sm text-[var(--text-secondary)]">
                Use the Event Architect planner below or browse our{" "}
                <Link href="/venues" className="text-[var(--glitz-gold)] hover:underline">Venue Universe</Link>.
              </p>
              <div className="mt-6">
                <HomeAiPlanner />
              </div>
            </GlassPanel>
          )}

          {active === "vendor" && (
            <GlassPanel className="p-6">
              <Users className="mb-3 h-6 w-6 text-[var(--glitz-gold)]" aria-hidden />
              <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold">Vendor Matching</h2>
              <p className="mt-3 text-sm text-[var(--text-secondary)]">
                Curated vendor shortlists are included in every AI plan. Explore our{" "}
                <Link href="/vendors" className="text-[var(--glitz-gold)] hover:underline">vendor network</Link>.
              </p>
            </GlassPanel>
          )}

          {active === "consult" && (
            <GlassPanel className="p-6">
              <Wallet className="mb-3 h-6 w-6 text-[var(--glitz-gold)]" aria-hidden />
              <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold">Consultation Assistant</h2>
              <p className="mt-3 text-sm text-[var(--text-secondary)]">
                Ready for a human architect? Book a private consultation — response within 24 hours.
              </p>
              <BrandButton href="/book-event" variant="gold" className="mt-6">
                Book Consultation
              </BrandButton>
            </GlassPanel>
          )}
        </div>
      </section>
    </div>
  );
}
