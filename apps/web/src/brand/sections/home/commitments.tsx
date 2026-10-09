import Link from "next/link";
import { BRAND_INVESTMENTS } from "@/brand/data/content";
import { Commitments, Section } from "@/components/ui";
import { services } from "@/data/cms";

/** ₹2,00,000 → "₹2 Lakhs" (prose style; ledgers use formatCurrency). */
function lakhs(amount: number): string {
  const value = amount / 100000;
  return `₹${Number.isInteger(value) ? value : value.toFixed(1)} ${value === 1 ? "Lakh" : "Lakhs"}`;
}

/** Both figures come from data so the price story stays single-sourced. */
const COLLECTIONS_FROM = BRAND_INVESTMENTS[0].from;
const SERVICES_FROM = lakhs(Math.min(...services.map((s) => s.basePrice)));

/** Chapter 05: the trust block — policies we control, never statistics — and one price line. */
export function HomeCommitments() {
  return (
    <Section
      id="commitments"
      number="05"
      eyebrow="Commitments"
      title="What you can hold us to"
      lead="Policies we set and keep on every engagement, whatever its size."
      lazy
    >
      <Commitments variant="grid" />
      <p className="pg-home-price">
        <span>
          Collections from {COLLECTIONS_FROM} · Single services from {SERVICES_FROM}
        </span>
        <Link href="/pricing" className="pg-home-price__link" data-cta="home_pricing" data-cta-location="home-commitments">
          See pricing
        </Link>
      </p>
    </Section>
  );
}
