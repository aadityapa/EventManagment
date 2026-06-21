"use client";

import { BrandFaqAccordion } from "@/brand/primitives/brand-faq-accordion";
import type { GlitzFaq } from "@/brand/data/faq";
import type { ServiceFaq } from "@/data/service-faqs";

type ServiceFaqSectionProps = {
  faqs: ServiceFaq[];
  serviceTitle: string;
  slug: string;
};

export function ServiceFaqSection({ faqs, serviceTitle, slug }: ServiceFaqSectionProps) {
  if (!faqs.length) return null;

  const items: GlitzFaq[] = faqs.map((f) => ({ ...f, category: serviceTitle }));

  return (
    <div className="mt-20">
      <h2 className="font-display text-2xl font-bold">Frequently Asked Questions</h2>
      <p className="mt-2 max-w-2xl text-muted">
        Common questions about our {serviceTitle.toLowerCase()} service — answered by the Nexyyra planning team.
      </p>
      <div className="mt-8 max-w-3xl">
        <BrandFaqAccordion items={items} location={`service_${slug}`} />
      </div>
    </div>
  );
}
