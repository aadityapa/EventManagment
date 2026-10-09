import { blogWordCount, getBlogArticleContent } from "@/data/blog-content";
import { EVENT_IMAGES } from "@/lib/images";

/**
 * The house in facts only (V6 honesty rules): the 2026 incorporation, what it
 * plans, in-house design + production. No founder story, no track record, no
 * statistics. Languages and cities come from ENTITY_FACTS where rendered.
 */
export const companyProfile = {
  /** /about cover lead. */
  introduction:
    "Weddings, corporate events and celebrations, planned and produced in-house from Pune for venues across India and abroad. One event director stays with you from the first brief to the last guest home.",
  /** The incorporation fact — first paragraph of the /about essay. */
  story:
    "Nexyyra Events is the trade name of Nexyyra Events and Promotions Private Limited, a private limited company incorporated in India in 2026. Its registered office is in Telhara, Maharashtra; planning and delivery are coordinated from Pune.",
  /** What the company plans. */
  scope:
    "The company plans weddings and destination weddings, corporate events and conferences, product launches, exhibitions and brand activations, milestone birthdays, fashion shows, concerts and celebrity appearances. Each begins with a free consultation and an itemised proposal, so every line is visible before you commit.",
  /** In-house design + production. */
  inHouse:
    "Design and production are handled in-house. The planners who shape the concept also schedule the décor, staging, lighting and sound, and run the day itself, so the brief never passes between agencies.",
  vision:
    "Celebrations that feel personal, look considered and run calmly, wherever in India they are held.",
  mission:
    "To turn each brief into a clear, itemised plan, then design and produce it in-house with one event director answerable for every detail.",
  philosophy:
    "Intention over excess. Every element earns its place, and every cost is shown line by line before you commit.",
};

export const services = [
  // V6: capability copy only (no track record). `narrative` is the /services/[slug] "The brief" essay;
  // `featureNotes[i]` is the one-line description of `features[i]` in "What's included".
  {
    slug: "corporate-events",
    title: "Corporate Events",
    description: "Annual days, award nights, offsites and client evenings — planned around your agenda and produced by one in-house team.",
    narrative:
      "A corporate event carries two briefs at once: the programme on paper and the impression your guests take home. We plan both. One event director owns the run of show, the venue, the vendors and the stage, so your team can host rather than troubleshoot. Formats range from an intimate board dinner to a company-wide annual day, in Pune, across India or abroad.",
    image: EVENT_IMAGES.corporate,
    features: ["Conference Planning", "Annual Day Events", "Team Building", "Award Ceremonies"],
    featureNotes: [
      "Agenda, speaker schedule, registration desk and breakout rooms planned as one timeline.",
      "Programme, stage, rehearsals and hospitality for a company-wide celebration.",
      "Facilitated formats chosen for your group, your venue and what the day should achieve.",
      "Nomination flow, stage cues, trophies and seating handled down to the walk-up music.",
    ],
    basePrice: 500000,
  },
  {
    slug: "wedding-planning",
    title: "Wedding Planning",
    description: "Full-service wedding planning from Pune — venue scouting, vendor curation, design direction and on-ground coordination for every function.",
    narrative:
      "A wedding is several events in one week: haldi, mehendi, sangeet, the ceremony and the reception, each with its own mood, guest list and timing. We plan them as one story. Your event director builds the timeline, shortlists venues and vendors, sets the design direction and runs every function on the day, in English, Hindi or Marathi.",
    image: EVENT_IMAGES.wedding,
    features: ["Full Planning", "Day-of Coordination", "Vendor Management", "Custom Design"],
    featureNotes: [
      "From the first consultation to the farewell brunch: venues, vendors, design, budget and timeline.",
      "For couples who have booked their vendors: we take over the timeline and run the day.",
      "Shortlists, quotes, contracts and schedules for décor, catering, photography and entertainment.",
      "A design direction for each function — palette, florals, lighting and stage — agreed before anything is booked.",
    ],
    basePrice: 800000,
  },
  {
    slug: "destination-weddings",
    title: "Destination Weddings",
    description: "Destination weddings planned from Pune — palaces, beaches and hill retreats in India and abroad, with guest travel and on-ground coordination.",
    narrative:
      "Distance multiplies every detail. Flights, room blocks, transfers, welcome kits and local permissions all have to land before the first function does. We plan the destination around your guests: venues that suit the guest count and the season, a travel plan for every arrival, and the whole team on site ahead of the first car from the airport.",
    image: EVENT_IMAGES.destinationWedding,
    features: ["International Venues", "Guest Logistics", "Legal Assistance", "Cultural Integration"],
    featureNotes: [
      "Venue shortlists abroad, matched to your guest count, season and budget band.",
      "Travel desk, room blocks, airport transfers and a day-by-day itinerary for every guest.",
      "Guidance on permits and marriage paperwork, coordinated with local authorities and your own legal adviser.",
      "Rituals, menus and music planned so your traditions travel well and local customs are respected.",
    ],
    basePrice: 1500000,
  },
  {
    slug: "birthday-events",
    title: "Birthday Events",
    description: "Milestone birthdays, children's parties and surprise celebrations — styled, catered and hosted so you can enjoy the evening.",
    narrative:
      "A birthday should feel personal, not packaged. We start with the person being celebrated: their tastes, their people, the memory you want the night to leave. From there we plan the venue, theme, food, entertainment and the small surprises, then host the evening so you can stay with your guests.",
    image: EVENT_IMAGES.birthday,
    features: ["Theme Parties", "Kids Events", "Milestone Celebrations", "Surprise Planning"],
    featureNotes: [
      "A theme carried through invitations, décor, menu and music, not just the backdrop.",
      "Age-appropriate entertainment, safe layouts and a timeline built around little guests.",
      "Fortieths, sixtieths and anniversaries planned around the guest of honour.",
      "Discreet coordination with family and friends so the reveal lands as planned.",
    ],
    basePrice: 200000,
  },
  {
    slug: "product-launches",
    title: "Product Launches",
    description: "Launch events built around the reveal — staging, media, guest list and live stream planned to one cue sheet.",
    narrative:
      "A launch has one moment that matters: the reveal. Everything else exists to set it up and to carry it beyond the room. We plan the venue, stage, guest list, media desk and stream around that moment, then rehearse it until the cue lands on time.",
    image: EVENT_IMAGES.productLaunch,
    features: ["Media Management", "Influencer Outreach", "Stage Design", "Live Streaming"],
    featureNotes: [
      "Press invitations, a media desk, interview slots and press kits on the day.",
      "Guest lists and invitations for creators who suit your brand, coordinated with your agency.",
      "Set, screens and lighting designed around the moment the product is revealed.",
      "Multi-camera streaming to your channels, with a tested backup connection.",
    ],
    basePrice: 750000,
  },
  {
    slug: "conferences",
    title: "Conferences",
    description: "Conferences and summits planned end to end — speakers, registration, AV and the evening programme.",
    narrative:
      "A good conference feels easy to attend because its logistics stay out of sight. We plan the agenda flow, speaker travel and briefings, delegate registration, session rooms and AV, then the dinners and networking that make the trip worthwhile. One event director owns the timeline from the first speaker invitation to the closing remarks.",
    image: EVENT_IMAGES.conference,
    features: ["Speaker Management", "Registration", "AV Production", "Networking Events"],
    featureNotes: [
      "Invitations, travel, briefings, green room and on-stage timing for every speaker.",
      "Online sign-up, badges and a quick check-in desk on the day.",
      "Sound, screens, recording and stage management for plenary and breakout sessions.",
      "Dinners, receptions and structured meet-ups between sessions.",
    ],
    basePrice: 600000,
  },
  {
    slug: "exhibitions",
    title: "Exhibitions",
    description: "Exhibition stands and brand pavilions — designed, built and staffed to bring visitors in and turn conversations into leads.",
    narrative:
      "On a busy show floor you have seconds to earn a visit. We design the stand around what a visitor should see, touch and remember, then manage fabrication, organiser approvals, build, staffing and dismantling. You arrive to a finished stand and leave with a list of the people you met.",
    image: EVENT_IMAGES.exhibition,
    features: ["Booth Design", "Floor Planning", "Lead Capture", "Setup & Teardown"],
    featureNotes: [
      "Stand layout, graphics and lighting designed for sightlines from the aisle.",
      "Visitor flow, demo zones and meeting space planned within the organiser's rules.",
      "Simple systems for recording visitor details, ready for your sales team.",
      "Fabrication, delivery, build and dismantling scheduled around the venue's move-in and move-out windows.",
    ],
    basePrice: 400000,
  },
  {
    slug: "concert-management",
    title: "Concert Management",
    description: "Live music events planned end to end — artist coordination, staging, sound, ticketing and crowd safety.",
    narrative:
      "Live music runs on timing and safety. We coordinate with artist management on riders and schedules, plan the stage, sound and lighting with production crews, set up ticketing and entry, and agree a crowd and safety plan with the venue and local authorities. Scale follows your brief, from a private performance to an open-air show.",
    image: EVENT_IMAGES.concert,
    features: ["Artist Management", "Stage Production", "Ticketing", "Security"],
    featureNotes: [
      "Bookings through artists' official management, with riders, travel and green rooms handled.",
      "Stage, sound and lighting designed and run with experienced production crews.",
      "Ticketing partner set-up, guest lists and entry gates planned for a smooth arrival.",
      "Crowd-management and security plans agreed with the venue and local authorities.",
    ],
    basePrice: 2000000,
  },
  {
    slug: "celebrity-management",
    title: "Celebrity Management",
    description: "Celebrity appearances and VIP guests — approached through official channels, with hospitality, security and media handled.",
    narrative:
      "Inviting a well-known name means working to their schedule, contract and comfort. We approach artists and personalities through their official management, agree the brief, and plan travel, security, hospitality and media moments so the appearance runs to time. Availability and fees are confirmed in writing before anything is promised to you or your guests.",
    image: EVENT_IMAGES.celebrity,
    features: ["Celebrity Booking", "Red Carpet", "Media Coordination", "VIP Handling"],
    featureNotes: [
      "Enquiries through official management, subject to availability, fees and contract.",
      "Arrivals, step-and-repeat, photographers and timing planned for a calm walk-in.",
      "Press lists, interview windows and approvals agreed with the talent's team.",
      "Transfers, green rooms, security and hosting for your most important guests.",
    ],
    basePrice: 1000000,
  },
  {
    slug: "brand-promotions",
    title: "Brand Promotions",
    description: "Brand activations, pop-ups and sampling campaigns — designed to put your product in people's hands and give them a reason to share it.",
    narrative:
      "An activation works when people choose to stop. We find the right location, design an experience worth stopping for, staff it with a briefed team and plan the content that carries it online. Permissions, logistics and reporting are part of the plan from the first meeting.",
    image: EVENT_IMAGES.brandPromotion,
    features: ["Activations", "Pop-up Events", "Sampling Campaigns", "Social Media"],
    featureNotes: [
      "Hands-on brand experiences in malls, campuses, offices and public spaces.",
      "Short-run spaces designed, built, staffed and cleared within your window.",
      "Sampling routes, staffing and stock planning, with daily reporting.",
      "Shareable moments and on-site content planned with your social team.",
    ],
    basePrice: 350000,
  },
  {
    slug: "fashion-shows",
    title: "Fashion Shows",
    description: "Runway shows and designer presentations — set, light, music and backstage run to a tight show call.",
    narrative:
      "A runway show lasts minutes and takes weeks. We design the set and lighting around the collection, schedule models with your styling team, run fittings and rehearsals, and manage a backstage that keeps every look on time. Front-row seating, guest arrival and press are planned alongside.",
    image: EVENT_IMAGES.fashionShow,
    features: ["Runway Design", "Model Coordination", "Backstage Management", "Press Events"],
    featureNotes: [
      "Runway, set and lighting designed to show the collection true to colour.",
      "Casting support, fittings and call times managed with your styling team.",
      "Dressers, hair and make-up, line-up and cue calling behind the curtain.",
      "Front-row seating, press access and post-show interviews arranged.",
    ],
    basePrice: 900000,
  },
  {
    slug: "event-production",
    title: "Event Production",
    description: "Technical production for any event — staging, lighting, sound, screens and effects, designed and run by one production team.",
    narrative:
      "Production is what guests feel without noticing: the light that finds the stage, sound that reaches the back row, a cue that lands on time. We design staging, lighting, sound and screens for your venue, schedule load-in and rehearsals, and call the show on the day. Book it with full planning, or on its own for an event you are already running.",
    image: EVENT_IMAGES.concert,
    features: ["Stage Design", "Lighting", "Sound Engineering", "Special Effects"],
    featureNotes: [
      "Stages, sets and backdrops drawn to scale for your venue and its sightlines.",
      "Lighting designed for mood, faces and photography, programmed before doors open.",
      "Speaker plans, microphones and mixing tuned to the room.",
      "Cold pyro, haze and confetti cues, used where the venue allows them.",
    ],
    basePrice: 500000,
  },
];

export { GLITZ_FAQS as faqs } from "@/brand/data/faq";

const BLOG_POSTS = [
  { slug: "destination-wedding-trends-2026", title: "Top Destination Wedding Trends for 2026", excerpt: "Discover the hottest destination wedding trends shaping luxury celebrations this year.", image: EVENT_IMAGES.destinationWedding, author: "Nexyyra Events", tags: ["Destination", "Trends", "Luxury"], category: "Destination Weddings", publishedAt: "2026-05-15" },
  { slug: "corporate-event-roi", title: "Maximizing ROI on Corporate Events", excerpt: "Learn how to measure and maximize return on investment for your corporate events.", image: EVENT_IMAGES.corporate, author: "Nexyyra Events", tags: ["Corporate", "ROI", "Strategy"], category: "Event Budgeting", publishedAt: "2026-05-08" },
  { slug: "sustainable-events-guide", title: "A Guide to Sustainable Events", excerpt: "How to plan eco-friendly events without compromising on luxury and experience.", image: EVENT_IMAGES.conference, author: "Nexyyra Events", tags: ["Sustainability", "Trends"], category: "Event Trends", publishedAt: "2026-05-01" },
  { slug: "wedding-planner-pune-guide", title: "How to Choose a Wedding Planner in Pune", excerpt: "How to select the right luxury wedding planner in Pune — questions to ask, red flags, and what premium service looks like.", image: EVENT_IMAGES.wedding, author: "Nexyyra Events", tags: ["Weddings", "Pune", "Guide"], category: "Wedding Planning", publishedAt: "2026-04-24" },
  { slug: "corporate-gala-planning-checklist", title: "Corporate Gala Planning Checklist for 2026", excerpt: "Step-by-step checklist for planning a well-run corporate gala — from venue selection to post-event analytics.", image: EVENT_IMAGES.corporate, author: "Nexyyra Events", tags: ["Corporate", "Checklist", "Gala"], category: "Corporate Events", publishedAt: "2026-04-17" },
  { slug: "exhibition-booth-design-tips", title: "Exhibition Booth Design Tips That Convert", excerpt: "Trade show booth design strategies that attract footfall, capture leads, and maximise ROI at Pune exhibitions.", image: EVENT_IMAGES.exhibition, author: "Nexyyra Events", tags: ["Exhibitions", "Design", "Corporate"], category: "Corporate Events", publishedAt: "2026-04-10" },
  { slug: "luxury-birthday-celebration-ideas", title: "Luxury Birthday Celebration Ideas in Maharashtra", excerpt: "Milestone birthday party concepts — from intimate dinner soirées to themed extravaganzas with celebrity entertainment.", image: EVENT_IMAGES.birthday, author: "Nexyyra Events", tags: ["Celebrations", "Luxury", "Pune"], category: "Event Trends", publishedAt: "2026-04-03" },
  { slug: "concert-production-pune", title: "Concert Production in Pune: What Goes Into a Stadium Show", excerpt: "Behind the scenes of large-scale concert management — artist logistics, stage design, security, and crowd flow.", image: EVENT_IMAGES.concert, author: "Nexyyra Events", tags: ["Concerts", "Production", "Pune"], category: "Event Trends", publishedAt: "2026-03-27" },
  { slug: "mandap-decor-trends-luxury-weddings", title: "Mandap Décor Trends for Luxury Weddings in 2026", excerpt: "Floral architecture, sustainable materials, and heritage motifs shaping the ceremony space at premium Indian weddings.", image: EVENT_IMAGES.wedding, author: "Nexyyra Events", tags: ["Weddings", "Décor", "Trends"], category: "Wedding Planning", publishedAt: "2026-03-20" },
  { slug: "wedding-budget-allocation-guide", title: "Luxury Wedding Budget Allocation Guide", excerpt: "Percentage-based framework for allocating venue, décor, entertainment, and contingency funds on Pune and destination weddings.", image: EVENT_IMAGES.wedding, author: "Nexyyra Events", tags: ["Budget", "Weddings", "Planning"], category: "Event Budgeting", publishedAt: "2026-03-13" },
  { slug: "udaipur-palace-wedding-guide", title: "Udaipur Palace Wedding Planning Guide", excerpt: "The essentials of heritage palace celebrations — venues, guest logistics, and regulatory requirements.", image: EVENT_IMAGES.destinationWedding, author: "Nexyyra Events", tags: ["Destination", "Udaipur", "Palace"], category: "Destination Weddings", publishedAt: "2026-03-06" },
  { slug: "pune-luxury-venues-guide", title: "Pune Luxury Venues Guide for Weddings & Galas", excerpt: "Ballrooms, garden estates, and boutique properties — matched to guest count, season, and celebration style.", image: EVENT_IMAGES.venue1, author: "Nexyyra Events", tags: ["Venues", "Pune", "Luxury"], category: "Venue Selection", publishedAt: "2026-02-27" },
  { slug: "sangeet-night-planning-guide", title: "Sangeet Night Planning — Choreography to Production", excerpt: "Stage design, rehearsal timelines, and run-of-show templates for the most energetic night of your wedding.", image: EVENT_IMAGES.wedding, author: "Nexyyra Events", tags: ["Sangeet", "Weddings", "Entertainment"], category: "Wedding Planning", publishedAt: "2026-02-20" },
  { slug: "hidden-event-expenses-corporate", title: "Hidden Event Expenses Every Corporate Planner Should Budget For", excerpt: "Overtime penalties, AV scope creep, and vendor travel — the line items that erode ROI when omitted from proposals.", image: EVENT_IMAGES.corporate, author: "Nexyyra Events", tags: ["Budget", "Corporate", "Planning"], category: "Event Budgeting", publishedAt: "2026-02-13" },
  { slug: "annual-day-corporate-planning", title: "Annual Day Corporate Event Planning Guide", excerpt: "Programming balance, employee engagement, and hybrid formats for company celebrations of 500 to 2,000 attendees.", image: EVENT_IMAGES.corporate, author: "Nexyyra Events", tags: ["Corporate", "Annual Day", "Culture"], category: "Corporate Events", publishedAt: "2026-02-06" },
  { slug: "goa-beach-wedding-guide", title: "Goa Beach Wedding Planning Guide", excerpt: "Permits, weather backup, and guest experiences for coastal destination celebrations in North and South Goa.", image: EVENT_IMAGES.destinationWedding, author: "Nexyyra Events", tags: ["Destination", "Goa", "Beach"], category: "Destination Weddings", publishedAt: "2026-01-30" },
  { slug: "venue-site-visit-checklist", title: "Luxury Venue Site Visit Checklist", excerpt: "Infrastructure, acoustics, catering, and contingency evaluation criteria for wedding and corporate venue selection.", image: EVENT_IMAGES.venue2, author: "Nexyyra Events", tags: ["Venues", "Checklist", "Planning"], category: "Venue Selection", publishedAt: "2026-01-23" },
  { slug: "immersive-event-technology-2026", title: "Immersive Event Technology Trends for 2026", excerpt: "Projection mapping, AI personalisation, and sustainable tech choices reshaping luxury production in India.", image: EVENT_IMAGES.concert, author: "Nexyyra Events", tags: ["Technology", "Trends", "Production"], category: "Event Trends", publishedAt: "2026-01-16" },
  { slug: "vendor-coordination-wedding-tips", title: "Wedding Vendor Coordination Tips from Nexyyra Planners", excerpt: "Master timelines, single-point communication, and quality checkpoints that prevent event-week chaos.", image: EVENT_IMAGES.wedding, author: "Nexyyra Events", tags: ["Weddings", "Vendors", "Planning"], category: "Wedding Planning", publishedAt: "2026-01-09" },
  { slug: "corporate-gala-etiquette-guide", title: "Corporate Gala Etiquette & Hosting Standards", excerpt: "Hosting protocols for leadership guests — registration, seating strategy, award presentations, and entertainment alignment.", image: EVENT_IMAGES.corporate, author: "Nexyyra Events", tags: ["Corporate", "Gala", "Etiquette"], category: "Corporate Events", publishedAt: "2026-01-02" },
];

/* Read time comes from the article body itself (blog-content.ts) at 220 words
   a minute, never a hand-typed figure: minimum 2 min. */
const READ_WPM = 220;
function blogReadTime(slug: string): string {
  const content = getBlogArticleContent(slug);
  const words = content ? blogWordCount(content) : 0;
  return `${Math.max(2, Math.ceil(words / READ_WPM))} min`;
}

export const blogPosts = BLOG_POSTS.map((post) => ({ ...post, readTime: blogReadTime(post.slug) }));

