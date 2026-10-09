import { BRAND_REPLY_HOURS } from "./content";

export type GlitzFaq = {
  question: string;
  answer: string;
  category: string;
};

/** The /faqs groups, in page order. "Services" is also read by the /services chapter. */
export const FAQ_CATEGORIES = ["Getting started", "Packages", "Payment", "Services", "Trust & privacy", "Planning"] as const;
export type FaqCategory = (typeof FAQ_CATEGORIES)[number];

/* Honesty pass (V6): answers state policies the business controls and the
   published price story only — no track record, no partner networks, no
   international wire terms or language liaisons that are not on record. */
export const GLITZ_FAQS: GlitzFaq[] = [
  {
    question: "Is the initial consultation really free?",
    answer:
      "Yes. Every event begins with a free, no-obligation consultation — in person, on video, or at your venue. We talk through your vision, guest count, budget band and dates before you commit to anything. Your itemised proposal follows within 48 hours of that conversation.",
    category: "Getting started",
  },
  {
    question: "How quickly will a planner reply?",
    answer:
      `The same day. ${BRAND_REPLY_HOURS} We reply by phone, WhatsApp or email — whichever you prefer.`,
    category: "Getting started",
  },
  {
    question: "How does booking with Nexyyra Events work?",
    answer:
      "After the consultation you receive an itemised proposal and an agreement. A 30% advance secures your date, paid through Razorpay, bank transfer or UPI. You receive written confirmation, and your event director shares timelines, vendor updates and documents with you through the planning.",
    category: "Getting started",
  },
  {
    question: "What do the collections start at?",
    answer:
      "The Boutique Experience starts from ₹10 Lakhs for 50–150 guests, the Signature Gala from ₹35 Lakhs for 150–500 guests, and the Grand Masterpiece from ₹1 Crore+ for 500 guests or more. Single services start from ₹2 Lakhs. Prices exclude 18% GST. Your proposal prices every line for your brief.",
    category: "Packages",
  },
  {
    question: "Can I customise a collection for my wedding or corporate event?",
    answer:
      "Yes. The Boutique Experience, Signature Gala and Grand Masterpiece are starting points, not fixed templates. Scope, vendors and creative direction are shaped to your brief — whether that is a palace wedding, a black-tie corporate evening or an intimate anniversary dinner.",
    category: "Packages",
  },
  {
    question: "What is your cancellation and rescheduling policy?",
    answer:
      "Our Refund Policy sets a fixed schedule. If you cancel more than 90 days before the event, 80% of the advance is refundable; 61–90 days before, 50%; 30–60 days before, 25%; under 30 days, the advance is not refunded and vendor costs may apply. One complimentary date change is permitted if requested at least 45 days before the event, subject to venue and vendor availability. The full schedule is on the Refund Policy page and in your agreement before you sign.",
    category: "Packages",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "Razorpay (cards, net banking, UPI and wallets), direct bank transfer and UPI. A 30% advance secures your date; the balance is invoiced in milestones aligned to your planning timeline.",
    category: "Payment",
  },
  {
    question: "Are there any hidden fees?",
    answer:
      "No. Every line — venue, décor, production, hospitality and our fee — is itemised in your proposal before you sign, and no vendor mark-up is hidden in your quote. Published prices exclude 18% GST, which applies as set out in our Terms.",
    category: "Payment",
  },
  {
    question: "Do you plan destination weddings across India and abroad?",
    answer:
      "Yes. We plan destination weddings across India — Udaipur, Jaipur and Goa among them — and international destinations on request. Venue shortlisting, guest travel and stays, local vendor coordination and on-ground management sit with one team, led by your event director.",
    category: "Services",
  },
  {
    question: "How do you coordinate vendors and suppliers?",
    answer:
      "Your event director is your single point of contact. We shortlist florists, caterers, photographers, AV and décor teams for your brief, manage contracts and timelines, check quality, and run the day, so you never chase a vendor. Each vendor cost appears as its own line in your proposal.",
    category: "Services",
  },
  {
    question: "Do you design and produce in-house?",
    answer:
      "Yes. Décor, staging, lighting and production are designed and run by the same team that plans your event, so there is no hand-off between a planner, a designer and a production crew.",
    category: "Services",
  },
  {
    question: "Can you handle a single part of the event, like production only?",
    answer:
      "Yes. Any one of our twelve services can be booked on its own — Event Production, Exhibitions or Fashion Shows, for example. Single services start from ₹2 Lakhs, and your proposal quotes the exact scope you need.",
    category: "Services",
  },
  {
    question: "How is my personal and payment data kept secure?",
    answer:
      "Online payments are processed by Razorpay; card details are never stored on our servers. Documents, guest lists and contracts are shared only with your planning team and the vendors who need them, under confidentiality terms.",
    category: "Trust & privacy",
  },
  {
    question: "Who is the company behind Nexyyra Events?",
    answer:
      "Nexyyra Events is the trade name of Nexyyra Events and Promotions Private Limited (CIN U70200ME2026PTC476014), incorporated in 2026, with its registered office in Telhara, Maharashtra and a Delivery & Coordination Office in Pune.",
    category: "Trust & privacy",
  },
  {
    question: "How far in advance should I start planning?",
    answer:
      "For weddings and destination celebrations, 9–12 months gives the widest choice of venues and dates. Corporate evenings and product launches usually need 3–6 months. Shorter timelines can work depending on availability — ask, and we will tell you plainly what is achievable.",
    category: "Planning",
  },
  {
    question: "Which languages do you consult in?",
    answer:
      "English, Hindi and Marathi. Menus, invitations and guest communications can be prepared in the languages your family and guests prefer.",
    category: "Planning",
  },
];

export function faqsInCategory(category: FaqCategory): GlitzFaq[] {
  return GLITZ_FAQS.filter((f) => f.category === category);
}

/** Lowercase-hyphen slug for anchors and `<details name>` groups. */
export function faqSlug(text: string): string {
  return text.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Accordion rows with page-unique ids (`{prefix}-1`, `{prefix}-2` …). */
export function toAccordionItems(faqs: GlitzFaq[], prefix: string) {
  return faqs.map((f, i) => ({ id: `${prefix}-${i + 1}`, question: f.question, answer: f.answer }));
}

/** Six for the home page (spec §10.1): one or two per concern a first-time visitor has. */
export const HOME_FAQ_ITEMS: GlitzFaq[] = [
  GLITZ_FAQS[0], // free consultation
  GLITZ_FAQS[3], // starting prices
  GLITZ_FAQS[6], // payment methods
  GLITZ_FAQS[7], // hidden fees
  GLITZ_FAQS[8], // destination weddings
  GLITZ_FAQS[14], // lead time
];
