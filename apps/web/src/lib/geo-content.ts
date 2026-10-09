/** GEO/AEO content — blog FAQs and universal local FAQs (capability and process only) */

import { BRAND_INVESTMENTS, BRAND_REPLY_HOURS } from "@/brand/data/content";
import { services } from "@/data/cms";

export type GeoFaq = { question: string; answer: string };

// Price story comes from content.ts / cms.ts only — never typed into copy.
const [BOUTIQUE, SIGNATURE, GRAND] = BRAND_INVESTMENTS;
const lakhs = (price: number) => `₹${price / 1_00_000} Lakhs`;
const SINGLE_SERVICE_FROM = lakhs(Math.min(...services.map((s) => s.basePrice)));
const WEDDING_FROM = lakhs(services.find((s) => s.slug === "wedding-planning")?.basePrice ?? 0);

export const UNIVERSAL_LOCAL_FAQS: GeoFaq[] = [
  {
    question: "How do I book a consultation with Nexyyra Events?",
    answer:
      `Use the form on this page or at https://www.nexyyra.com/book-event, or call or WhatsApp +91 7020640157. ${BRAND_REPLY_HOURS} After a free consultation, your itemised proposal follows within 48 hours, and a 30% advance secures the date.`,
  },
  {
    question: "Which cities does Nexyyra Events serve?",
    answer:
      "Our registered office is in Telhara, Maharashtra, with a Delivery & Coordination Office in Pune. We plan events in Pune, Mumbai, Delhi, Bangalore, Hyderabad, Jaipur, Indore, Nashik, Nagpur, Ahmedabad, Surat, Goa and Udaipur, elsewhere in India and at international destinations.",
  },
  {
    question: "What languages does Nexyyra support?",
    answer:
      "Consultations are available in English, Hindi and Marathi. Invitations and guest communications can be prepared in other languages on request.",
  },
  {
    question: "What is Nexyyra Events' price range?",
    answer: `Collections start from ${BOUTIQUE.from} (${BOUTIQUE.name}, 50–150 guests), ${SIGNATURE.from} (${SIGNATURE.name}, 150–500 guests) and ${GRAND.from} (${GRAND.name}, 500+ guests). Single services start from ${SINGLE_SERVICE_FROM}. Every proposal is itemised after a free consultation.`,
  },
  {
    question: "Does Nexyyra offer free consultations?",
    answer:
      "Yes. Every engagement begins with a free, no-obligation consultation by phone, video call or in person. There is no fee to receive a proposal.",
  },
];

export const BLOG_FAQS: Record<string, GeoFaq[]> = {
  "wedding-planner-pune-guide": [
    {
      question: "How much does a wedding planner cost in Pune?",
      answer: `Planner fees vary with guest count, venue and design scope. With Nexyyra Events, wedding planning as a single service starts from ${WEDDING_FROM} and collections from ${BOUTIQUE.from}; consultations are free and every proposal is itemised.`,
    },
    {
      question: "When should I hire a wedding planner in Pune?",
      answer: "Engage a planner 9–12 months before your wedding date. Peak season (November–February) needs earlier booking, both for Pune venues and for destination venues.",
    },
  ],
  "destination-wedding-trends-2026": [
    {
      question: "What are the top destination wedding trends for 2026?",
      answer: "Formats worth considering for 2026 include intimate guest lists, sustainable décor, multi-day programmes with an event for every evening, and heritage palace venues in Udaipur and Jaipur.",
    },
  ],
  "corporate-event-roi": [
    {
      question: "How do you measure ROI on corporate events?",
      answer: "Agree the goals before planning — leads, employee engagement or media coverage — and how each will be measured. After the event, a post-event debrief and media hand-over covers attendance, the feedback you collected and the photos and films.",
    },
  ],
};

export function getBlogFaqs(slug: string): GeoFaq[] {
  return BLOG_FAQS[slug] ?? [];
}
