"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  Check,
  CreditCard,
  MapPin,
  PartyPopper,
  Users,
  Wallet,
} from "lucide-react";
import { venues } from "@/data/cms";
import {
  ADDITIONAL_SERVICES,
  BUDGET_RANGES,
  EVENT_TYPES,
} from "@/lib/constants";
import { DynamicIcon } from "@/components/shared/dynamic-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";

const STEPS = [
  "Event Type",
  "Date",
  "Venue",
  "Guests",
  "Budget",
  "Services",
  "Review",
  "Payment",
  "Confirmation",
];

const GST_RATE = 0.18;

interface BookingState {
  eventType: string;
  date: string;
  venueId: string;
  guestCount: number;
  budgetId: string;
  services: string[];
  paymentMethod: string;
  bookingNumber: string;
}

const initialState: BookingState = {
  eventType: "",
  date: "",
  venueId: "",
  guestCount: 100,
  budgetId: "",
  services: [],
  paymentMethod: "",
  bookingNumber: "",
};

export function BookingWizard() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<BookingState>(initialState);

  const selectedVenue = venues.find((v) => v.id === state.venueId);
  const selectedBudget = BUDGET_RANGES.find((b) => b.id === state.budgetId);
  const selectedEvent = EVENT_TYPES.find((e) => e.id === state.eventType);

  const servicesTotal = useMemo(() => {
    return state.services.reduce((sum, id) => {
      const service = ADDITIONAL_SERVICES.find((s) => s.id === id);
      if (!service) return sum;
      if ("pricePerGuest" in service && service.pricePerGuest) {
        return sum + service.pricePerGuest * state.guestCount;
      }
      return sum + (service.price ?? 0);
    }, 0);
  }, [state.services, state.guestCount]);

  const venueCost = selectedVenue?.pricePerDay ?? 0;
  const subtotal = venueCost + servicesTotal;
  const gst = Math.round(subtotal * GST_RATE);
  const total = subtotal + gst;

  const progress = (step / STEPS.length) * 100;

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!state.eventType;
      case 2:
        return !!state.date;
      case 3:
        return !!state.venueId;
      case 4:
        return state.guestCount >= 10;
      case 5:
        return !!state.budgetId;
      case 6:
        return true;
      case 7:
        return true;
      case 8:
        return !!state.paymentMethod;
      default:
        return true;
    }
  };

  const next = () => {
    if (step === 8) {
      const bookingNumber = `JIJU-${Date.now().toString(36).toUpperCase()}`;
      setState((s) => ({ ...s, bookingNumber }));
    }
    if (step < STEPS.length) setStep((s) => s + 1);
  };

  const back = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const toggleService = (id: string) => {
    setState((s) => ({
      ...s,
      services: s.services.includes(id)
        ? s.services.filter((x) => x !== id)
        : [...s.services, id],
    }));
  };

  return (
    <div className="mx-auto max-w-4xl px-0 sm:px-2">
      <div className="mb-6 sm:mb-8">
        <div className="mb-2 flex justify-between text-xs text-muted sm:text-sm">
          <span className="truncate pr-2">
            Step {step}/{STEPS.length}: {STEPS[step - 1]}
          </span>
          <span className="shrink-0">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-border">
          <motion.div
            className="h-full gradient-gold"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="scroll-nav mt-3 gap-2 pb-1 md:hidden">
          {STEPS.map((label, i) => (
            <span
              key={label}
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-medium",
                i + 1 === step ? "gradient-gold text-black" : "bg-border text-muted"
              )}
            >
              {i + 1}. {label}
            </span>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="flex items-center gap-2">
            {step === 1 && <PartyPopper className="h-5 w-5 text-primary" />}
            {step === 2 && <Calendar className="h-5 w-5 text-primary" />}
            {step === 3 && <MapPin className="h-5 w-5 text-primary" />}
            {step === 4 && <Users className="h-5 w-5 text-primary" />}
            {step === 5 && <Wallet className="h-5 w-5 text-primary" />}
            {step === 6 && <Building2 className="h-5 w-5 text-primary" />}
            {step === 7 && <Check className="h-5 w-5 text-primary" />}
            {step === 8 && <CreditCard className="h-5 w-5 text-primary" />}
            {step === 9 && <PartyPopper className="h-5 w-5 text-primary" />}
            {STEPS[step - 1]}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {step === 1 && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {EVENT_TYPES.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setState((s) => ({ ...s, eventType: type.id }))}
                      className={cn(
                        "glass-card flex flex-col items-center gap-2 p-4 text-center transition-all hover:shadow-glow",
                        state.eventType === type.id && "ring-2 ring-primary shadow-glow"
                      )}
                    >
                      <DynamicIcon name={type.icon} className="h-8 w-8 text-primary" />
                      <span className="text-xs font-medium sm:text-sm">{type.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="mx-auto max-w-sm">
                  <label className="mb-2 block text-sm font-medium">Event Date</label>
                  <Input
                    type="date"
                    value={state.date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setState((s) => ({ ...s, date: e.target.value }))}
                    className="text-base"
                  />
                  <p className="mt-3 text-sm text-muted">
                    We recommend booking 6–12 months in advance for weddings.
                  </p>
                </div>
              )}

              {step === 3 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {venues.map((venue) => (
                    <button
                      key={venue.id}
                      type="button"
                      onClick={() => setState((s) => ({ ...s, venueId: venue.id }))}
                      className={cn(
                        "glass-card p-4 text-left transition-all hover:shadow-glow",
                        state.venueId === venue.id && "ring-2 ring-primary shadow-glow"
                      )}
                    >
                      <h4 className="font-semibold">{venue.name}</h4>
                      <p className="text-sm text-muted">{venue.city} · {venue.capacity} guests</p>
                      <p className="mt-2 text-sm font-medium text-primary">
                        {formatCurrency(venue.pricePerDay)}/day
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {step === 4 && (
                <div className="mx-auto max-w-md space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Guest Count: {state.guestCount}
                    </label>
                    <input
                      type="range"
                      min={10}
                      max={5000}
                      step={10}
                      value={state.guestCount}
                      onChange={(e) =>
                        setState((s) => ({ ...s, guestCount: Number(e.target.value) }))
                      }
                      className="w-full accent-primary"
                    />
                    <div className="mt-1 flex justify-between text-xs text-muted">
                      <span>10</span>
                      <span>5,000</span>
                    </div>
                  </div>
                  <Input
                    type="number"
                    min={10}
                    max={5000}
                    value={state.guestCount}
                    onChange={(e) =>
                      setState((s) => ({
                        ...s,
                        guestCount: Math.max(10, Number(e.target.value)),
                      }))
                    }
                    placeholder="Or enter exact count"
                  />
                </div>
              )}

              {step === 5 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {BUDGET_RANGES.map((range) => (
                    <button
                      key={range.id}
                      type="button"
                      onClick={() => setState((s) => ({ ...s, budgetId: range.id }))}
                      className={cn(
                        "glass-card p-4 text-left transition-all hover:shadow-glow",
                        state.budgetId === range.id && "ring-2 ring-primary shadow-glow"
                      )}
                    >
                      <span className="font-medium">{range.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {step === 6 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {ADDITIONAL_SERVICES.map((service) => (
                    <label
                      key={service.id}
                      className={cn(
                        "glass-card flex cursor-pointer items-center gap-3 p-4 transition-all",
                        state.services.includes(service.id) && "ring-2 ring-primary"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={state.services.includes(service.id)}
                        onChange={() => toggleService(service.id)}
                        className="h-4 w-4 accent-primary"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{service.label}</p>
                        <p className="text-sm text-primary">
                          {"pricePerGuest" in service && service.pricePerGuest
                            ? `${formatCurrency(service.pricePerGuest)}/guest`
                            : formatCurrency(service.price ?? 0)}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {step === 7 && (
                <div className="space-y-4">
                  <div className="glass-card divide-y divide-border">
                    <SummaryRow label="Event Type" value={selectedEvent?.label ?? "—"} />
                    <SummaryRow label="Date" value={state.date || "—"} />
                    <SummaryRow label="Venue" value={selectedVenue?.name ?? "—"} />
                    <SummaryRow label="Guests" value={state.guestCount.toString()} />
                    <SummaryRow label="Budget Range" value={selectedBudget?.label ?? "—"} />
                    <SummaryRow
                      label="Additional Services"
                      value={
                        state.services.length
                          ? state.services
                              .map(
                                (id) =>
                                  ADDITIONAL_SERVICES.find((s) => s.id === id)?.label
                              )
                              .join(", ")
                          : "None"
                      }
                    />
                  </div>
                  <div className="glass-card p-4">
                    <div className="flex justify-between text-sm">
                      <span>Venue</span>
                      <span>{formatCurrency(venueCost)}</span>
                    </div>
                    <div className="mt-2 flex justify-between text-sm">
                      <span>Services</span>
                      <span>{formatCurrency(servicesTotal)}</span>
                    </div>
                    <div className="mt-2 flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="mt-2 flex justify-between text-sm text-muted">
                      <span>GST (18%)</span>
                      <span>{formatCurrency(gst)}</span>
                    </div>
                    <div className="mt-3 flex justify-between border-t border-border pt-3 font-semibold">
                      <span>Total</span>
                      <span className="text-primary">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
              )}

              {step === 8 && (
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { id: "razorpay", label: "Razorpay", desc: "UPI, Cards, Net Banking" },
                    { id: "stripe", label: "Stripe", desc: "International Cards" },
                    { id: "paypal", label: "PayPal", desc: "Global Payments" },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() =>
                        setState((s) => ({ ...s, paymentMethod: method.id }))
                      }
                      className={cn(
                        "glass-card p-6 text-center transition-all hover:shadow-glow",
                        state.paymentMethod === method.id && "ring-2 ring-primary shadow-glow"
                      )}
                    >
                      <CreditCard className="mx-auto h-8 w-8 text-primary" />
                      <p className="mt-3 font-semibold">{method.label}</p>
                      <p className="mt-1 text-xs text-muted">{method.desc}</p>
                    </button>
                  ))}
                  <p className="col-span-full text-center text-sm text-muted">
                    30% advance required to confirm booking · Total: {formatCurrency(total)}
                  </p>
                </div>
              )}

              {step === 9 && (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full gradient-gold">
                    <Check className="h-10 w-10 text-black" />
                  </div>
                  <h3 className="font-display text-2xl font-bold">Booking Confirmed!</h3>
                  <p className="mt-2 text-muted">
                    Your booking number is{" "}
                    <span className="font-mono font-semibold text-primary">
                      {state.bookingNumber}
                    </span>
                  </p>
                  <p className="mt-4 text-sm text-muted">
                    Confirmation sent via email, SMS, and WhatsApp. Our team will contact
                    you within 24 hours.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {step < 9 && (
            <div className="mt-6 flex flex-col-reverse gap-3 sm:mt-8 sm:flex-row sm:justify-between">
              <Button variant="outline" onClick={back} disabled={step === 1} className="w-full sm:w-auto">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button onClick={next} disabled={!canProceed()} className="w-full sm:w-auto">
                {step === 8 ? "Confirm & Pay" : "Continue"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 px-4 py-3 text-sm sm:flex-row sm:justify-between sm:gap-4">
      <span className="shrink-0 text-muted">{label}</span>
      <span className="font-medium sm:text-right">{value}</span>
    </div>
  );
}
