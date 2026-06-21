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
  "birthday-events": [
    {
      question: "What types of birthday events does Nexyyra plan in Pune?",
      answer:
        "We design milestone birthday celebrations, themed kids parties, surprise soirées, and luxury adult milestone events for 30 to 500 guests across Pune and Maharashtra.",
    },
    {
      question: "How much does a luxury birthday party cost with Nexyyra?",
      answer:
        "Birthday event packages start from ₹2 lakhs for intimate themed parties and scale to ₹25 lakhs+ for celebrity entertainment and bespoke venue transformations.",
    },
    {
      question: "Can Nexyyra plan surprise birthday celebrations?",
      answer:
        "Yes. Our surprise planning protocol includes covert venue access, decoy invitations, entertainment coordination, and a dedicated secrecy liaison to protect the reveal moment.",
    },
    {
      question: "What entertainment options are available for birthday events?",
      answer:
        "Options include live bands, DJs, celebrity appearances, interactive installations, photo booths, firework finales, and themed performers matched to guest demographics.",
    },
    {
      question: "How far in advance should I book a birthday event planner?",
      answer:
        "Book 2–4 months ahead for milestone celebrations. Premium dates and celebrity entertainment require 3–6 months lead time.",
    },
  ],
  "product-launches": [
    {
      question: "What does Nexyyra's product launch service include?",
      answer:
        "Full launch production: venue selection, stage and holographic design, media and influencer coordination, live streaming, registration, and post-launch analytics reporting.",
    },
    {
      question: "How much does a product launch event cost in India?",
      answer:
        "Product launch packages start from ₹7.5 lakhs for 200–300 guest immersive experiences and scale to ₹50 lakhs+ for national media events with celebrity endorsements.",
    },
    {
      question: "Can Nexyyra manage media and influencer outreach for launches?",
      answer:
        "Yes. We coordinate press kits, influencer seeding, red carpet management, and social amplification — our launches have generated 50M+ social impressions for leading brands.",
    },
    {
      question: "Do you offer hybrid product launch formats?",
      answer:
        "We produce hybrid launches with professional live streaming, remote demo integration, and interactive Q&A for press and partners joining virtually.",
    },
    {
      question: "What is the typical timeline for a product launch?",
      answer:
        "Standard launches require 6–8 weeks. Complex national launches with custom staging need 3–4 months from brief to execution.",
    },
  ],
  conferences: [
    {
      question: "What conference sizes can Nexyyra manage?",
      answer:
        "We manage conferences from 50-person leadership retreats to 5,000-delegate summits with multi-track programming, speaker management, and exhibition zones.",
    },
    {
      question: "Does Nexyyra handle conference registration and badges?",
      answer:
        "Yes. We provide registration platforms, badge printing, check-in kiosks, session tracking, and real-time attendance dashboards for organisers.",
    },
    {
      question: "What AV production is included in conference management?",
      answer:
        "Full AV scope: stage design, lighting, sound, LED walls, translation booths, session recording, and dedicated technical directors on-site.",
    },
    {
      question: "How much does conference management cost in Pune?",
      answer:
        "Conference packages start from ₹6 lakhs for single-day events and scale based on delegate count, venue tier, and production complexity.",
    },
    {
      question: "Can Nexyyra manage multi-day conferences?",
      answer:
        "Yes. We orchestrate multi-day summits including accommodation blocks, gala dinners, networking sessions, and speaker hospitality across consecutive days.",
    },
  ],
  exhibitions: [
    {
      question: "What exhibition services does Nexyyra provide in Pune?",
      answer:
        "End-to-end exhibition management: custom booth and pavilion design, floor planning, lead capture systems, setup/teardown, and on-site brand ambassadors.",
    },
    {
      question: "How much does exhibition booth design cost?",
      answer:
        "Custom booth design and build starts from ₹4 lakhs for standard 3×3 metre stalls and scales to ₹30 lakhs+ for island pavilions with interactive technology.",
    },
    {
      question: "Can Nexyyra manage trade show logistics?",
      answer:
        "Yes. We handle freight coordination, on-site assembly, electrical compliance, storage, and post-show dismantling for Pune and national trade fairs.",
    },
    {
      question: "Do you provide lead capture for exhibitions?",
      answer:
        "We integrate QR-based lead capture, CRM export, and real-time footfall analytics so your sales team follows up within 24 hours of the show.",
    },
    {
      question: "Which Pune exhibitions does Nexyyra serve?",
      answer:
        "We serve Auto Expo Pune, IT and pharma trade shows, and brand activations at major convention centres across Maharashtra.",
    },
  ],
  "concert-management": [
    {
      question: "What scale of concerts does Nexyyra produce?",
      answer:
        "From intimate 500-capacity gigs to 10,000+ stadium shows — including artist logistics, stage production, ticketing integration, security, and crowd management.",
    },
    {
      question: "How much does concert production cost in India?",
      answer:
        "Concert management packages start from ₹20 lakhs for club-scale shows and exceed ₹2 crore for multi-artist festival productions with full staging.",
    },
    {
      question: "Does Nexyyra handle artist booking and contracts?",
      answer:
        "Yes. We manage artist booking, rider fulfilment, hospitality, sound check scheduling, and performance contracts through our entertainment division.",
    },
    {
      question: "What safety measures are included in concert management?",
      answer:
        "Comprehensive crowd control, medical standby, fire safety compliance, structural engineering for staging, and emergency evacuation plans approved by local authorities.",
    },
    {
      question: "Can Nexyyra live stream concerts?",
      answer:
        "Yes. Multi-camera live streaming, IMAG screens, and social broadcast integration for hybrid audience reach.",
    },
  ],
  "celebrity-management": [
    {
      question: "What celebrity event services does Nexyyra offer?",
      answer:
        "Celebrity booking, red carpet production, VIP guest handling, media coordination, security detail liaison, and backstage hospitality for brand and private events.",
    },
    {
      question: "How does Nexyyra book celebrities for events?",
      answer:
        "We maintain relationships with talent agencies across Bollywood, sports, and music. Booking includes contract negotiation, rider management, and appearance scheduling.",
    },
    {
      question: "What is the cost of celebrity appearances at events?",
      answer:
        "Celebrity management packages start from ₹10 lakhs excluding talent fees. Talent fees vary by celebrity tier — we provide transparent quotes after understanding your brief.",
    },
    {
      question: "Can Nexyyra manage media at celebrity events?",
      answer:
        "Yes. Press accreditation, photo-op zones, interview scheduling, and social media amplification are managed by our dedicated media relations team.",
    },
    {
      question: "Is confidentiality guaranteed for celebrity events?",
      answer:
        "All celebrity events operate under strict NDAs. Guest lists, locations, and talent details are protected throughout planning and execution.",
    },
  ],
  "brand-promotions": [
    {
      question: "What brand activation formats does Nexyyra create?",
      answer:
        "Pop-up experiences, mall activations, sampling campaigns, roadshows, influencer events, and immersive brand installations across Pune and pan-India markets.",
    },
    {
      question: "How much does a brand activation cost?",
      answer:
        "Brand promotion packages start from ₹3.5 lakhs for single-city activations and scale to ₹50 lakhs+ for multi-city experiential campaigns.",
    },
    {
      question: "Does Nexyyra measure brand activation ROI?",
      answer:
        "Yes. We track footfall, sampling conversions, social engagement, lead capture, and post-campaign analytics against your marketing KPIs.",
    },
    {
      question: "Can Nexyyra integrate social media into activations?",
      answer:
        "We design Instagrammable moments, influencer seeding, live social coverage, and hashtag campaigns as core activation elements.",
    },
    {
      question: "What industries does Nexyyra serve for brand promotions?",
      answer:
        "FMCG, automotive, pharma, fashion, technology, and financial services — with activations tailored to each brand's audience and compliance requirements.",
    },
  ],
  "fashion-shows": [
    {
      question: "What fashion show production services does Nexyyra offer?",
      answer:
        "Runway design, model casting and coordination, backstage management, lighting and music direction, press events, and front-row guest management.",
    },
    {
      question: "How much does a fashion show cost in India?",
      answer:
        "Fashion show production starts from ₹9 lakhs for emerging designer showcases and exceeds ₹1 crore for fashion week finale productions.",
    },
    {
      question: "Can Nexyyra manage fashion week runway shows?",
      answer:
        "Yes. We have produced fashion week finales for 500+ guest runway shows with celebrity front row, media pits, and live streaming.",
    },
    {
      question: "Does Nexyyra handle model and designer logistics?",
      answer:
        "Full backstage operations: fitting schedules, hair and makeup stations, quick-change teams, and designer liaison throughout rehearsal and show.",
    },
    {
      question: "What venues work best for fashion shows in Pune?",
      answer:
        "Heritage properties, hotel ballrooms, and custom-built runway structures in IT parks — selected based on collection aesthetic and guest capacity.",
    },
  ],
  "event-production": [
    {
      question: "What technical production does Nexyyra Events provide?",
      answer:
        "Stage design, lighting design, sound engineering, LED walls, special effects, rigging, and power distribution for weddings, concerts, and corporate productions.",
    },
    {
      question: "How much does event production cost?",
      answer:
        "Technical production packages start from ₹5 lakhs for single-stage events and scale based on venue size, effect complexity, and crew requirements.",
    },
    {
      question: "Does Nexyyra provide production for outdoor events?",
      answer:
        "Yes. Weather-rated staging, generator power, tenting specifications, and backup plans for outdoor weddings, concerts, and corporate events.",
    },
    {
      question: "Can Nexyyra integrate special effects into events?",
      answer:
        "Cold pyro, confetti cannons, laser shows, drone displays, and projection mapping — engineered with safety compliance and venue approval.",
    },
    {
      question: "Do you offer production-only services without full planning?",
      answer:
        "Yes. Production-only engagements are available for clients with existing planners who need Nexyyra's technical direction and on-ground crew.",
    },
  ],
};

const GENERIC_SERVICE_FAQS: ServiceFaq[] = [
  {
    question: "How do I book this service with Nexyyra Events?",
    answer:
      "Book a complimentary consultation at https://nexyyra.com/book-event or call +91 9730594753. You receive a tailored proposal within 48 hours.",
  },
  {
    question: "What areas does Nexyyra serve for this service?",
    answer:
      "Nexyyra Events serves Pune, Mumbai, Maharashtra, and destinations across India and internationally from our Pune headquarters.",
  },
  {
    question: "What is included in Nexyyra's planning process?",
    answer:
      "Every engagement includes a dedicated coordinator, vendor curation, timeline management, design direction, and on-ground execution command.",
  },
  {
    question: "What payment terms does Nexyyra offer?",
    answer:
      "A 30% advance secures your date. Remaining payments follow milestone invoices aligned to vendor commitments via Razorpay, bank transfer, or UPI.",
  },
  {
    question: "Does Nexyyra offer free consultations?",
    answer:
      "Yes. Every service begins with a complimentary, no-obligation consultation — in person, via video, or at your venue.",
  },
];

export function getServiceFaqs(slug: string): ServiceFaq[] {
  return SERVICE_FAQS[slug]?.length ? SERVICE_FAQS[slug] : GENERIC_SERVICE_FAQS;
}
