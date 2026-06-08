"use client";

import { useState } from "react";
import { Sparkles, Calendar, Wallet, Users, MapPin, Download } from "lucide-react";
import { BrandSection, BrandHeader } from "@/brand/primitives/brand-section";
import { cn } from "@/lib/utils";

const EVENTS = ["Wedding", "Corporate", "Birthday", "Product Launch", "Concert"];
const BUDGETS = ["₹1L – 5L", "₹5L – 20L", "₹20L – 50L", "₹50L+"];
const GUESTS = ["Under 100", "100 – 300", "300 – 500", "500+"];
const LOCS = ["Pune", "Mumbai", "Goa", "Jaipur", "Udaipur"];

function buildPlan(type: string, budget: string, guests: string, loc: string) {
  return {
    timeline: [`Month 1–2: Discovery for your ${type.toLowerCase()} in ${loc}`, "Month 3–4: Venue & vendor curation", "Month 5–6: Design finalization & rehearsals", "Event Week: Flawless on-ground execution"],
    vendors: budget.includes("50L") ? ["Premium Decor Studio", "Gourmet Affairs", "Lens & Light", "Harmony Band"] : ["Bloom & Blossom", "Gourmet Affairs", "Beat Masters DJ"],
    venues: [`Exclusive ${loc} venues matched to ${guests} guests`],
    estimate: budget,
  };
}

export function HomeAiPlanner() {
  const [type, setType] = useState("");
  const [budget, setBudget] = useState("");
  const [guests, setGuests] = useState("");
  const [loc, setLoc] = useState("");
  const [plan, setPlan] = useState<ReturnType<typeof buildPlan> | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = () => {
    if (!type || !budget || !guests || !loc) return;
    setLoading(true);
    setTimeout(() => { setPlan(buildPlan(type, budget, guests, loc)); setLoading(false); }, 1000);
  };

  const Chip = ({ options, val, set }: { options: string[]; val: string; set: (v: string) => void }) => (
    <div className="flex flex-wrap gap-2">{options.map((o) => (
      <button key={o} type="button" onClick={() => set(o)} className={cn("rounded-full border px-4 py-2 text-sm", val === o ? "border-[var(--glitz-gold)] bg-[var(--glitz-gold)]/10 text-[var(--glitz-gold)]" : "border-[var(--glitz-border)]")}>{o}</button>
    ))}</div>
  );

  return (
    <BrandSection>
      <BrandHeader label="AI Powered" title="Intelligent Event Planner" subtitle="Instant bespoke blueprint — timeline, budget, venues, and vendors." center />
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="brand-surface space-y-5 p-6 sm:p-8">
          <div><label className="mb-2 flex items-center gap-2 text-sm text-[var(--glitz-muted)]"><Sparkles className="h-4 w-4 text-[var(--glitz-gold)]" /> Event Type</label><Chip options={EVENTS} val={type} set={setType} /></div>
          <div><label className="mb-2 flex items-center gap-2 text-sm text-[var(--glitz-muted)]"><Wallet className="h-4 w-4 text-[var(--glitz-gold)]" /> Budget</label><Chip options={BUDGETS} val={budget} set={setBudget} /></div>
          <div><label className="mb-2 flex items-center gap-2 text-sm text-[var(--glitz-muted)]"><Users className="h-4 w-4 text-[var(--glitz-gold)]" /> Guests</label><Chip options={GUESTS} val={guests} set={setGuests} /></div>
          <div><label className="mb-2 flex items-center gap-2 text-sm text-[var(--glitz-muted)]"><MapPin className="h-4 w-4 text-[var(--glitz-gold)]" /> Location</label><Chip options={LOCS} val={loc} set={setLoc} /></div>
          <button type="button" onClick={generate} disabled={!type || !budget || !guests || !loc || loading} className="w-full rounded-lg bg-[var(--glitz-gold)] py-3.5 text-sm font-semibold text-[#0A0A0A] shadow-[var(--glitz-glow)] disabled:opacity-40">{loading ? "Crafting..." : "Generate Luxury Proposal"}</button>
        </div>
        <div className="brand-surface p-6 sm:p-8">
          {plan ? (
            <div className="space-y-5">
              <h3 className="brand-display text-xl font-semibold brand-gold-text">Your Bespoke Plan</h3>
              <p className="text-sm text-[var(--glitz-muted)]">{type} · {loc} · {guests} · {plan.estimate}</p>
              <div><h4 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--glitz-gold)]"><Calendar className="h-4 w-4" /> Timeline</h4><ol className="space-y-1">{plan.timeline.map((t, i) => <li key={i} className="text-sm text-[var(--glitz-muted)]">{i + 1}. {t}</li>)}</ol></div>
              <div><h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--glitz-gold)]">Venues</h4>{plan.venues.map((v) => <p key={v} className="text-sm text-[var(--glitz-muted)]">{v}</p>)}</div>
              <div><h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--glitz-gold)]">Vendors</h4><div className="flex flex-wrap gap-2">{plan.vendors.map((v) => <span key={v} className="rounded-full border border-[var(--glitz-border)] px-3 py-1 text-xs">{v}</span>)}</div></div>
              <button type="button" className="flex items-center gap-2 text-sm font-semibold text-[var(--glitz-gold)]"><Download className="h-4 w-4" /> Download PDF Proposal (Contact us)</button>
            </div>
          ) : (
            <div className="flex min-h-[280px] flex-col items-center justify-center text-center text-[var(--glitz-muted)]"><Sparkles className="mb-4 h-12 w-12 text-[var(--glitz-gold)]/30" /><p>Select preferences to generate your plan.</p></div>
          )}
        </div>
      </div>
    </BrandSection>
  );
}
