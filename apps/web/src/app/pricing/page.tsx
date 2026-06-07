import Link from "next/link";
import { Check } from "lucide-react";
import { pricingPlans, faqs } from "@/data/cms";
import { generateSEO } from "@/lib/seo";
import { PageHero } from "@/components/shared/page-hero";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const metadata = generateSEO({
  title: "Pricing",
  description:
    "Transparent event planning packages — Essential, Premium, and Luxury tiers for every celebration.",
  path: "/pricing",
});

export default function PricingPage() {
  const pricingFaqs = faqs.filter((f) =>
    ["Payment", "Booking", "General"].includes(f.category)
  );

  return (
    <>
      <PageHero
        title="Pricing Plans"
        subtitle="Choose the perfect package for your extraordinary event"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "glass-card relative flex flex-col p-8",
                  plan.popular && "ring-2 ring-primary shadow-glow lg:-mt-4 lg:mb-4"
                )}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-gold px-4 py-1 text-xs font-semibold text-black">
                    Most Popular
                  </span>
                )}
                <h3 className="font-display text-2xl font-bold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted">{plan.description}</p>
                <p className="mt-4 font-display text-4xl font-bold gradient-text">
                  {formatCurrency(plan.price)}
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className="mt-8 w-full" variant={plan.popular ? "default" : "outline"} asChild>
                  <Link href="/book-event">Get Started</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/5 py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center font-display text-2xl font-bold md:text-3xl">
            Plan Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-4 text-left font-medium">Feature</th>
                  {pricingPlans.map((p) => (
                    <th key={p.name} className="p-4 text-center font-medium">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  "Event consultation",
                  "Full event planning",
                  "Dedicated event director",
                  "Vendor management",
                  "24/7 concierge",
                ].map((feature) => (
                  <tr key={feature} className="border-b border-border/50">
                    <td className="p-4">{feature}</td>
                    {pricingPlans.map((plan, i) => (
                      <td key={plan.name} className="p-4 text-center">
                        {plan.features.some((f) =>
                          f.toLowerCase().includes(feature.split(" ")[0].toLowerCase())
                        ) || (i === 2 && feature.includes("director")) || (i >= 1 && feature.includes("Vendor")) ? (
                          <Check className="mx-auto h-4 w-4 text-primary" />
                        ) : i === 0 && feature === "Event consultation" ? (
                          <Check className="mx-auto h-4 w-4 text-primary" />
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center font-display text-2xl font-bold">
            Frequently Asked Questions
          </h2>
          <FaqAccordion items={pricingFaqs} />
          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <Link href="/faqs">View All FAQs</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
