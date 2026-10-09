import { WhyView } from "@/brand";
import { generateSEO } from "@/lib/seo";

/* /testimonials 308s here (next.config.ts). Breadcrumb JSON-LD comes from the
   cover; no Review or AggregateRating markup — the page describes commitments
   and process, not reviews. */
export const metadata = generateSEO({
  title: "Why Nexyyra — What Working With Us Is Like",
  description:
    "Free consultation, same-day planner reply, itemised proposal within 48 hours and one event director. How Nexyyra Events plans weddings and corporate events, and what we don't do.",
  path: "/why-nexyyra",
  noIndex: false,
});

export default function WhyNexyyraPage() {
  return <WhyView />;
}
