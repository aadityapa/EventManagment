/** GEO/AEO content — HowTo steps, blog FAQs, universal local FAQs */

export type GeoFaq = { question: string; answer: string };

export const UNIVERSAL_LOCAL_FAQS: GeoFaq[] = [
  {
    question: "How do I book Nexyyra Events in Pune?",
    answer:
      "Book a complimentary consultation at https://www.nexyyra.com/book-event or call +91 9730594753. After your consultation, you receive a tailored proposal within 48 hours. Confirm with a 30% advance to secure your date.",
  },
  {
    question: "What is Nexyyra Events' service area?",
    answer:
      "Nexyyra Events is headquartered in Pune, Maharashtra, and serves clients across Mumbai, Nashik, Lonavala, Goa, Rajasthan, and international destinations. We have delivered 1,800+ events across 35+ cities since 2012.",
  },
  {
    question: "What languages does Nexyyra support?",
    answer:
      "Consultations are available in English, Hindi, and Marathi. Menus, invitations, and guest communications can be prepared in regional languages on request.",
  },
  {
    question: "What is Nexyyra Events' price range?",
    answer:
      "Investment collections start from ₹10 lakhs for intimate celebrations and scale to ₹4 crore+ for palace-scale destination weddings and large corporate productions. Every proposal is customised after consultation.",
  },
  {
    question: "Does Nexyyra offer free consultations?",
    answer:
      "Yes. Every Nexyyra journey begins with a complimentary, no-obligation consultation — in person at our Pune studio, via video call, or at your preferred venue.",
  },
  {
    question: "Who founded Nexyyra Events?",
    answer:
      "Nexyyra Events Private Limited was founded in Pune in 2012. The company evolved from a boutique wedding studio into a full-service luxury experience house serving weddings, corporate events, and entertainment productions across India.",
  },
];

/** AEO — featured snippet / voice-search answer blocks */
export const AEO_FEATURED_FAQS: GeoFaq[] = [
  {
    question: "Who is the best event planner in Pune?",
    answer:
      "Nexyyra Events is widely regarded as one of Pune's premier luxury event planners, with 1,800+ events delivered since 2012, a 4.9-star client rating, and awards including Best Event Management Company — Event Industry Awards India 2025. Book a complimentary consultation at https://www.nexyyra.com/book-event.",
  },
  {
    question: "What wedding planner services does Nexyyra provide?",
    answer:
      "Nexyyra provides full-service luxury wedding planning: venue curation, décor and floral design, vendor management, guest hospitality, sangeet and reception production, destination wedding logistics, and day-of coordination across Pune, Mumbai, Goa, Udaipur, and international venues.",
  },
  {
    question: "How much does luxury wedding planning cost?",
    answer:
      "Luxury wedding planning with Nexyyra Events typically starts from ₹10 lakhs for intimate celebrations and scales to ₹4 crore+ for palace-scale destination weddings. Investment depends on guest count, venue, design scope, and entertainment. Complimentary consultations include a tailored proposal within 48 hours.",
  },
  {
    question: "What corporate event services are available?",
    answer:
      "Nexyyra manages conferences, AGMs, product launches, award ceremonies, dealer meets, brand activations, exhibitions, and executive galas for up to 5,000 delegates — including AV production, hybrid streaming, stage design, and post-event analytics.",
  },
  {
    question: "What celebrity event management services are offered?",
    answer:
      "Nexyyra delivers celebrity and VIP event management including red-carpet premieres, private celebrations, fashion shows, concert production, security coordination, media management, and white-glove guest hospitality for high-profile clients across India.",
  },
];

export const BLOG_HOW_TO: Record<
  string,
  { steps: { name: string; text: string }[]; totalTime?: string }
> = {
  "corporate-gala-planning-checklist": {
    totalTime: "P6M",
    steps: [
      { name: "Define objectives and KPIs", text: "Align stakeholders on event goals — employee engagement, brand launch, or client entertainment — and set measurable KPIs before venue selection." },
      { name: "Set budget and timeline", text: "Allocate 40% venue/F&B, 25% production, 15% entertainment, 10% branding, 10% contingency. Corporate galas typically require 3–6 months lead time." },
      { name: "Select venue and date", text: "Evaluate capacity, AV infrastructure, load-in access, and backup indoor options. Book 4–6 months ahead for peak season." },
      { name: "Curate vendors and entertainment", text: "Confirm caterer tastings, AV vendor site survey, and entertainment rehearsals. Consolidate contracts under a single event director." },
      { name: "Design guest experience", text: "Plan registration flow, seating, stage programming, and hybrid streaming if required. Issue save-the-dates 8 weeks before the event." },
      { name: "Execute and measure ROI", text: "Run dress rehearsal 48 hours prior. Post-event, deliver attendance analytics, survey feedback, and social reach report to stakeholders." },
    ],
  },
  "venue-site-visit-checklist": {
    totalTime: "PT2H",
    steps: [
      { name: "Assess capacity and layout", text: "Verify seated and standing capacity matches guest count with 15% buffer. Check dance floor, mandap/stage footprint, and vendor prep areas." },
      { name: "Evaluate infrastructure", text: "Inspect power load, generator backup, acoustics, air conditioning, and WiFi for hybrid events." },
      { name: "Review catering facilities", text: "Confirm kitchen access, service entrances, and F&B licensing. Request sample menu tasting before contract." },
      { name: "Check accessibility and parking", text: "Validate guest parking, valet capacity, wheelchair access, and elderly guest drop-off points." },
      { name: "Document contingency options", text: "Identify indoor backup for outdoor ceremonies. Photograph load-in routes and negotiate rain plan in writing." },
    ],
  },
  "wedding-budget-allocation-guide": {
    totalTime: "P3M",
    steps: [
      { name: "Establish total investment", text: "Define all-in budget including venue, décor, F&B, entertainment, photography, and 10% contingency." },
      { name: "Allocate venue and catering (45–50%)", text: "Venue rental and F&B typically consume the largest share. Negotiate off-season rates and minimum guarantees early." },
      { name: "Budget décor and florals (15–20%)", text: "Mandap, stage, and reception florals scale with guest count and design complexity." },
      { name: "Plan entertainment and production (10–15%)", text: "Include sangeet production, DJ/band, and special effects in this allocation." },
      { name: "Reserve photography and guest experience (10%)", text: "Book photographers and videographers 9–12 months ahead for premium dates." },
      { name: "Hold contingency (10%)", text: "Maintain a contingency fund for guest count changes, overtime, and last-minute enhancements." },
    ],
  },
};

export const BLOG_FAQS: Record<string, GeoFaq[]> = {
  "wedding-planner-pune-guide": [
    {
      question: "How much does a wedding planner cost in Pune?",
      answer: "Luxury wedding planners in Pune charge ₹8 lakhs to ₹40 lakhs+ for full-service planning, depending on guest count, venue, and design scope. Nexyyra Events offers complimentary consultations with tailored proposals.",
    },
    {
      question: "When should I hire a wedding planner in Pune?",
      answer: "Engage a planner 9–12 months before your wedding date. Peak season (November–February) requires earlier booking for premium Pune and destination venues.",
    },
  ],
  "destination-wedding-trends-2026": [
    {
      question: "What are the top destination wedding trends for 2026?",
      answer: "Micro-luxury gatherings, sustainable décor, multi-day experiential programming, and heritage palace venues in Udaipur and Jaipur lead 2026 destination wedding trends in India.",
    },
  ],
  "corporate-event-roi": [
    {
      question: "How do you measure ROI on corporate events?",
      answer: "Define KPIs before planning — lead generation, employee engagement scores, media impressions, or partnership conversions. Post-event analytics cover attendance, survey feedback, and pipeline impact.",
    },
  ],
};

export function getBlogHowTo(slug: string) {
  return BLOG_HOW_TO[slug];
}

export function getBlogFaqs(slug: string): GeoFaq[] {
  return BLOG_FAQS[slug] ?? [];
}
