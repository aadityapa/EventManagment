/**
 * Per-service FAQ blocks for GEO / AI search — keyed by service slug.
 * Honesty pass (V6): answers describe capability and process only. No named
 * venues, events or partners, no track record, no figures beyond the
 * published starting prices (`services[].basePrice` in cms.ts).
 */
export type ServiceFaq = { question: string; answer: string };

export const SERVICE_FAQS: Record<string, ServiceFaq[]> = {
  "wedding-planning": [
    {
      question: "How far in advance should we book a wedding planner in Pune?",
      answer:
        "For weddings of 200 guests or more, start 9–12 months before your date. Peak season (November–February) fills early at hill-station resorts, lakeside venues and city hotels alike. Shorter timelines can work for intimate celebrations — ask, and we will tell you plainly what is achievable.",
    },
    {
      question: "What does full wedding planning with Nexyyra include?",
      answer:
        "Venue shortlisting, vendor selection and contracts (florists, caterers, photographers, entertainment), design and décor direction, a single run-of-show, rehearsals, and on-ground management of every function. One event director is your single point of contact from the first consultation to the farewell brunch.",
    },
    {
      question: "Can Nexyyra manage multi-day Maharashtrian wedding functions?",
      answer:
        "Yes. Haldi, mehendi, sangeet, wedding and reception are planned as one schedule, with guest movement between venues and each ritual's customs written into the run-of-show. Menus, invitations and ceremonies can be prepared in Marathi, Hindi or English.",
    },
    {
      question: "How are wedding budgets structured with Nexyyra?",
      answer:
        "After your free consultation you receive an itemised proposal — décor, food and beverage, entertainment, production and our fee each on its own line. A 30% advance secures your date; the balance is invoiced in milestones aligned to vendor commitments.",
    },
    {
      question: "Do you offer day-of coordination only?",
      answer:
        "Yes. If you have booked most vendors yourself, we review your timeline, brief your vendors, run the day and handle contingencies, without the full planning scope.",
    },
  ],
  "corporate-events": [
    {
      question: "What types of corporate events does Nexyyra manage in Pune?",
      answer:
        "Annual days, product launches, investor meets, award nights, team offsites, dealer meets and black-tie galas, from 50 guests to several thousand. Events can be planned in Pune, across Maharashtra and in other Indian cities.",
    },
    {
      question: "How do you measure the outcome of a corporate event?",
      answer:
        "We agree the goals with you before planning starts — attendance, engagement, leads or media coverage. After the event you receive a post-event debrief and a media hand-over: attendance records, feedback you choose to collect, and the photos and films.",
    },
    {
      question: "Can Nexyyra handle hybrid and virtual corporate formats?",
      answer:
        "Yes. We produce hybrid conferences with live streaming, remote speakers and moderated Q&A. A technical director runs AV, staging and the stream so the room and remote audiences follow one programme.",
    },
    {
      question: "What is the typical timeline for a corporate gala?",
      answer:
        "Corporate galas usually need 3–6 months from brief to event. Product launches can work in 6–8 weeks, depending on venue and vendor availability. You receive a planning checklist covering venue, catering, entertainment and branding at kickoff.",
    },
    {
      question: "Do you manage vendor contracts and compliance for corporate clients?",
      answer:
        "Yes. We handle vendor agreements, venue and fire-safety permissions, and GST invoicing. Corporate clients receive consolidated billing and documentation for procurement and audit review.",
    },
  ],
  "destination-weddings": [
    {
      question: "Which destination wedding locations does Nexyyra plan?",
      answer:
        "Destinations across India — palace and heritage venues in Udaipur and Jaipur, beachfront resorts in Goa, hill-station resorts and lakeside venues — and international destinations on request. Every venue is shortlisted for your guest count, budget and dates.",
    },
    {
      question: "How does Nexyyra manage guest travel and accommodation?",
      answer:
        "We coordinate room blocks, airport transfers, welcome kits and shuttles between venues. Guests receive a shared itinerary with timings, dress codes and RSVP details, and a hospitality desk on site.",
    },
    {
      question: "What legal requirements apply to destination weddings in India?",
      answer:
        "Requirements vary by state and venue type. We check marriage registration steps, beach and outdoor permits, and heritage-property rules for your chosen venue, and set the paperwork timeline with you early.",
    },
    {
      question: "Can you plan micro destination weddings under 50 guests?",
      answer:
        "Yes. Intimate destination weddings at smaller resorts, with private dinners and personal welcome rituals. Destination wedding planning starts from ₹15 Lakhs, and your proposal prices every line for your brief.",
    },
    {
      question: "What happens if weather disrupts an outdoor destination ceremony?",
      answer:
        "Every outdoor ceremony we plan has a documented Plan B — an indoor backup space, tenting specifications and timeline buffers agreed at contract stage. The forecast is checked daily in the run-up, and the weather call is agreed with you in advance.",
    },
  ],
  "birthday-events": [
    {
      question: "What types of birthday events does Nexyyra plan in Pune?",
      answer:
        "Milestone birthdays, themed children's parties, surprise celebrations and adult milestone evenings, from 30 to 500 guests, in Pune and across Maharashtra.",
    },
    {
      question: "How much does a birthday celebration cost with Nexyyra?",
      answer:
        "Birthday events start from ₹2 Lakhs. The final figure depends on guest count, venue, décor and entertainment, and your proposal prices every line.",
    },
    {
      question: "Can Nexyyra plan surprise birthday celebrations?",
      answer:
        "Yes. We plan venue access, invitations and timings so the guest of honour does not find out, with one planner as your contact for the reveal.",
    },
    {
      question: "What entertainment options are available for birthday events?",
      answer:
        "Live bands, DJs, artist performances, interactive installations, photo booths, fireworks where permitted, and themed performers chosen for your guests.",
    },
    {
      question: "How far in advance should I book a birthday event planner?",
      answer:
        "Two to four months ahead for milestone celebrations. Peak dates and booked artists usually need 3–6 months.",
    },
  ],
  "product-launches": [
    {
      question: "What does Nexyyra's product launch service include?",
      answer:
        "Venue selection, stage and reveal design, media and influencer coordination, live streaming, registration, and a post-event debrief and media hand-over.",
    },
    {
      question: "How much does a product launch event cost in India?",
      answer:
        "Product launches start from ₹7.5 Lakhs. Cost scales with guest count, staging and media scope, and your proposal itemises every line.",
    },
    {
      question: "Can Nexyyra manage media and influencer outreach for launches?",
      answer:
        "Yes. We coordinate press kits, media invitations, influencer invitations, red-carpet arrivals and live social coverage for the launch.",
    },
    {
      question: "Do you offer hybrid product launch formats?",
      answer:
        "Yes. Hybrid launches with live streaming, remote product demos and moderated Q&A for press and partners joining online.",
    },
    {
      question: "What is the typical timeline for a product launch?",
      answer:
        "Standard launches need 6–8 weeks. Launches with custom staging across several cities need 3–4 months from brief to event.",
    },
  ],
  conferences: [
    {
      question: "What conference sizes can Nexyyra manage?",
      answer:
        "Conferences from 50-person leadership retreats to several thousand delegates, with multi-track programming, speaker management and exhibition zones.",
    },
    {
      question: "Does Nexyyra handle conference registration and badges?",
      answer:
        "Yes. Online registration, badge printing, check-in desks and session attendance tracking for organisers.",
    },
    {
      question: "What AV production is included in conference management?",
      answer:
        "Stage design, lighting, sound, LED walls, interpretation booths, session recording and a technical director on site.",
    },
    {
      question: "How much does conference management cost in Pune?",
      answer:
        "Conference management starts from ₹6 Lakhs for a single-day event and scales with delegate count, venue and production scope.",
    },
    {
      question: "Can Nexyyra manage multi-day conferences?",
      answer:
        "Yes. Multi-day summits with accommodation blocks, gala dinners, networking sessions and speaker hospitality, run from one schedule.",
    },
  ],
  exhibitions: [
    {
      question: "What exhibition services does Nexyyra provide in Pune?",
      answer:
        "Booth and pavilion design, floor planning, lead capture, build and dismantle, and on-site brand staff.",
    },
    {
      question: "How much does exhibition booth design cost?",
      answer:
        "Exhibition design and build starts from ₹4 Lakhs and scales with booth size, materials and interactive elements.",
    },
    {
      question: "Can Nexyyra manage trade show logistics?",
      answer:
        "Yes. Freight coordination, on-site assembly, electrical compliance, storage and post-show dismantling, in Pune and other Indian cities.",
    },
    {
      question: "Do you provide lead capture for exhibitions?",
      answer:
        "Yes. QR-based lead capture with an export your sales team can load into its CRM after the show.",
    },
    {
      question: "Which exhibitions can Nexyyra support?",
      answer:
        "Trade shows, industry expos, consumer fairs and brand pavilions at convention centres, hotels and open grounds, in Pune and across India.",
    },
  ],
  "concert-management": [
    {
      question: "What scale of concerts does Nexyyra produce?",
      answer:
        "From intimate club gigs to large open-ground shows — artist logistics, stage production, ticketing integration, security and crowd management.",
    },
    {
      question: "How much does concert production cost in India?",
      answer:
        "Concert management starts from ₹20 Lakhs and scales with capacity, number of artists and staging. Your proposal itemises every line.",
    },
    {
      question: "Does Nexyyra handle artist booking and contracts?",
      answer:
        "Yes. Talent and artist booking coordination, rider fulfilment, hospitality, sound-check scheduling and performance contracts.",
    },
    {
      question: "What safety measures are included in concert management?",
      answer:
        "Crowd-control planning, medical standby, fire-safety compliance, structural checks on staging, and an evacuation plan submitted for local permissions.",
    },
    {
      question: "Can Nexyyra live stream concerts?",
      answer:
        "Yes. Multi-camera live streaming, IMAG screens and social streaming for audiences who cannot attend.",
    },
  ],
  "celebrity-management": [
    {
      question: "What celebrity event services does Nexyyra offer?",
      answer:
        "Talent and artist booking coordination, red-carpet production, VIP guest handling, media coordination, security liaison and backstage hospitality for brand and private events.",
    },
    {
      question: "How does Nexyyra book celebrities for events?",
      answer:
        "We approach the artist's management or agency on your behalf, then handle the contract, rider and appearance schedule once terms are agreed.",
    },
    {
      question: "What is the cost of celebrity appearances at events?",
      answer:
        "Celebrity management starts from ₹10 Lakhs, excluding talent fees. Talent fees are set by the artist's management and quoted to you separately, line by line.",
    },
    {
      question: "Can Nexyyra manage media at celebrity events?",
      answer:
        "Yes. Press accreditation, photo-op zones, interview scheduling and social media coverage are planned into the run-of-show.",
    },
    {
      question: "Is confidentiality guaranteed for celebrity events?",
      answer:
        "Confidentiality terms are written into your agreement. Guest lists, locations and talent details are shared only with the team and vendors who need them.",
    },
  ],
  "brand-promotions": [
    {
      question: "What brand activation formats does Nexyyra create?",
      answer:
        "Pop-up experiences, mall activations, sampling campaigns, roadshows, influencer events and brand installations, in Pune and across India.",
    },
    {
      question: "How much does a brand activation cost?",
      answer:
        "Brand activations start from ₹3.5 Lakhs and scale with the number of cities, days and installations.",
    },
    {
      question: "How do you report on a brand activation?",
      answer:
        "We agree what to measure before launch — footfall, samples handed out, leads or social engagement — and share a post-event debrief and media hand-over afterwards.",
    },
    {
      question: "Can Nexyyra integrate social media into activations?",
      answer:
        "Yes. Photo-friendly installations, influencer invitations, live social coverage and hashtag prompts can be designed into the activation.",
    },
    {
      question: "Which industries can Nexyyra plan brand promotions for?",
      answer:
        "Consumer goods, automotive, pharma, fashion, technology and financial services, among others — each activation is shaped to the brand's audience and compliance rules.",
    },
  ],
  "fashion-shows": [
    {
      question: "What fashion show production services does Nexyyra offer?",
      answer:
        "Runway design, model casting and coordination, backstage management, lighting and music direction, press events and front-row guest management.",
    },
    {
      question: "How much does a fashion show cost in India?",
      answer:
        "Fashion show production starts from ₹9 Lakhs and scales with runway build, cast size and guest count.",
    },
    {
      question: "Can Nexyyra produce a full runway show?",
      answer:
        "Yes. Runway shows with a seated front row, a media pit and a live stream, planned cue by cue with the designer.",
    },
    {
      question: "Does Nexyyra handle model and designer logistics?",
      answer:
        "Yes. Fitting schedules, hair and makeup stations, quick-change teams and designer liaison through rehearsal and show.",
    },
    {
      question: "What venues work for fashion shows in Pune?",
      answer:
        "Heritage properties, hotel ballrooms and custom-built runway structures — chosen for the collection's look and the guest count.",
    },
  ],
  "event-production": [
    {
      question: "What technical production does Nexyyra Events provide?",
      answer:
        "Stage design, lighting design, sound, LED walls, special effects, rigging and power distribution for weddings, concerts and corporate events.",
    },
    {
      question: "How much does event production cost?",
      answer:
        "Technical production starts from ₹5 Lakhs and scales with venue size, effects and crew.",
    },
    {
      question: "Does Nexyyra provide production for outdoor events?",
      answer:
        "Yes. Weather-rated staging, generator power, tenting specifications and a backup plan for outdoor weddings, concerts and corporate events.",
    },
    {
      question: "Can Nexyyra integrate special effects into events?",
      answer:
        "Cold pyro, confetti cannons, laser shows, projection mapping and drone displays where permitted — each cleared with the venue and the required safety approvals.",
    },
    {
      question: "Do you offer production-only services without full planning?",
      answer:
        "Yes. Production can be booked on its own if you already have a planner and need technical direction and an on-ground crew.",
    },
  ],
};

const GENERIC_SERVICE_FAQS: ServiceFaq[] = [
  {
    question: "How do I book this service with Nexyyra Events?",
    answer:
      "Book a free consultation at https://www.nexyyra.com/book-event or call +91 7020640157. Your itemised proposal follows within 48 hours of the consultation.",
  },
  {
    question: "What areas does Nexyyra serve for this service?",
    answer:
      "Pune, Mumbai, Delhi, Bangalore, Hyderabad, Jaipur, Indore, Nashik, Nagpur, Ahmedabad, Surat, Goa and Udaipur, other cities across India, and international destinations on request — coordinated from our Delivery & Coordination Office in Pune.",
  },
  {
    question: "What is included in Nexyyra's planning process?",
    answer:
      "Every engagement has one dedicated event director, vendor selection and contracts, timeline management, design direction and on-ground management on the day.",
  },
  {
    question: "What payment terms does Nexyyra offer?",
    answer:
      "A 30% advance secures your date. The balance is invoiced in milestones aligned to vendor commitments, payable by Razorpay, bank transfer or UPI.",
  },
  {
    question: "Does Nexyyra offer free consultations?",
    answer:
      "Yes. Every service begins with a free, no-obligation consultation — in person, on video or at your venue.",
  },
];

export function getServiceFaqs(slug: string): ServiceFaq[] {
  return SERVICE_FAQS[slug]?.length ? SERVICE_FAQS[slug] : GENERIC_SERVICE_FAQS;
}
