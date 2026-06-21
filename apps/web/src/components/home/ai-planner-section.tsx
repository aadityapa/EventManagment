"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Calendar, Users, Wallet } from "lucide-react";
import { LuxurySection } from "@/components/shared/luxury-section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EVENT_TYPES = ["Wedding", "Corporate", "Birthday", "Product Launch", "Concert"];
const BUDGETS = ["₹1L – 5L", "₹5L – 20L", "₹20L – 50L", "₹50L+"];
const GUEST_RANGES = ["Under 100", "100 – 300", "300 – 500", "500+"];
const LOCATIONS = ["Pune", "Mumbai", "Goa", "Jaipur", "Udaipur", "Bangalore"];

interface PlanResult {
  timeline: string[];
  estimate: string;
  vendors: string[];
  highlights: string[];
  venue?: string;
}

function generatePlan(eventType: string, budget: string, guests: string): PlanResult {
  const isLuxury = budget.includes("50L") || budget.includes("20L");
  return {
    timeline: [
      `Month 1–2: Discovery & concept design for your ${eventType.toLowerCase()}`,
      `Month 3–4: Venue selection, vendor curation & budget allocation`,
      `Month 5–6: Design finalization, rehearsals & guest logistics`,
      `Event Week: On-ground execution with dedicated Nexyyra coordinators`,
    ],
    estimate: budget,
    vendors: isLuxury
      ? ["Premium Decor Studio", "Gourmet Affairs Catering", "Lens & Light Photography", "Harmony Live Band", "Glam Studio Makeup"]
      : ["Bloom & Blossom Decor", "Gourmet Affairs Catering", "Lens & Light Studio", "Beat Masters DJ"],
    highlights: [
      `Tailored ${eventType.toLowerCase()} experience for ${guests} guests`,
      isLuxury ? "Dedicated event director & 24/7 concierge" : "Dedicated coordinator & vendor management",
      "Custom design concept with mood boards",
      "Day-of flawless execution guarantee",
    ],
  };
}

export function AiPlannerSection() {
  const [eventType, setEventType] = useState("");
  const [budget, setBudget] = useState("");
  const [guests, setGuests] = useState("");
  const [location, setLocation] = useState("");
  const [plan, setPlan] = useState<PlanResult | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = () => {
    if (!eventType || !budget || !guests || !location) return;
    setLoading(true);
    setTimeout(() => {
      setPlan({ ...generatePlan(eventType, budget, guests), venue: `Recommended venues in ${location}` });
      setLoading(false);
    }, 1200);
  };

  return (
    <LuxurySection
      id="ai-planner"
      label="AI Powered"
      title="Intelligent Event Planner"
      subtitle="Get an instant bespoke event blueprint — timeline, budget, and vendor recommendations."
    >
      <div className="container-page grid gap-8 lg:grid-cols-2">
        <div className="luxury-card space-y-6 p-6 sm:p-8">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted">
              <Sparkles className="h-4 w-4 text-primary" /> Event Type
            </label>
            <div className="flex flex-wrap gap-2">
              {EVENT_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setEventType(t)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition-all",
                    eventType === t ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted">
              <Wallet className="h-4 w-4 text-primary" /> Budget Range
            </label>
            <div className="flex flex-wrap gap-2">
              {BUDGETS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBudget(b)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition-all",
                    budget === b ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40"
                  )}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted">
              <Users className="h-4 w-4 text-primary" /> Guest Count
            </label>
            <div className="flex flex-wrap gap-2">
              {GUEST_RANGES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGuests(g)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition-all",
                    guests === g ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40"
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted">
              <Sparkles className="h-4 w-4 text-primary" /> Location
            </label>
            <div className="flex flex-wrap gap-2">
              {LOCATIONS.map((loc) => (
                <button key={loc} type="button" onClick={() => setLocation(loc)} className={cn("rounded-full border px-4 py-2 text-sm transition-all", location === loc ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40")}>{loc}</button>
              ))}
            </div>
          </div>

          <Button
            className="w-full shadow-glow"
            size="lg"
            onClick={generate}
            disabled={!eventType || !budget || !guests || !location || loading}
          >
            {loading ? "Crafting Your Plan..." : "Generate Event Plan"}
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: plan ? 1 : 0.5 }}
          className="luxury-card p-6 sm:p-8"
        >
          {plan ? (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-xl font-semibold gradient-text">Your Bespoke Plan</h3>
                <p className="mt-1 text-sm text-muted">{eventType} · {location} · {guests} guests · {plan.estimate}</p>
                {plan.venue && <p className="mt-1 text-sm text-primary">{plan.venue}</p>}
              </div>

              <div>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary">
                  <Calendar className="h-4 w-4" /> Timeline
                </h4>
                <ol className="space-y-2">
                  {plan.timeline.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted">
                      <span className="font-bold text-primary">{i + 1}.</span> {item}
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">Recommended Vendors</h4>
                <div className="flex flex-wrap gap-2">
                  {plan.vendors.map((v) => (
                    <span key={v} className="rounded-full border border-border px-3 py-1 text-xs text-foreground/80">
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">Highlights</h4>
                <ul className="space-y-2">
                  {plan.highlights.map((h) => (
                    <li key={h} className="text-sm text-muted">✦ {h}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
              <Sparkles className="mb-4 h-12 w-12 text-primary/40" />
              <p className="text-muted">Select your preferences and generate a personalized event plan.</p>
            </div>
          )}
        </motion.div>
      </div>
    </LuxurySection>
  );
}
