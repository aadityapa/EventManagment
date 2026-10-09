"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/lux-button";
import { BUDGET_RANGES, EVENT_TYPES } from "@/lib/constants";

/** One published collection, pre-shaped on the server so content.ts never ships to the client. */
export type CalculatorCollection = { name: string; slug: string; from: string; guests: string };

type InlineBudgetCalculatorProps = {
  collections: CalculatorCollection[];
  /** Lowest single-service starting price, e.g. "₹2,00,000". */
  singleFrom: string;
};

const UNDER = "under";

/**
 * "Which collection fits": guests + event type → the published collection and
 * its budget band. Only published numbers (BRAND_INVESTMENTS, BUDGET_RANGES);
 * no add-on prices are invented. Collection i maps to budget band i + 1
 * (Boutique from ₹10L → ₹10–35L, Signature from ₹35L → ₹35L–1Cr, Grand → ₹1Cr+).
 */
export function InlineBudgetCalculator({ collections, singleFrom }: InlineBudgetCalculatorProps) {
  const uid = useId();
  const [guests, setGuests] = useState("");
  const [eventType, setEventType] = useState("");

  const guestOptions = [
    { value: UNDER, label: "Fewer than 50" },
    ...collections.map((c, i) => ({ value: String(i), label: c.guests })),
  ];

  const pick = guests === "" ? undefined : guests === UNDER ? -1 : Number(guests);
  const collection = pick !== undefined && pick >= 0 ? collections[pick] : undefined;
  const band = pick === undefined ? undefined : BUDGET_RANGES[Math.min(pick + 1, BUDGET_RANGES.length - 1)];
  // The "Something else" catch-all names no event, so it adds nothing to the result line.
  const typeLabel = eventType === "OTHER" ? undefined : EVENT_TYPES.find((t) => t.id === eventType)?.label;
  const ready = pick !== undefined && eventType !== "";

  const params = new URLSearchParams();
  if (collection) params.set("collection", collection.slug);
  if (eventType) params.set("type", eventType);
  const query = params.toString();
  const href = query ? `/book-event?${query}` : "/book-event";

  return (
    <form className="pg-conv-calc" aria-label="Which collection fits" onSubmit={(e) => e.preventDefault()}>
      <div className="lux-form pg-conv-calc__fields">
        <fieldset className="pg-conv-calc__set">
          <legend id={`${uid}-legend`} className="lux-field__label">
            Guests
          </legend>
          <div className="pg-conv-calc__chips">
            {guestOptions.map((o) => (
              <label key={o.value} className="pg-conv-calc__chip">
                <input
                  type="radio"
                  name={`${uid}-guests`}
                  value={o.value}
                  checked={guests === o.value}
                  onChange={() => setGuests(o.value)}
                />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="lux-field">
          <label htmlFor={`${uid}-type`} className="lux-field__label">
            Event type
          </label>
          <select id={`${uid}-type`} className="lux-input" value={eventType} onChange={(e) => setEventType(e.target.value)}>
            <option value="">Choose an event type</option>
            {EVENT_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="pg-conv-calc__result" aria-live="polite">
        {ready && band ? (
          <>
            <dl className="lux-ledger lux-ledger--jewel">
              <div className="lux-ledger__row" data-marker="jewel">
                <dt className="lux-ledger__term">{collection ? collection.name : "Single services"}</dt>
                <dd className="lux-ledger__body">
                  {collection
                    ? `From ${collection.from} · ${collection.guests} guests${typeLabel ? ` · ${typeLabel}` : ""}`
                    : `From ${singleFrom} per service, or ${collections[0]?.name ?? "a collection"} for a fully planned event`}
                </dd>
              </div>
              <div className="lux-ledger__row" data-marker="jewel">
                <dt className="lux-ledger__term">Budget band</dt>
                <dd className="lux-ledger__body">{band.label}</dd>
              </div>
            </dl>
            <p className="lux-small pg-conv-calc__fine">A guide from published starting prices. Your proposal prices every line for your brief.</p>
            <Button variant="ghost" href={href} cta="pricing_calculator" location="calculator" arrow>
              Get a Free Proposal
            </Button>
          </>
        ) : (
          <p className="lux-small pg-conv-calc__fine">Choose a guest count and an event type to see the collection that fits.</p>
        )}
      </div>
    </form>
  );
}
