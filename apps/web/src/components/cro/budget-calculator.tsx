"use client";

import { useState } from "react";
import Link from "next/link";
import { Wallet, ArrowUpRight } from "lucide-react";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import { ScrollReveal } from "@/lib/motion";
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
    <section className="v4-section border-y border-[var(--glitz-border)] bg-[var(--glitz-surface)]/30">
      <div className="brand-container">
        <ScrollReveal preset="reveal" className="text-center">
          <span className="v4-kicker mb-4">Quick Estimate</span>
          <h2 className="v4-title">Budget Calculator</h2>
          <p className="v4-body mx-auto mt-3 max-w-xl text-muted">
            Select your budget and guest count for an instant collection recommendation.
          </p>
        </ScrollReveal>

        <ScrollReveal preset="scale" delay={0.1} className="mx-auto mt-10 max-w-2xl">
          <GlassPanel glow className="p-6 sm:p-8">
            <div className="space-y-6">
              <div>
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted">
                  <Wallet className="h-4 w-4 text-[var(--glitz-gold)]" aria-hidden="true" />
                  Budget range
                </p>
                <div className="flex flex-wrap gap-2">
                  {BUDGETS.map((b) => (
                    <button
                      key={b}
                      type="button"
                      aria-pressed={budget === b}
                      onClick={() => setBudget(b)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm transition-all",
                        budget === b
                          ? "border-[var(--glitz-gold)] bg-[var(--glitz-gold)]/10 text-[var(--glitz-gold)] shadow-[var(--v4-glow-gold)]"
                          : "border-[var(--glitz-border)] text-muted hover:border-[var(--glitz-gold)]/40"
                      )}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-3 text-sm font-semibold text-muted">Guest count</p>
                <div className="flex flex-wrap gap-2">
                  {GUESTS.map((g) => (
                    <button
                      key={g}
                      type="button"
                      aria-pressed={guests === g}
                      onClick={() => setGuests(g)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm transition-all",
                        guests === g
                          ? "border-[var(--glitz-gold)] bg-[var(--glitz-gold)]/10 text-[var(--glitz-gold)] shadow-[var(--v4-glow-gold)]"
                          : "border-[var(--glitz-border)] text-muted hover:border-[var(--glitz-gold)]/40"
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {recommendation && (
              <div className="mt-8 rounded-[var(--v4-radius)] border border-[var(--glitz-gold)]/30 bg-[var(--glitz-gold)]/5 p-5 text-center">
                <p className="text-sm text-muted">Recommended collection</p>
                <p className="mt-1 v4-title text-xl text-[var(--glitz-gold)]">{recommendation}</p>
                <Link
                  href="/book-event"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--glitz-gold)] hover:underline"
                >
                  Book consultation with this package
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </GlassPanel>
        </ScrollReveal>
      </div>
    </section>
  );
}
