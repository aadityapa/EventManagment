"use client";

import { Sparkles } from "lucide-react";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import { BookingWizard } from "./booking-wizard";

const ARCHITECT_PHASES = [
  { steps: [1, 2], label: "Dream", desc: "Event type & date" },
  { steps: [3], label: "Destination", desc: "Venue selection" },
  { steps: [4, 5], label: "Atmosphere", desc: "Guests & budget" },
  { steps: [6], label: "Experience", desc: "Services & add-ons" },
  { steps: [7, 8, 9], label: "Architect", desc: "Review & confirm" },
];

/** V5 Event Architect — experiential shell over the existing 9-step wizard. */
export function EventArchitect() {
  return (
    <div className="space-y-8">
      <GlassPanel variant="commission" glow className="px-6 py-5">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-[var(--glitz-gold)]" aria-hidden />
          <p className="text-sm text-[var(--text-secondary)]">
            Five experiential chapters — all booking APIs, validation, and Razorpay checkout preserved.
          </p>
        </div>
        <ol className="mt-4 grid gap-2 sm:grid-cols-5" aria-label="Event Architect journey">
          {ARCHITECT_PHASES.map((p) => (
            <li key={p.label} className="rounded-lg border border-[var(--v4-glass-border)] px-3 py-2 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--glitz-gold)]">{p.label}</p>
              <p className="mt-0.5 text-xs text-[var(--text-muted)]">{p.desc}</p>
            </li>
          ))}
        </ol>
      </GlassPanel>
      <BookingWizard variant="architect" />
    </div>
  );
}
