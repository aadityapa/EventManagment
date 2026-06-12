export type GlitzFaq = {
  question: string;
  answer: string;
  category: string;
};

export const GLITZ_FAQS: GlitzFaq[] = [
  {
    question: "Is the initial consultation really complimentary?",
    answer:
      "Yes. Every Glitz journey begins with a private, no-obligation consultation — in person at our Pune studio, over video call, or at your preferred venue. We discuss your vision, guest count, budget range, and timeline before any commitment. Most couples and corporate clients receive a tailored proposal within 48 hours.",
    category: "Getting Started",
  },
  {
    question: "How does booking with Glitz Events work?",
    answer:
      "After your consultation, we share a bespoke proposal and contract. Confirm with a 30% advance via our secure Razorpay checkout or bank transfer. You'll receive instant confirmation by email, SMS, and WhatsApp, plus access to your client dashboard for timelines, vendor updates, and document sharing.",
    category: "Getting Started",
  },
  {
    question: "Can I customize packages for my wedding or corporate event?",
    answer:
      "Absolutely. Our Boutique, Signature, and Grandeur collections are starting points — not rigid templates. Whether you need a palace wedding in Udaipur, a black-tie corporate gala, or an intimate anniversary celebration, we tailor scope, vendors, and creative direction to your exact brief.",
    category: "Packages",
  },
  {
    question: "What is your cancellation and rescheduling policy?",
    answer:
      "We understand plans evolve. Rescheduling is handled case-by-case with priority rebooking for confirmed clients. Cancellations follow the terms in your signed agreement — vendor deposits already committed may be non-refundable. We always provide a transparent breakdown before you sign.",
    category: "Packages",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept Razorpay (cards, net banking, UPI, wallets), direct bank transfer, and UPI for Indian clients. International clients may use wire transfer. A 30% advance secures your date; the balance is invoiced in milestones aligned to your planning timeline.",
    category: "Payment",
  },
  {
    question: "Do you manage destination weddings across India and abroad?",
    answer:
      "Yes. From Udaipur palaces and Goa beachfronts to Dubai, Bali, and the Maldives — our team handles venue scouting, guest logistics, local vendor partnerships, and on-ground command centers so your celebration feels effortless, wherever it unfolds.",
    category: "Services",
  },
  {
    question: "How do you coordinate vendors and suppliers?",
    answer:
      "Glitz maintains a curated network of florists, caterers, photographers, AV teams, and décor artists vetted over a decade. Your dedicated coordinator is your single point of contact — we manage contracts, timelines, quality checks, and day-of execution so you never chase vendors.",
    category: "Services",
  },
  {
    question: "How is my personal and payment data kept secure?",
    answer:
      "All online payments are processed through PCI-DSS compliant Razorpay — we never store card details on our servers. Client documents, guest lists, and contracts are encrypted and accessible only to your assigned planning team under strict confidentiality agreements.",
    category: "Trust & Privacy",
  },
  {
    question: "How far in advance should I start planning?",
    answer:
      "For luxury weddings and destination celebrations, we recommend 9–12 months. Corporate galas and product launches typically need 3–6 months. Shorter timelines are possible based on availability — reach out and we'll advise honestly on what's achievable.",
    category: "Planning",
  },
  {
    question: "Do you offer consultations in Hindi and regional languages?",
    answer:
      "Yes. Our team conducts consultations in English, Hindi, and Marathi, with support for other regional languages through dedicated liaisons. Menus, invitations, and guest communications can be prepared in the languages your family and guests prefer.",
    category: "Planning",
  },
];

/** Curated subset for home page — reduces purchase anxiety before CTA */
export const HOME_FAQ_ITEMS: GlitzFaq[] = GLITZ_FAQS.slice(0, 8);
