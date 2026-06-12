"use client";

import { useState } from "react";
import { Wallet } from "lucide-react";
import { BrandSection, BrandHeader } from "@/brand/primitives/brand-section";
import { cn } from "@/lib/utils";

const BUDGETS = ["₹1L – 5L", "₹5L – 20L", "₹20L – 50L", "₹50L+"];
const GUESTS = ["Under 100", "100 – 300", "300 – 500", "500+"];

function estimatePackage(budget: string, guests: string): string {
  if (budget.includes("50L") || guests.includes("500")) return "The Grand Masterpiece";
  if (budget.includes("20L") || guests.includes("300")) return "The Signature Gala";
  return "The Boutique Experience";
}

export function InlineBudgetCalculator() {
  const [budget, setBudget] = useState("");
  const [guests, setGuests] = useState("");

  const recommendation = budget && guests ? estimatePackage(budget, guests) : null;

  return (
    <BrandSection>
      <BrandHeader
        label="Quick Estimate"
        title="Budget Calculator"
        subtitle="Select your budget and guest count for an instant package recommendation."
        center
      />
      <div className="mx-auto max-w-2xl brand-surface p-6 sm:p-8">
        <div className="space-y-5">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm text-muted">
              <Wallet className="h-4 w-4 text-[var(--glitz-gold)]" aria-hidden="true" /> Budget range
            </p>
            <div className="flex flex-wrap gap-2">
              {BUDGETS.map((b) => (
                <button
                  key={b}
                  type="button"
                  aria-pressed={budget === b}
                  onClick={() => setBudget(b)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm",
                    budget === b ? "border-[var(--glitz-gold)] bg-[var(--glitz-gold)]/10 text-[var(--glitz-gold)]" : "border-[var(--glitz-border)] text-muted"
                  )}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm text-muted">Guest count</p>
            <div className="flex flex-wrap gap-2">
              {GUESTS.map((g) => (
                <button
                  key={g}
                  type="button"
                  aria-pressed={guests === g}
                  onClick={() => setGuests(g)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm",
                    guests === g ? "border-[var(--glitz-gold)] bg-[var(--glitz-gold)]/10 text-[var(--glitz-gold)]" : "border-[var(--glitz-border)] text-muted"
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>
        {recommendation && (
          <div className="mt-6 rounded-lg border border-[var(--glitz-gold)]/30 bg-[var(--glitz-gold)]/5 p-4 text-center">
            <p className="text-sm text-muted">Recommended collection</p>
            <p className="mt-1 brand-display text-xl font-semibold text-[var(--glitz-gold)]">{recommendation}</p>
            <a href="/book-event" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
              Book consultation with this package →
            </a>
          </div>
        )}
      </div>
    </BrandSection>
  );
}
