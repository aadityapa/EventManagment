"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, MessageCircle } from "lucide-react";
import { LuxurySection } from "@/components/shared/luxury-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SITE_CONFIG } from "@/lib/constants";
import { cn, getApiUrl } from "@/lib/utils";
import { toast } from "sonner";

const STEPS = ["Event Type", "Budget", "Guests", "Date", "Location", "Contact", "Confirm"];

const LOCATIONS = ["Pune", "Mumbai", "Goa", "Jaipur", "Udaipur", "Bangalore", "Other"];

const EVENT_TYPES = ["Wedding", "Corporate", "Birthday", "Product Launch", "Concert"];
const BUDGETS = ["₹1L – 5L", "₹5L – 20L", "₹20L – 50L", "₹50L+"];

interface LeadData {
  eventType: string;
  budget: string;
  guests: string;
  date: string;
  location: string;
  name: string;
  email: string;
  phone: string;
}

const initial: LeadData = {
  eventType: "",
  budget: "",
  guests: "",
  date: "",
  location: "",
  name: "",
  email: "",
  phone: "",
};

function parseBudgetAmount(range: string): number | undefined {
  if (!range) return undefined;
  if (range.includes("1L") && range.includes("5L")) return 500000;
  if (range.includes("5L") && range.includes("20L")) return 2000000;
  if (range.includes("20L") && range.includes("50L")) return 5000000;
  if (range.includes("50L")) return 8000000;
  return undefined;
}

export function LuxuryPlannerSection() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<LeadData>(initial);
  const [submitting, setSubmitting] = useState(false);

  const update = (field: keyof LeadData, value: string) =>
    setData((d) => ({ ...d, [field]: value }));

  const canNext = () => {
    if (step === 0) return !!data.eventType;
    if (step === 1) return !!data.budget;
    if (step === 2) return !!data.guests && Number(data.guests) > 0;
    if (step === 3) return !!data.date;
    if (step === 4) return !!data.location;
    if (step === 5) return !!data.name && !!data.email && !!data.phone;
    return true;
  };

  const submit = async () => {
    setSubmitting(true);
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
          source: "luxury-planner",
          guests: data.guests,
          date: data.date,
          location: data.location,
          budgetRange: data.budget,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Your consultation request has been received!");
      const msg = encodeURIComponent(
        `Hi Nexyyra Events! I'd like to plan a ${data.eventType} event.\nBudget: ${data.budget}\nGuests: ${data.guests}\nDate: ${data.date}\nLocation: ${data.location}\nName: ${data.name}`
      );
      window.open(`https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}?text=${msg}`, "_blank");
      setStep(6);
    } catch {
      toast.error("Something went wrong. Please call us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LuxurySection
      id="planner"
      label="Start Your Journey"
      title="Luxury Event Planner"
      subtitle="Tell us about your dream event — we'll craft a bespoke experience tailored to you."
      className="bg-secondary/30"
    >
      <div className="container-page max-w-2xl">
        <div className="mb-8 flex justify-between gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
                  i <= step ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted"
                )}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className="hidden text-[10px] uppercase tracking-wider text-muted sm:block">{s}</span>
            </div>
          ))}
        </div>

        <div className="luxury-card p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 0 && (
                <div>
                  <h3 className="font-display text-xl font-semibold">What type of event?</h3>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {EVENT_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => update("eventType", type)}
                        className={cn(
                          "touch-target rounded-lg border p-4 text-sm font-medium transition-all",
                          data.eventType === type
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/40"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h3 className="font-display text-xl font-semibold">What&apos;s your budget?</h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {BUDGETS.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => update("budget", b)}
                        className={cn(
                          "touch-target rounded-lg border p-4 text-sm font-medium transition-all",
                          data.budget === b
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/40"
                        )}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 className="font-display text-xl font-semibold">Expected guest count?</h3>
                  <Input
                    type="number"
                    min={1}
                    placeholder="e.g. 250"
                    value={data.guests}
                    onChange={(e) => update("guests", e.target.value)}
                    className="mt-4 h-12 border-border bg-background text-lg"
                  />
                </div>
              )}

              {step === 3 && (
                <div>
                  <h3 className="font-display text-xl font-semibold">Preferred event date?</h3>
                  <Input
                    type="date"
                    value={data.date}
                    onChange={(e) => update("date", e.target.value)}
                    className="mt-4 h-12 border-border bg-background"
                  />
                </div>
              )}

              {step === 4 && (
                <div>
                  <h3 className="font-display text-xl font-semibold">Event location?</h3>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {LOCATIONS.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => update("location", loc)}
                        className={cn(
                          "touch-target rounded-lg border p-3 text-sm font-medium transition-all",
                          data.location === loc ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40"
                        )}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4">
                  <h3 className="font-display text-xl font-semibold">Your contact details</h3>
                  <Input placeholder="Full Name" value={data.name} onChange={(e) => update("name", e.target.value)} className="h-12 border-border bg-background" />
                  <Input type="email" placeholder="Email Address" value={data.email} onChange={(e) => update("email", e.target.value)} className="h-12 border-border bg-background" />
                  <Input type="tel" placeholder="Phone Number" value={data.phone} onChange={(e) => update("phone", e.target.value)} className="h-12 border-border bg-background" />
                </div>
              )}

              {step === 6 && (
                <div className="text-center py-6">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <Check className="h-8 w-8" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold">Thank You!</h3>
                  <p className="mt-2 text-muted">Our team will contact you within 24 hours. Continue on WhatsApp for instant assistance.</p>
                  <Button className="mt-6" asChild>
                    <a href={`https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-4 w-4" /> Chat on WhatsApp
                    </a>
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {step < 6 && (
            <div className="mt-8 flex justify-between">
              <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              {step < 5 ? (
                <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext()}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={submit} disabled={!canNext() || submitting}>
                  {submitting ? "Submitting..." : "Submit & WhatsApp"}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </LuxurySection>
  );
}
