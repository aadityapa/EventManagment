/** Per-service FAQ blocks for GEO / AI search — keyed by service slug */
export type ServiceFaq = { question: string; answer: string };

export const SERVICE_FAQS: Record<string, ServiceFaq[]> = {
  "wedding-planning": [
    {
      question: "How far in advance should we book a wedding planner in Pune?",
      answer:
        "For luxury weddings with 200+ guests, we recommend engaging Nexyyra 9–12 months before your date. Peak season (November–February) fills quickly at premium venues like Lavasa, Mulshi, and Koregaon Park hotels. Shorter timelines are possible for intimate celebrations — contact us for an honest availability check.",
    },
    {
      question: "What does full wedding planning with Nexyyra include?",
      answer:
        "Our wedding planning service covers venue scouting, vendor curation (florists, caterers, photographers, entertainment), design and décor direction, timeline management, rehearsal coordination, and on-ground command on every function day. You receive a dedicated coordinator as your single point of contact from first consultation to farewell brunch.",
    },
    {
      question: "Can Nexyyra manage multi-day Maharashtrian wedding functions?",
      answer:
        "Yes. We specialise in multi-day celebrations — haldi, mehendi, sangeet, wedding, and reception — with seamless transitions between venues, coordinated guest logistics, and culturally respectful programming. Menus, invitations, and ceremonies can be prepared in Marathi, Hindi, or English.",
    },
    {
      question: "How are wedding budgets structured with Nexyyra?",
      answer:
        "After your complimentary consultation, we share a transparent proposal with line-item budgets for décor, F&B, entertainment, and production. A 30% advance secures your date; remaining payments follow milestone invoices aligned to vendor commitments. See our wedding budget guide for allocation benchmarks.",
    },
    {
      question: "Do you offer day-of coordination only?",
      answer:
        "We offer day-of and partial planning for clients who have secured most vendors independently. Our team reviews your timeline, coordinates vendors on event day, and manages contingencies — ideal for clients who want Nexyyra execution without full-scope planning.",
    },
  ],
  "corporate-events": [
    {
      question: "What types of corporate events does Nexyyra manage in Pune?",
      answer:
        "Nexyyra Events manages annual days, product launches, investor summits, award ceremonies, team-building retreats, dealer meets, and black-tie galas for 50 to 5,000 attendees. We serve IT parks, manufacturing groups, pharma, and financial services clients across Maharashtra.",
    },
    {
      question: "How do you measure ROI on corporate events?",
      answer:
        "We define KPIs before planning — lead generation, employee engagement scores, media impressions, or partnership conversions. Post-event, we deliver analytics covering attendance, survey feedback, social reach, and pipeline impact. Our corporate ROI guide outlines frameworks we use with C-suite clients.",
    },
    {
      question: "Can Nexyyra handle hybrid and virtual corporate formats?",
      answer:
        "Yes. We produce hybrid conferences with professional live streaming, remote speaker integration, and interactive Q&A for distributed teams. Our technical director manages AV, staging, and broadcast quality so in-room and virtual audiences receive a unified experience.",
    },
    {
      question: "What is the typical timeline for a corporate gala?",
      answer:
        "Corporate galas typically require 3–6 months from brief to execution. Product launches may compress to 6–8 weeks with dedicated rush capacity. We provide a detailed checklist covering venue, catering, entertainment, branding, and post-event reporting at kickoff.",
    },
    {
      question: "Do you manage vendor contracts and compliance for corporate clients?",
      answer:
        "Absolutely. We handle vendor agreements, insurance certificates, fire safety compliance, and GST invoicing. Corporate clients receive consolidated billing and documentation suitable for audit and procurement review.",
    },
  ],
  "destination-weddings": [
    {
      question: "Which destination wedding locations does Nexyyra specialise in?",
      answer:
        "Our destination portfolio spans Udaipur palaces, Jaipur heritage havelis, Goa beachfront resorts, Kerala backwaters, and international venues in Dubai, Bali, and the Maldives. We maintain preferred partnerships with luxury properties for exclusive rates and priority dates.",
    },
    {
      question: "How does Nexyyra manage guest travel and accommodation?",
      answer:
        "We coordinate group room blocks, airport transfers, welcome kits, and multi-venue shuttles. Guests receive a dedicated microsite with itineraries, dress codes, and RSVP tracking. For international destinations, we assist with visa guidance and travel insurance recommendations.",
    },
    {
      question: "What legal requirements apply to destination weddings in India?",
      answer:
        "Requirements vary by state and venue type. We liaise with local authorities for marriage registration, beach permits in Goa, and heritage property regulations in Rajasthan. Our legal checklist covers documentation timelines so your ceremony is fully compliant.",
    },
    {
      question: "Can you plan micro destination weddings under 50 guests?",
      answer:
        "Yes. Micro destination weddings are a growing specialty — intimate gatherings in boutique resorts with personalised experiences, private chef dinners, and curated welcome rituals. Budgets typically start from ₹15 lakhs all-inclusive for a 2-day celebration.",
    },
    {
      question: "What happens if weather disrupts an outdoor destination ceremony?",
      answer:
        "Every Nexyyra destination wedding includes a documented Plan B — indoor backup venues, tenting specifications, and timeline buffers negotiated at contract stage. Our on-ground team monitors forecasts 72 hours ahead and activates contingencies without guest-visible stress.",
    },
  ],
};

export function getServiceFaqs(slug: string): ServiceFaq[] {
  return SERVICE_FAQS[slug] ?? [];
}
