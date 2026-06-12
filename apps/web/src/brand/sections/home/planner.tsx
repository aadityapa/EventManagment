"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, MessageCircle } from "lucide-react";
import { BrandSection, BrandHeader } from "@/brand/primitives/brand-section";
import { Input } from "@/components/ui/input";
import { SITE_CONFIG } from "@/lib/constants";
import { cn, getApiUrl } from "@/lib/utils";
import { toast } from "sonner";

const STEPS = ["Event", "Budget", "Guests", "Date", "Location", "Contact"];
const EVENTS = ["Wedding", "Corporate", "Birthday", "Product Launch", "Concert"];
const BUDGETS = ["₹1L – 5L", "₹5L – 20L", "₹20L – 50L", "₹50L+"];
const LOCS = ["Pune", "Mumbai", "Goa", "Jaipur", "Udaipur", "Other"];

type Form = { eventType: string; budget: string; guests: string; date: string; location: string; name: string; email: string; phone: string };

function parseBudgetAmount(range: string): number | undefined {
  if (!range) return undefined;
  if (range.includes("1L") && range.includes("5L")) return 500000;
  if (range.includes("5L") && range.includes("20L")) return 2000000;
  if (range.includes("20L") && range.includes("50L")) return 5000000;
  if (range.includes("50L")) return 8000000;
  return undefined;
}

export function HomePlanner() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Form>({ eventType: "", budget: "", guests: "", date: "", location: "", name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const set = (k: keyof Form, v: string) => setData((d) => ({ ...d, [k]: v }));

  const ok = () => {
    if (step === 0) return !!data.eventType;
    if (step === 1) return !!data.budget;
    if (step === 2) return !!data.guests;
    if (step === 3) return !!data.date;
    if (step === 4) return !!data.location;
    if (step === 5) return !!data.name && !!data.email && !!data.phone;
    return true;
  };

  const submit = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl("/leads/consultation"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          eventType: data.eventType,
          budget: parseBudgetAmount(data.budget),
          message: `Guests: ${data.guests}; Date: ${data.date}; Location: ${data.location}; Budget range: ${data.budget}`,
          source: "home-planner",
          guests: data.guests,
          date: data.date,
          location: data.location,
          budgetRange: data.budget,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Consultation request received!");
      const msg = encodeURIComponent(`Hi Glitz! ${data.eventType} in ${data.location}. Budget: ${data.budget}. Guests: ${data.guests}. Date: ${data.date}. ${data.name}`);
      window.open(`https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}?text=${msg}`, "_blank");
      setStep(6);
    } catch { toast.error("Please call us directly."); }
    finally { setLoading(false); }
  };

  return (
    <BrandSection id="planner">
      <BrandHeader label="Start Your Journey" title="Luxury Event Planner" subtitle="Six steps to your bespoke celebration." center />
      <div className="mx-auto max-w-xl">
        <div className="mb-8 flex justify-between">{STEPS.map((s, i) => (
          <div key={s} className="flex flex-col items-center gap-1">
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold", i <= step ? "bg-[var(--glitz-gold)] text-[#0A0A0A]" : "border border-[var(--glitz-border)] text-muted")}>{i < step ? <Check className="h-4 w-4" /> : i + 1}</div>
            <span className="hidden text-[10px] uppercase text-muted sm:block">{s}</span>
          </div>
        ))}</div>
        <div className="brand-surface p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
              {step === 0 && <GridPick label="Event type?" options={EVENTS} value={data.eventType} onPick={(v) => set("eventType", v)} />}
              {step === 1 && <GridPick label="Budget range?" options={BUDGETS} value={data.budget} onPick={(v) => set("budget", v)} />}
              {step === 2 && <><h3 className="brand-display text-xl font-semibold">Guest count?</h3><Input type="number" min={1} value={data.guests} onChange={(e) => set("guests", e.target.value)} className="mt-4 h-12 border-[var(--glitz-border)] bg-[var(--glitz-bg)]" placeholder="e.g. 250" /></>}
              {step === 3 && <><h3 className="brand-display text-xl font-semibold">Event date?</h3><Input type="date" value={data.date} onChange={(e) => set("date", e.target.value)} className="mt-4 h-12 border-[var(--glitz-border)] bg-[var(--glitz-bg)]" /></>}
              {step === 4 && <GridPick label="Location?" options={LOCS} value={data.location} onPick={(v) => set("location", v)} />}
              {step === 5 && <div className="space-y-3"><h3 className="brand-display text-xl font-semibold">Contact details</h3><Input placeholder="Name" value={data.name} onChange={(e) => set("name", e.target.value)} className="h-12 border-[var(--glitz-border)] bg-[var(--glitz-bg)]" /><Input type="email" placeholder="Email" value={data.email} onChange={(e) => set("email", e.target.value)} className="h-12 border-[var(--glitz-border)] bg-[var(--glitz-bg)]" /><Input type="tel" placeholder="Phone" value={data.phone} onChange={(e) => set("phone", e.target.value)} className="h-12 border-[var(--glitz-border)] bg-[var(--glitz-bg)]" /></div>}
              {step === 6 && <div className="py-6 text-center"><Check className="mx-auto h-12 w-12 text-[var(--glitz-gold)]" /><h3 className="mt-4 brand-display text-2xl font-semibold">Thank You</h3><p className="mt-2 text-muted">We&apos;ll contact you within 24 hours.</p><a href={`https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 text-sm font-semibold text-white"><MessageCircle className="h-4 w-4" /> WhatsApp</a></div>}
            </motion.div>
          </AnimatePresence>
          {step < 6 && (
            <div className="mt-8 flex justify-between">
              <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="flex items-center gap-1 text-sm text-muted disabled:opacity-40"><ArrowLeft className="h-4 w-4" /> Back</button>
              {step < 5 ? <button type="button" onClick={() => setStep((s) => s + 1)} disabled={!ok()} className="flex items-center gap-1 rounded-lg bg-[var(--glitz-gold)] px-5 py-2.5 text-sm font-semibold text-[#0A0A0A] disabled:opacity-40">Next <ArrowRight className="h-4 w-4" /></button>
                : <button type="button" onClick={submit} disabled={!ok() || loading} className="rounded-lg bg-[var(--glitz-gold)] px-5 py-2.5 text-sm font-semibold text-[#0A0A0A] disabled:opacity-40">{loading ? "Sending..." : "Submit & WhatsApp"}</button>}
            </div>
          )}
        </div>
      </div>
    </BrandSection>
  );
}

function GridPick({ label, options, value, onPick }: { label: string; options: string[]; value: string; onPick: (v: string) => void }) {
  return (
    <div>
      <h3 className="brand-display text-xl font-semibold">{label}</h3>
      <div className="mt-4 grid grid-cols-2 gap-3">{options.map((o) => (
        <button key={o} type="button" onClick={() => onPick(o)} className={cn("rounded-lg border p-3 text-sm font-medium transition-all", value === o ? "border-[var(--glitz-gold)] bg-[var(--glitz-gold)]/10 text-[var(--glitz-gold)]" : "border-[var(--glitz-border)] hover:border-[var(--glitz-gold)]/40")}>{o}</button>
      ))}</div>
    </div>
  );
}
