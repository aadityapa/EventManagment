import { generateSEO } from "@/lib/seo";
import { TestimonialsView } from "@/brand";

/* Review JSON-LD removed (Phase-2 entity trust remediation): the previous
   reviews were template/demo data. Fabricated Review markup violates Google's
   spam policies. Reinstate reviewSchema() only with authentic, on-page,
   attributable client reviews. */

export const metadata = generateSEO({
  title: "Why Clients Choose Us",
  description:
    "Why clients choose Nexyyra Events — in-house planning, transparent budgeting, and end-to-end production for weddings and corporate events across India.",
  path: "/testimonials",
});

export default function TestimonialsPage() {
  return <TestimonialsView />;
}
