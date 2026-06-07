"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, Users, Check } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { EVENT_TYPES, ADDITIONAL_SERVICES } from "@/lib/constants";
import { services } from "@/data/cms";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const eventTypeBasePrices: Record<string, number> = Object.fromEntries(
  services.map((s) => [s.slug, s.basePrice])
);

const slugToEventId: Record<string, string> = {
  "corporate-events": "CORPORATE",
  "wedding-planning": "WEDDING",
  "destination-weddings": "DESTINATION_WEDDING",
  "birthday-events": "BIRTHDAY",
  "product-launches": "PRODUCT_LAUNCH",
  "conferences": "CONFERENCE",
  "exhibitions": "EXHIBITION",
  "concert-management": "CONCERT",
  "celebrity-management": "CELEBRITY",
  "brand-promotions": "BRAND_PROMOTION",
  "fashion-shows": "FASHION_SHOW",
  "event-production": "CONCERT",
};

type EventTypeId = (typeof EVENT_TYPES)[number]["id"];

export function BudgetCalculator() {
  const [eventType, setEventType] = useState<EventTypeId>(EVENT_TYPES[0].id);
  const [guestCount, setGuestCount] = useState(100);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const basePrice = useMemo(() => {
    const slug = services.find(
      (s) => slugToEventId[s.slug] === eventType
    )?.slug;
    return slug ? eventTypeBasePrices[slug] ?? 500000 : 500000;
  }, [eventType]);

  const breakdown = useMemo(() => {
    const guestMultiplier = Math.max(1, guestCount / 100);
    const planningFee = Math.round(basePrice * guestMultiplier);

    const serviceCosts = selectedServices.flatMap((id) => {
      const service = ADDITIONAL_SERVICES.find((s) => s.id === id);
      if (!service) return [];

      const cost = service.pricePerGuest
        ? service.pricePerGuest * guestCount
        : (service.price ?? 0);
      return [{ label: service.label, cost }];
    });

    const servicesTotal = serviceCosts.reduce((sum, s) => sum + s.cost, 0);
    const subtotal = planningFee + servicesTotal;
    const contingency = Math.round(subtotal * 0.1);
    const total = subtotal + contingency;

    return {
      planningFee,
      serviceCosts,
      servicesTotal,
      contingency,
      total,
    };
  }, [basePrice, guestCount, selectedServices]);

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Plan Your Budget
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Event Budget Calculator
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Get an instant estimate tailored to your event type, guest count,
            and selected services.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Configure Your Event
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="mb-3 block text-sm font-medium">
                  Event Type
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {EVENT_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setEventType(type.id)}
                      className={cn(
                        "rounded-lg border px-3 py-2.5 text-left text-sm transition-all",
                        eventType === type.id
                          ? "border-primary bg-primary/10 text-primary shadow-glow"
                          : "border-border hover:border-primary/30 hover:bg-primary/5"
                      )}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="guest-count"
                  className="mb-2 flex items-center gap-2 text-sm font-medium"
                >
                  <Users className="h-4 w-4 text-primary" />
                  Guest Count: {guestCount}
                </label>
                <input
                  id="guest-count"
                  type="range"
                  min={10}
                  max={5000}
                  step={10}
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="mt-1 flex justify-between text-xs text-muted">
                  <span>10</span>
                  <span>5,000</span>
                </div>
                <Input
                  type="number"
                  min={10}
                  max={5000}
                  value={guestCount}
                  onChange={(e) =>
                    setGuestCount(
                      Math.min(5000, Math.max(10, Number(e.target.value) || 10))
                    )
                  }
                  className="mt-2 w-32"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium">
                  Additional Services
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {ADDITIONAL_SERVICES.map((service) => {
                    const isSelected = selectedServices.includes(service.id);
                    const priceLabel = service.pricePerGuest
                      ? `${formatCurrency(service.pricePerGuest)}/guest`
                      : formatCurrency(service.price ?? 0);

                    return (
                      <button
                        key={service.id}
                        onClick={() => toggleService(service.id)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition-all",
                          isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/30"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border"
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{service.label}</p>
                          <p className="text-xs text-muted">{priceLabel}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Estimated Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                key={breakdown.total}
                initial={{ scale: 0.95, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-6 rounded-xl gradient-gold p-6 text-center"
              >
                <p className="text-sm font-medium text-black/60">
                  Total Estimate
                </p>
                <p className="font-display text-3xl font-bold text-black sm:text-4xl">
                  {formatCurrency(breakdown.total)}
                </p>
                <p className="mt-1 text-xs text-black/50">
                  For {guestCount} guests
                </p>
              </motion.div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted">Event Planning</span>
                  <span className="font-medium">
                    {formatCurrency(breakdown.planningFee)}
                  </span>
                </div>

                {breakdown.serviceCosts.map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between border-b border-border pb-2"
                  >
                    <span className="text-muted">{item.label}</span>
                    <span className="font-medium">
                      {formatCurrency(item.cost)}
                    </span>
                  </div>
                ))}

                {breakdown.serviceCosts.length > 0 && (
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted">Services Subtotal</span>
                    <span className="font-medium">
                      {formatCurrency(breakdown.servicesTotal)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted">Contingency (10%)</span>
                  <span className="font-medium">
                    {formatCurrency(breakdown.contingency)}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-xs text-muted">
                * This is an approximate estimate. Final pricing depends on
                venue, date, and specific requirements.
              </p>

              <Button asChild className="mt-6 w-full">
                <a href="/contact">Get Detailed Quote</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
