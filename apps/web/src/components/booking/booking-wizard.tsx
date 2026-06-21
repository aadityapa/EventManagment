"use client";

import { useEffect, useMemo, useState } from "react";
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
import { venues as fallbackVenues } from "@/data/cms";
import {
  ADDITIONAL_SERVICES,
  BUDGET_RANGES,
  EVENT_TYPES,
} from "@/lib/constants";
import { DynamicIcon } from "@/components/shared/dynamic-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import { cn, formatCurrency, getApiUrl } from "@/lib/utils";
import { toast } from "sonner";

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

type VenueOption = {
  id: string;
  name: string;
  city: string;
  capacity: number;
  pricePerDay: number;
};

type MeResponse = {
  authenticated?: boolean;
  user?: { name?: string; email?: string; phone?: string };
};

type BookingCreated = { id: string; bookingNumber: string };
type RazorpayOrderCreated = { key: string; orderId: string; paymentId: string; amount: number; currency?: string; bookingNumber?: string };

type RazorpaySuccessResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayInstance = { open: () => void };
type RazorpayCtor = new (opts: {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color: string };
  handler: (resp: RazorpaySuccessResponse) => void;
  modal?: { ondismiss?: () => void };
}) => RazorpayInstance;

const ARCHITECT_LABELS: Record<number, string> = {
  1: "Dream — Event Type",
  2: "Dream — Date",
  3: "Destination — Venue",
  4: "Atmosphere — Guests",
  5: "Atmosphere — Budget",
  6: "Experience Level — Services",
  7: "Meet Architect — Review",
  8: "Meet Architect — Payment",
  9: "Meet Architect — Confirmed",
};

function getArchitectPhase(step: number) {
  if (step <= 2) return 1;
  if (step === 3) return 2;
  if (step <= 5) return 3;
  if (step === 6) return 4;
  return 5;
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

export function BookingWizard({ variant = "default" }: { variant?: "default" | "architect" }) {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<BookingState>(initialState);
  const [venueOptions, setVenueOptions] = useState<VenueOption[]>(
    fallbackVenues.map((v) => ({
      id: v.id,
      name: v.name,
      city: v.city,
      capacity: v.capacity,
      pricePerDay: v.pricePerDay,
    }))
  );
  const [venuesLoadedFromApi, setVenuesLoadedFromApi] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch(getApiUrl("/venues"), { method: "GET" });
        const data = (await res.json().catch(() => null)) as unknown;
        if (!ignore && res.ok && Array.isArray(data)) {
          const mapped = (data as unknown[]).map((raw) => {
            if (!raw || typeof raw !== "object") return null;
            const r = raw as Record<string, unknown>;
            const id = typeof r.id === "string" ? r.id : String(r.id ?? "");
            const name = typeof r.name === "string" ? r.name : String(r.name ?? "");
            const city = typeof r.city === "string" ? r.city : String(r.city ?? "");
            const capacity = typeof r.capacity === "number" ? r.capacity : Number(r.capacity ?? 0);
            const pricePerDay = typeof r.pricePerDay === "number" ? r.pricePerDay : Number(r.pricePerDay ?? 0);
            if (!id || !name) return null;
            return { id, name, city, capacity, pricePerDay };
          }).filter((v): v is VenueOption => Boolean(v));
          if (mapped.length) {
            setVenueOptions(mapped);
            setVenuesLoadedFromApi(true);
          }
        }
      } catch {
        // keep fallback
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const selectedVenue = venueOptions.find((v) => v.id === state.venueId);
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
        return !!state.paymentMethod && !isPaying;
      default:
        return true;
    }
  };

  const loadRazorpay = async (): Promise<boolean> => {
    if (typeof window === "undefined") return false;
    const w = window as unknown as { Razorpay?: RazorpayCtor };
    if (w.Razorpay) return true;
    await new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existing) {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error("load_failed")), { once: true });
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("load_failed"));
      document.body.appendChild(script);
    });
    return !!(window as unknown as { Razorpay?: RazorpayCtor }).Razorpay;
  };

  const handleConfirmAndPay = async () => {
    if (state.paymentMethod !== "razorpay") {
      toast.error("Only Razorpay is enabled right now.");
      return;
    }
    if (!selectedVenue) {
      toast.error("Please select a venue.");
      return;
    }
    if (!venuesLoadedFromApi) {
      toast.error("Backend venues not loaded. Please start the API (server) or try again.");
      return;
    }
    if (!selectedBudget) {
      toast.error("Please select a budget range.");
      return;
    }

    setIsPaying(true);
    try {
      // Check session (cookie)
      const meRes = await fetch("/api/auth/me", { method: "GET", cache: "no-store" });
      const me = (await meRes.json().catch(() => ({}))) as MeResponse;
      if (!me?.authenticated) {
        toast.error("Please sign in to confirm and pay.");
        window.location.href = `/login?next=${encodeURIComponent("/book-event")}`;
        return;
      }

      // 1) Create booking in DB
      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: state.eventType,
          eventDate: state.date,
          venueId: state.venueId,
          guestCount: state.guestCount,
          budget: selectedBudget.max,
          additionalServices: state.services,
          notes: "",
        }),
      });
      const bookingJson = (await bookingRes.json().catch(() => ({}))) as unknown;
      if (!bookingRes.ok) {
        const err =
          bookingJson && typeof bookingJson === "object"
            ? String((bookingJson as Record<string, unknown>).error ?? "Failed to create booking")
            : "Failed to create booking";
        throw new Error(err);
      }
      const bookingObj = bookingJson as Record<string, unknown>;
      const booking: BookingCreated = {
        id: String(bookingObj.id ?? ""),
        bookingNumber: String(bookingObj.bookingNumber ?? ""),
      };
      if (!booking.id || !booking.bookingNumber) throw new Error("Invalid booking response");

      // 2) Create Razorpay order (advance)
      const orderRes = await fetch("/api/payments/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking.id }),
      });
      const orderJson = (await orderRes.json().catch(() => ({}))) as unknown;
      if (!orderRes.ok) {
        const err =
          orderJson && typeof orderJson === "object"
            ? String((orderJson as Record<string, unknown>).error ?? "Failed to create payment order")
            : "Failed to create payment order";
        throw new Error(err);
      }
      const orderObj = orderJson as Record<string, unknown>;
      const order: RazorpayOrderCreated = {
        key: String(orderObj.key ?? ""),
        orderId: String(orderObj.orderId ?? ""),
        paymentId: String(orderObj.paymentId ?? ""),
        amount: Number(orderObj.amount ?? 0),
        currency: typeof orderObj.currency === "string" ? orderObj.currency : undefined,
        bookingNumber: typeof orderObj.bookingNumber === "string" ? orderObj.bookingNumber : undefined,
      };
      if (!order.key || !order.orderId || !order.paymentId || !order.amount) throw new Error("Invalid payment order response");

      // 3) Open Razorpay checkout
      const ok = await loadRazorpay();
      if (!ok) throw new Error("Failed to load Razorpay");

      const Razorpay = (window as unknown as { Razorpay?: RazorpayCtor }).Razorpay;
      if (!Razorpay) throw new Error("Razorpay is not available");

      const rzp = new Razorpay({
        key: order.key,
        amount: Math.round(Number(order.amount) * 100),
        currency: order.currency || "INR",
        name: "Nexyyra Events",
        description: `Advance for booking ${order.bookingNumber || booking.bookingNumber}`,
        order_id: order.orderId,
        prefill: {
          name: me.user?.name,
          email: me.user?.email,
          contact: me.user?.phone,
        },
        notes: {
          bookingId: booking.id,
          bookingNumber: booking.bookingNumber,
        },
        theme: { color: "#d4af37" },
        handler: async (resp: RazorpaySuccessResponse) => {
          try {
            const verifyRes = await fetch("/api/payments/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paymentId: order.paymentId,
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
              }),
            });
            const verified = await verifyRes.json().catch(() => ({}));
            if (!verifyRes.ok) throw new Error(verified.error || "Verification failed");

            toast.success("Payment successful. Booking confirmed.");
            setState((s) => ({ ...s, bookingNumber: booking.bookingNumber }));
            setStep(9);
          } catch (e) {
            toast.error(e instanceof Error ? e.message : "Payment verification failed");
          } finally {
            setIsPaying(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsPaying(false);
          },
        },
      });

      rzp.open();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment failed");
      setIsPaying(false);
    }
  };

  const next = async () => {
    if (step === 8) {
      await handleConfirmAndPay();
      return;
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

  const stepCardClass =
    "v4-glass rounded-[var(--v4-radius-lg)] p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--v4-glow-gold-sm)]";
  const stepCardActive = "ring-2 ring-[var(--glitz-gold)]/60 shadow-[var(--v4-glow-gold-sm)]";

  return (
    <div className="mx-auto max-w-4xl px-0 sm:px-2">
      <div className="mb-6 sm:mb-8">
        <div className="mb-3 flex justify-between text-xs text-[var(--text-secondary)] sm:text-sm">
          <span className="truncate pr-2">
            {variant === "architect" ? (
              <>
                Chapter {getArchitectPhase(step)}/5:{" "}
                <span className="text-[var(--glitz-gold)]">{ARCHITECT_LABELS[step]}</span>
              </>
            ) : (
              <>
                Step {step}/{STEPS.length}:{" "}
                <span className="text-[var(--glitz-gold)]">{STEPS[step - 1]}</span>
              </>
            )}
          </span>
          <span className="shrink-0 font-semibold text-[var(--glitz-gold)]">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--glitz-border)]">
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--glitz-gold-dark)] via-[var(--glitz-gold)] to-[var(--glitz-gold-light)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        {/* Desktop step rail */}
        {variant !== "architect" && (
        <ol className="mt-5 hidden gap-1 md:grid md:grid-cols-9" aria-label="Booking progress">
          {STEPS.map((label, i) => {
            const stepNum = i + 1;
            const done = step > stepNum;
            const current = step === stepNum;
            return (
              <li
                key={label}
                className={cn(
                  "rounded-lg border px-1 py-2 text-center text-[10px] font-medium leading-tight transition-colors",
                  current
                    ? "border-[var(--glitz-gold)]/50 bg-[var(--glitz-gold)]/10 text-[var(--glitz-gold)]"
                    : done
                      ? "border-[var(--glitz-gold)]/25 text-[var(--glitz-gold)]/70"
                      : "border-[var(--glitz-border)] text-[var(--text-secondary)]"
                )}
              >
                <span className="block font-[family-name:var(--font-cinzel)] text-xs">{stepNum}</span>
                {label}
              </li>
            );
          })}
        </ol>
        )}

        <div className={cn("scroll-nav mt-3 gap-2 pb-1", variant === "architect" ? "flex flex-wrap" : "md:hidden")}>
          {STEPS.map((label, i) => (
            <span
              key={label}
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-medium",
                i + 1 === step
                  ? "bg-[var(--glitz-gold)]/15 text-[var(--glitz-gold)] ring-1 ring-[var(--glitz-gold)]/40"
                  : "bg-[var(--glitz-border)] text-muted"
              )}
            >
              {i + 1}. {label}
            </span>
          ))}
        </div>
      </div>

      <GlassPanel glow className="overflow-hidden">
        <div className="border-b border-[var(--glitz-border)] px-4 py-5 sm:px-8">
          <h2 className="flex items-center gap-2 font-[family-name:var(--font-playfair)] text-xl font-semibold">
            {step === 1 && <PartyPopper className="h-5 w-5 text-primary" />}
            {step === 2 && <Calendar className="h-5 w-5 text-primary" />}
            {step === 3 && <MapPin className="h-5 w-5 text-primary" />}
            {step === 4 && <Users className="h-5 w-5 text-primary" />}
            {step === 5 && <Wallet className="h-5 w-5 text-primary" />}
            {step === 6 && <Building2 className="h-5 w-5 text-primary" />}
            {step === 7 && <Check className="h-5 w-5 text-primary" />}
            {step === 8 && <CreditCard className="h-5 w-5 text-primary" />}
            {step === 9 && <PartyPopper className="h-5 w-5 text-primary" />}
            {variant === "architect" ? ARCHITECT_LABELS[step] : STEPS[step - 1]}
          </h2>
        </div>
        <div className="px-4 py-6 sm:px-8 sm:py-8">
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
                        stepCardClass,
                        "flex flex-col items-center gap-2 text-center",
                        state.eventType === type.id && stepCardActive
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
                  {venueOptions.map((venue) => (
                    <button
                      key={venue.id}
                      type="button"
                      onClick={() => setState((s) => ({ ...s, venueId: venue.id }))}
                      className={cn(stepCardClass, state.venueId === venue.id && stepCardActive)}
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
                      className={cn(stepCardClass, state.budgetId === range.id && stepCardActive)}
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
                        stepCardClass,
                        "flex cursor-pointer items-center gap-3",
                        state.services.includes(service.id) && stepCardActive
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
                  <div className="v4-glass divide-y divide-[var(--glitz-border)] rounded-[var(--v4-radius-lg)]">
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
                  <GlassPanel liquid={false} className="p-4">
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
                  </GlassPanel>
                </div>
              )}

              {step === 8 && (
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { id: "razorpay", label: "Razorpay", desc: "UPI, Cards, Net Banking", enabled: true },
                    { id: "stripe", label: "Stripe", desc: "Coming soon", enabled: false },
                    { id: "paypal", label: "PayPal", desc: "Coming soon", enabled: false },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => method.enabled && setState((s) => ({ ...s, paymentMethod: method.id }))}
                      disabled={!method.enabled}
                      className={cn(
                        stepCardClass,
                        "p-6 text-center disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none",
                        state.paymentMethod === method.id && stepCardActive
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
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[var(--glitz-gold)] bg-[var(--glitz-gold)]/15">
                    <Check className="h-10 w-10 text-[var(--glitz-gold)]" />
                  </div>
                  <h3 className="v4-display text-2xl">We&apos;re on it.</h3>
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
              <Button
                variant="outline"
                onClick={back}
                disabled={step === 1}
                className="w-full border-[var(--glitz-border)] sm:w-auto"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={() => void next()}
                disabled={!canProceed()}
                className="w-full btn-gold-metallic sm:w-auto"
              >
                {step === 8 ? (isPaying ? "Processing..." : "Confirm & Pay") : "Continue"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </GlassPanel>
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
