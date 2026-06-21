"use client";

import { useState } from "react";
import { Sparkles, Calendar, Wallet, Users, MapPin, Download } from "lucide-react";
import { BrandSection, BrandHeader } from "@/brand/primitives/brand-section";
import { cn, formatCurrency, getApiUrl } from "@/lib/utils";

const EVENTS = ["Wedding", "Corporate", "Birthday", "Product Launch", "Concert"];
const BUDGETS = ["₹1L – 5L", "₹5L – 20L", "₹20L – 50L", "₹50L+"];
const GUESTS = ["Under 100", "100 – 300", "300 – 500", "500+"];
const LOCS = ["Pune", "Mumbai", "Goa", "Jaipur", "Udaipur"];

function OptionChips({ options, val, onSelect }: { options: string[]; val: string; onSelect: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onSelect(o)}
          className={cn(
            "rounded-full border px-4 py-2 text-sm",
            val === o ? "border-[var(--glitz-gold)] bg-[var(--glitz-gold)]/10 text-[var(--glitz-gold)]" : "border-[var(--glitz-border)] text-muted"
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function buildPlan(type: string, budget: string, guests: string, loc: string) {
  return {
    timeline: [`Month 1–2: Discovery for your ${type.toLowerCase()} in ${loc}`, "Month 3–4: Venue & vendor curation", "Month 5–6: Design finalization & rehearsals", "Event Week: Flawless on-ground execution"],
    vendors: budget.includes("50L") ? ["Premium Decor Studio", "Gourmet Affairs", "Lens & Light", "Harmony Band"] : ["Bloom & Blossom", "Gourmet Affairs", "Beat Masters DJ"],
    venues: [`Exclusive ${loc} venues matched to ${guests} guests`],
    estimate: budget,
    tips: ["Book early for premium availability", "Share your theme preferences for a better plan", "Talk to us on WhatsApp for a bespoke quote"],
  };
}

function parseGuestCount(range: string): number {
  if (range.toLowerCase().includes("under")) return 100;
  if (range.includes("100") && range.includes("300")) return 300;
  if (range.includes("300") && range.includes("500")) return 500;
  if (range.includes("500")) return 800;
  return 150;
}

function parseBudgetAmount(range: string): number {
  if (range.includes("1L") && range.includes("5L")) return 500000;
  if (range.includes("5L") && range.includes("20L")) return 2000000;
  if (range.includes("20L") && range.includes("50L")) return 5000000;
  if (range.includes("50L")) return 8000000;
  return 800000;
}

type PlanApiTimeline = { phase: string; tasks: string[] };
type PlanApiVenue = { name: string; city?: string; pricePerDay?: number };
type PlanApiVendor = { businessName?: string; name?: string };
type PlanApiRecommendations = {
  timeline?: PlanApiTimeline[];
  venues?: PlanApiVenue[];
  vendors?: PlanApiVendor[];
  tips?: string[];
};
type PlanApiResponse = { recommendations?: PlanApiRecommendations };

export function HomeAiPlanner() {
  const [type, setType] = useState("");
  const [budget, setBudget] = useState("");
  const [guests, setGuests] = useState("");
  const [loc, setLoc] = useState("");
  const [plan, setPlan] = useState<ReturnType<typeof buildPlan> | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!type || !budget || !guests || !loc) return;
    setLoading(true);
    try {
      const res = await fetch(getApiUrl("/ai/plan"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: type,
          guestCount: parseGuestCount(guests),
          budget: parseBudgetAmount(budget),
          city: loc,
          preferences: "",
        }),
      });

      const data = (await res.json().catch(() => ({}))) as PlanApiResponse;
      const rec = data.recommendations;
      if (!res.ok || !rec) throw new Error("plan_failed");

      const timeline = rec.timeline?.map((t) => `${t.phase}: ${t.tasks.join(", ")}`.trim()) ?? [];

      const venues =
        rec.venues?.map((v) => {
          const cityText = v.city ? ` · ${v.city}` : "";
          const priceText = typeof v.pricePerDay === "number" ? ` — ${formatCurrency(v.pricePerDay)}/day` : "";
          return `${v.name}${cityText}${priceText}`;
        }) ?? [];

      const vendors = rec.vendors?.map((v) => v.businessName || v.name || "Vendor") ?? [];

      setPlan({
        timeline: timeline.length ? timeline : buildPlan(type, budget, guests, loc).timeline,
        venues: venues.length ? venues : buildPlan(type, budget, guests, loc).venues,
        vendors: vendors.length ? vendors : buildPlan(type, budget, guests, loc).vendors,
        estimate: budget,
        tips: rec.tips?.length ? rec.tips : buildPlan(type, budget, guests, loc).tips,
      });
    } catch {
      setPlan(buildPlan(type, budget, guests, loc));
    } finally {
      setLoading(false);
    }
  };

  return (
    <BrandSection id="ai-planner">
      <BrandHeader label="AI Powered" title="Intelligent Event Planner" subtitle="Instant bespoke blueprint — timeline, budget, venues, and vendors." center />
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="brand-surface space-y-5 p-6 sm:p-8">
          <div><label className="mb-2 flex items-center gap-2 text-sm text-muted"><Sparkles className="h-4 w-4 text-[var(--glitz-gold)]" /> Event Type</label><OptionChips options={EVENTS} val={type} onSelect={setType} /></div>
          <div><label className="mb-2 flex items-center gap-2 text-sm text-muted"><Wallet className="h-4 w-4 text-[var(--glitz-gold)]" /> Budget</label><OptionChips options={BUDGETS} val={budget} onSelect={setBudget} /></div>
          <div><label className="mb-2 flex items-center gap-2 text-sm text-muted"><Users className="h-4 w-4 text-[var(--glitz-gold)]" /> Guests</label><OptionChips options={GUESTS} val={guests} onSelect={setGuests} /></div>
          <div><label className="mb-2 flex items-center gap-2 text-sm text-muted"><MapPin className="h-4 w-4 text-[var(--glitz-gold)]" /> Location</label><OptionChips options={LOCS} val={loc} onSelect={setLoc} /></div>
          <button type="button" onClick={generate} disabled={!type || !budget || !guests || !loc || loading} className="w-full rounded-lg bg-[var(--glitz-gold)] py-3.5 text-sm font-semibold text-[#0A0A0A] shadow-[var(--glitz-glow)] disabled:opacity-40">{loading ? "Crafting..." : "Generate Luxury Proposal"}</button>
        </div>
        <div className="brand-surface p-6 sm:p-8">
          {plan ? (
            <div className="space-y-5">
              <h3 className="brand-display text-xl font-semibold brand-gold-text">Your Bespoke Plan</h3>
              <p className="text-sm text-muted">{type} · {loc} · {guests} · {plan.estimate}</p>
              <div><h4 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--glitz-gold)]"><Calendar className="h-4 w-4" /> Timeline</h4><ol className="space-y-1">{plan.timeline.map((t, i) => <li key={i} className="text-sm text-muted">{i + 1}. {t}</li>)}</ol></div>
              <div><h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--glitz-gold)]">Venues</h4>{plan.venues.map((v) => <p key={v} className="text-sm text-muted">{v}</p>)}</div>
              <div><h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--glitz-gold)]">Vendors</h4><div className="flex flex-wrap gap-2">{plan.vendors.map((v) => <span key={v} className="rounded-full border border-[var(--glitz-border)] px-3 py-1 text-xs">{v}</span>)}</div></div>
              {!!plan.tips?.length && (
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--glitz-gold)]">Tips</h4>
                  <ul className="space-y-1">
                    {plan.tips.map((t) => (
                      <li key={t} className="text-sm text-muted">• {t}</li>
                    ))}
                  </ul>
                </div>
              )}
              <button type="button" className="flex items-center gap-2 text-sm font-semibold text-[var(--glitz-gold)]"><Download className="h-4 w-4" /> Download PDF Proposal (Contact us)</button>
            </div>
          ) : (
            <div className="flex min-h-[280px] flex-col items-center justify-center text-center text-muted"><Sparkles className="mb-4 h-12 w-12 text-[var(--glitz-gold)]/30" /><p>Select preferences to generate your plan.</p></div>
          )}
        </div>
      </div>
    </BrandSection>
  );
}
