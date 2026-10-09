/**
 * Article bodies for /blog/[slug], keyed by the post slug in `blogPosts` (src/data/cms.ts).
 * Each article is an intro (the first paragraph carries the drop cap) followed by
 * sections whose headings become the numbered H2s and the "On this page" list.
 * Copy describes how events are planned — never track record, clients or numbers
 * about Nexyyra itself.
 */

export type BlogSection = {
  /** Anchor for the H2 and the contents list — unique within the article. */
  id: string;
  heading: string;
  paragraphs: string[];
};

export type BlogArticleContent = {
  intro: string[];
  sections: BlogSection[];
  /** The page's one Deck — house copy, no quotation marks — placed after section `after` (1-based). */
  deck?: { after: number; text: string };
  relatedSlugs: string[];
};

/** Every post is published as the house; no individual bylines until a staff member is confirmed. */
export const BLOG_AUTHOR = "Nexyyra Events";

export const BLOG_ARTICLE_CONTENT: Record<string, BlogArticleContent> = {
  "destination-wedding-trends-2026": {
    relatedSlugs: ["udaipur-palace-wedding-guide", "goa-beach-wedding-guide", "wedding-budget-allocation-guide"],
    intro: [
      "Destination weddings keep evolving, and 2026 brings clear shifts for couples who want to celebrate beyond their home city.",
    ],
    sections: [
      {
        id: "smaller-guest-lists",
        heading: "Smaller guest lists, further away",
        paragraphs: [
          "Micro-destinations are gaining ground. Intimate gatherings in lesser-known places such as AlUla, Bhutan and the Konkan coast offer privacy without the peak-season crowds of Udaipur or Goa.",
        ],
      },
      {
        id: "conscious-choices",
        heading: "Sustainable choices that still feel generous",
        paragraphs: [
          "Couples are choosing eco-certified venues, locally sourced florals and carbon-offset travel, while keeping the sense of occasion a destination celebration calls for.",
        ],
      },
      {
        id: "weekends-not-receptions",
        heading: "Weekends, not receptions",
        paragraphs: [
          "Multi-day itineraries are replacing reception-only formats: welcome dinners, cultural outings, an adventure day and a farewell brunch, woven into one guest journey.",
          "Technology supports the weekend quietly — venue previews before travel, live streams for family at home, and seating plans worked out in advance — so the celebration feels timeless rather than tech-heavy.",
        ],
      },
      {
        id: "where-to-start",
        heading: "Where to start",
        paragraphs: [
          "Planning a destination celebration? The Udaipur palace guide and the Goa beach wedding guide cover venue-specific detail, and the budget allocation guide helps you structure the spend.",
        ],
      },
    ],
    deck: { after: 2, text: "The destination is the backdrop. The guest journey is the celebration." },
  },
  "corporate-event-roi": {
    relatedSlugs: ["corporate-gala-planning-checklist", "annual-day-corporate-planning", "hidden-event-expenses-corporate"],
    intro: [
      "Corporate events are a significant investment. Measuring return makes sure the spend drives business outcomes — not just applause on the night.",
    ],
    sections: [
      {
        id: "set-the-measures",
        heading: "Set the measures before the venue",
        paragraphs: [
          "Define KPIs before planning starts: lead targets, brand awareness, employee engagement scores or partnership conversations. Without them, the post-event report becomes anecdote.",
        ],
      },
      {
        id: "design-for-participation",
        heading: "Design for participation",
        paragraphs: [
          "Experiential activations outperform passive presentations. Interactive demos, structured networking and immersive brand zones create moments attendees remember long after the event.",
        ],
      },
      {
        id: "report-then-refine",
        heading: "Report, then refine",
        paragraphs: [
          "Post-event analytics — survey data, social reach, pipeline impact — should shape the next event. Agree the reporting format at the brief, so the numbers you need are captured on the night.",
        ],
      },
      {
        id: "budget-for-the-missing",
        heading: "Budget for what usually goes missing",
        paragraphs: [
          "Hidden costs erode return quietly. The hidden event expenses guide covers AV overruns, extended venue hours and late food-and-beverage additions — budget for them upfront.",
          "For galas specifically, the corporate gala checklist and the annual day planning guide set out step-by-step frameworks.",
        ],
      },
    ],
  },
  "sustainable-events-guide": {
    relatedSlugs: ["immersive-event-technology-2026", "destination-wedding-trends-2026", "pune-luxury-venues-guide"],
    intro: [
      "Luxury and sustainability are not opposites. A well-planned event can make conscious choices without giving up the guest experience or the visual impact.",
    ],
    sections: [
      {
        id: "start-with-the-venue",
        heading: "Start with the venue",
        paragraphs: [
          "Choose LEED-certified spaces, outdoor venues running on renewable power, or heritage properties that already run sustainability programmes.",
        ],
      },
      {
        id: "cut-waste",
        heading: "Cut waste at the source",
        paragraphs: [
          "Digital invitations, reusable décor, compostable serviceware and donation plans for leftover florals and food all reduce waste. We build these into the proposal whenever a client asks for a lower-waste event.",
        ],
      },
      {
        id: "source-close-to-home",
        heading: "Source close to home",
        paragraphs: [
          "Regional cuisine, native florals and local artisans reduce the carbon footprint, support Maharashtra's makers and give a celebration authentic character.",
        ],
      },
      {
        id: "tell-guests",
        heading: "Tell guests what you changed",
        paragraphs: [
          "Share your choices with guests. For corporate hosts it shows intent; for wedding families it often inspires relatives to do the same.",
          "Pair sustainability with technology: the immersive event technology guide looks at how smart lighting and digital programmes reduce physical waste.",
        ],
      },
    ],
    deck: { after: 2, text: "Luxury is attention to detail. Sustainability is the same habit, applied further." },
  },
  "wedding-planner-pune-guide": {
    relatedSlugs: ["vendor-coordination-wedding-tips", "mandap-decor-trends-luxury-weddings", "pune-luxury-venues-guide"],
    intro: [
      "Choosing a wedding planner in Pune is one of the most consequential decisions of the whole celebration. The right planner turns stress into anticipation; the wrong one creates costly surprises.",
    ],
    sections: [
      {
        id: "listen-first",
        heading: "Listen first, pitch second",
        paragraphs: [
          "Your planner should listen before pitching, ask about family dynamics and cultural requirements, and offer references from celebrations similar in scale to yours.",
        ],
      },
      {
        id: "vendor-bench",
        heading: "Check the vendor bench",
        paragraphs: [
          "Good planners keep a considered roster of vendors. Ask to speak with recent florists, caterers and photographers they have worked with, not only past couples.",
        ],
      },
      {
        id: "red-flags",
        heading: "Red flags",
        paragraphs: [
          "Watch for vague pricing, reluctance to share contracts upfront, and planners who take several weddings on the same weekend without a disclosed backup team.",
        ],
      },
      {
        id: "what-good-looks-like",
        heading: "What good service looks like",
        paragraphs: [
          "Transparent milestone invoicing, one dedicated event director rather than a rotating junior, a written Plan B, and vendor settlement handled on your behalf after the event.",
          "Once you have chosen a planner, the vendor coordination tips and mandap décor trends guides help you work together from engagement to the final farewell.",
        ],
      },
    ],
    deck: { after: 3, text: "The right planner makes the year before the wedding feel like part of the celebration." },
  },
  "corporate-gala-planning-checklist": {
    relatedSlugs: ["corporate-event-roi", "corporate-gala-etiquette-guide", "hidden-event-expenses-corporate"],
    intro: [
      "A smooth corporate gala depends on planning across a dozen workstreams. This checklist sets out the five phases we plan black-tie evenings in, from the brief to the report.",
    ],
    sections: [
      {
        id: "brief-and-kpis",
        heading: "Brief and KPIs · week 1",
        paragraphs: [
          "Define objectives, guest profile, dress code, budget ceiling and success measures. Secure leadership sign-off before venue scouting begins.",
        ],
      },
      {
        id: "venue-and-vendors",
        heading: "Venue and vendors · weeks 2–4",
        paragraphs: [
          "Shortlist three venues that match capacity and brand. Confirm catering tastings, AV specifications and entertainment options in writing.",
        ],
      },
      {
        id: "creative-and-branding",
        heading: "Creative and branding · weeks 4–8",
        paragraphs: [
          "Approve the stage design, lighting plot, branded collateral and photo and video scope. Rehearse leadership remarks and award presentations.",
        ],
      },
      {
        id: "guest-experience",
        heading: "Guest experience · weeks 6–10",
        paragraphs: [
          "Send save-the-dates, manage RSVPs, plan valet and registration flow, prepare seating charts and brief hospitality staff on VIP protocol.",
        ],
      },
      {
        id: "execution-and-reporting",
        heading: "Execution and reporting · event week",
        paragraphs: [
          "Run the dress rehearsal, execute the running order, capture analytics and deliver the post-event report. The corporate gala etiquette guide covers hosting standards for senior leadership.",
        ],
      },
    ],
  },
  "exhibition-booth-design-tips": {
    relatedSlugs: ["corporate-event-roi", "immersive-event-technology-2026", "annual-day-corporate-planning"],
    intro: [
      "Trade show booths compete for attention in crowded halls. Decisions made at the planning stage decide whether visitors stop, engage or walk past.",
    ],
    sections: [
      {
        id: "one-message",
        heading: "One message, visible from ten metres",
        paragraphs: [
          "Cluttered graphics dilute impact. Use one bold headline, one supporting visual and one clear call to action.",
        ],
      },
      {
        id: "use-the-height",
        heading: "Use the height",
        paragraphs: [
          "Vertical space is underused. Suspended elements, towers and overhead branding raise visibility across the hall without a larger footprint.",
        ],
      },
      {
        id: "give-visitors-something-to-do",
        heading: "Give visitors something to do",
        paragraphs: [
          "Product demos, VR experiences or gamified lead capture turn footfall into qualified conversations. Brochure stands alone rarely justify the booth fee.",
        ],
      },
      {
        id: "light-with-intent",
        heading: "Light the stand with intent",
        paragraphs: [
          "Pin spots on products, a warm wash on hospitality zones and accent colours in brand guidelines make the stand look finished — and give attendees a reason to photograph it.",
        ],
      },
      {
        id: "budget-honestly",
        heading: "Budget AV and staffing honestly",
        paragraphs: [
          "The hidden event expenses guide covers the exhibition overruns that eat into return before the show floor opens.",
        ],
      },
    ],
  },
  "luxury-birthday-celebration-ideas": {
    relatedSlugs: ["pune-luxury-venues-guide", "immersive-event-technology-2026", "wedding-budget-allocation-guide"],
    intro: [
      "Milestone birthdays deserve the same creative care as weddings and galas. We start every birthday brief with one question: what will guests remember in five years?",
    ],
    sections: [
      {
        id: "intimate-dinner",
        heading: "The intimate dinner",
        paragraphs: [
          "A boutique-hotel dinner suits 30–50 guests who want conversation over spectacle. A considered menu, live acoustic music and personal table settings create warmth without pressure of scale.",
        ],
      },
      {
        id: "themed-evening",
        heading: "The themed evening",
        paragraphs: [
          "Great Gatsby, Bollywood retro or tropical themes work well for 100–200 guests when the theme runs consistently from the invitation to the farewell favours.",
        ],
      },
      {
        id: "the-surprise",
        heading: "The surprise",
        paragraphs: [
          "Surprise parties need careful operations. We plan the decoy, guest arrival windows and the reveal, so the reaction of the guest of honour is genuinely unscripted.",
        ],
      },
      {
        id: "production-moment",
        heading: "The production moment",
        paragraphs: [
          "Live entertainment and custom production — recorded messages, a drone light show or a private performance — can turn an 18th, 25th or 50th into a family story.",
        ],
      },
      {
        id: "venue-first",
        heading: "Choose the venue first",
        paragraphs: [
          "The venue drives budget and atmosphere. The Pune venues guide and the budget allocation guide help anchor the first planning conversation.",
        ],
      },
    ],
    deck: { after: 2, text: "A milestone birthday should feel like the guest of honour, not like a venue package." },
  },
  "concert-production-pune": {
    relatedSlugs: ["immersive-event-technology-2026", "hidden-event-expenses-corporate", "annual-day-corporate-planning"],
    intro: [
      "Large-scale concert production in Pune — from outdoor amphitheatres to stadium shows — needs coordination across artist management, technical production, security and municipal compliance.",
    ],
    sections: [
      {
        id: "artist-logistics",
        heading: "Artist logistics",
        paragraphs: [
          "Work begins months ahead: rider fulfilment, backline, green-room specifications and travel windows that protect the performance. Each runs as a separate workstream with a single owner.",
        ],
      },
      {
        id: "stage-and-structure",
        heading: "Stage and structure",
        paragraphs: [
          "Stage design balances visual impact with structural safety. Load calculations, weather contingencies and sightlines are worked out in CAD before a single truss goes up.",
        ],
      },
      {
        id: "security-and-permissions",
        heading: "Security, crowd flow and permissions",
        paragraphs: [
          "Crowd planning works to Pune Municipal Corporation requirements. Capacity certification, medical standby and egress routes are fixed requirements, not afterthoughts.",
        ],
      },
      {
        id: "beyond-the-venue",
        heading: "Beyond the venue",
        paragraphs: [
          "Ticketing, live streaming and social amplification extend reach past the gates. Broadcast partners should be coordinated alongside on-ground execution, not after it.",
        ],
      },
      {
        id: "where-budgets-slip",
        heading: "Where budgets slip",
        paragraphs: [
          "Production budgets escalate quickly. The hidden event expenses guide lists AV, overtime and contingency lines specific to live entertainment.",
        ],
      },
    ],
  },
  "mandap-decor-trends-luxury-weddings": {
    relatedSlugs: ["wedding-planner-pune-guide", "sangeet-night-planning-guide", "vendor-coordination-wedding-tips"],
    intro: [
      "The mandap is the visual and spiritual heart of the ceremony. This year's direction favours intentional minimalism over ornament — every element carries meaning.",
    ],
    sections: [
      {
        id: "floral-architecture",
        heading: "Floral architecture",
        paragraphs: [
          "Asymmetric installations, hanging gardens and monochrome palettes — ivory on ivory, blush gradients — are replacing the heavy marigold canopy of earlier decades.",
        ],
      },
      {
        id: "materials",
        heading: "Materials with a second life",
        paragraphs: [
          "Bamboo structures, organic cotton draping and potted plants that guests take home bring a conscious edge without losing grandeur.",
        ],
      },
      {
        id: "after-sunset",
        heading: "After sunset",
        paragraphs: [
          "Lighting transforms the mandap once the sun goes down. Warm pin spots, candle clusters and gentle uplighting create intimacy that photographs beautifully.",
        ],
      },
      {
        id: "heritage-personalised",
        heading: "Heritage, personalised",
        paragraphs: [
          "Paithani patterns, Warli art or a family crest worked into the backdrop ground a contemporary design in cultural memory.",
        ],
      },
      {
        id: "one-design-language",
        heading: "One design language across functions",
        paragraphs: [
          "Coordinate the mandap with the sangeet stage and the reception décor for continuity. The sangeet planning guide and the vendor coordination tips help keep every function aligned.",
        ],
      },
    ],
    deck: { after: 2, text: "Every element in the mandap should earn its place." },
  },
  "wedding-budget-allocation-guide": {
    relatedSlugs: ["hidden-event-expenses-corporate", "wedding-planner-pune-guide", "destination-wedding-trends-2026"],
    intro: [
      "A well-structured wedding budget prevents mid-planning surprises. Allocate percentages before choosing vendors — not after emotional decisions have inflated the costs.",
    ],
    sections: [
      {
        id: "venue-and-catering",
        heading: "Venue and catering",
        paragraphs: [
          "Venue and catering usually take 40–45% of the total for a celebration in Pune. For destination weddings this often rises to 50–55% once guest accommodation is included.",
        ],
      },
      {
        id: "the-rest-of-the-budget",
        heading: "Décor, photography, entertainment and planning",
        paragraphs: [
          "As a starting framework: décor and florals 15–20%, photography and video 10–12%, entertainment including sangeet production 8–12%, planning and coordination 8–10%.",
        ],
      },
      {
        id: "contingency",
        heading: "Contingency",
        paragraphs: [
          "Hold 10% in reserve. Monsoon tenting, a growing guest list and last-minute upgrades happen on most celebrations, and couples who skip contingency usually end up cutting something they cared about.",
        ],
      },
      {
        id: "pay-against-milestones",
        heading: "Pay against milestones",
        paragraphs: [
          "Payments should follow vendor commitments, not arbitrary dates. At Nexyyra, 30% secures the date and the balance follows in milestones matched to deliverables.",
          "Corporate hosts can apply the same discipline — the hidden event expenses guide shows how these principles carry over to galas and conferences.",
        ],
      },
    ],
  },
  "udaipur-palace-wedding-guide": {
    relatedSlugs: ["destination-wedding-trends-2026", "goa-beach-wedding-guide", "wedding-budget-allocation-guide"],
    intro: [
      "Udaipur remains one of India's most sought-after cities for palace weddings — lake backdrops, heritage courtyards and hospitality built for multi-day celebrations.",
    ],
    sections: [
      {
        id: "season-and-booking",
        heading: "Season and booking windows",
        paragraphs: [
          "Peak season, October to March, often needs 12–18 months' notice at the best-known palace hotels. The shoulder months of April and September offer more availability and softer pricing.",
        ],
      },
      {
        id: "several-venues",
        heading: "Several venues, one schedule",
        paragraphs: [
          "Mehendi at a haveli, the wedding at a palace ghat, the reception on a lakeside lawn: moving between venues is Udaipur's signature challenge. We run an on-ground control desk so each transition keeps to time.",
        ],
      },
      {
        id: "guest-logistics",
        heading: "Guest logistics",
        paragraphs: [
          "Plan airport transfers, hotel room blocks across price points and city experiences for guests staying several days.",
        ],
      },
      {
        id: "heritage-rules",
        heading: "Heritage rules",
        paragraphs: [
          "Heritage properties restrict open flames, sound levels and structural installations. These constraints should be settled in the contract at booking — not discovered during setup week.",
          "If your vision leans coastal rather than regal, compare the Goa beach wedding guide — both destinations reward specialist planning, with very different guest experiences.",
        ],
      },
    ],
    deck: { after: 2, text: "In Udaipur, the setting does half the work. Planning does the rest." },
  },
  "pune-luxury-venues-guide": {
    relatedSlugs: ["wedding-planner-pune-guide", "venue-site-visit-checklist", "wedding-budget-allocation-guide"],
    intro: [
      "Pune offers a wide range of venues — five-star hotels in the city, lakeside resorts around Mulshi and hill properties further out — each suited to a different scale and style of celebration.",
    ],
    sections: [
      {
        id: "hotel-ballrooms",
        heading: "Hotel ballrooms",
        paragraphs: [
          "City-hotel ballrooms suit weddings and galas of 300–800 guests, with AV infrastructure and in-house catering already in place.",
        ],
      },
      {
        id: "garden-estates",
        heading: "Garden and farmhouse estates",
        paragraphs: [
          "Estates around Mulshi, Tamhini and Sinhagad give outdoor flexibility for 150–400 guests. Monsoon contingency is essential — tent specifications should be guaranteed in the contract.",
        ],
      },
      {
        id: "boutique-and-heritage",
        heading: "Boutique and heritage properties",
        paragraphs: [
          "Boutique hotels and heritage properties suit 50–120 guests who want character over capacity.",
        ],
      },
      {
        id: "site-visit",
        heading: "What to check on a site visit",
        paragraphs: [
          "Evaluate parking, vendor load-in access, sound restrictions and backup power — not just how the venue photographs. The venue site visit checklist covers every criterion.",
          "The venue usually anchors the whole budget. Cross-check the wedding budget allocation guide before committing to a property that takes a disproportionate share.",
        ],
      },
    ],
  },
  "sangeet-night-planning-guide": {
    relatedSlugs: ["mandap-decor-trends-luxury-weddings", "vendor-coordination-wedding-tips", "wedding-budget-allocation-guide"],
    intro: [
      "The sangeet is often the emotional peak of a multi-day wedding — families perform, dance and celebrate before the ceremony's gravity. Production quality here sets the tone for everything that follows.",
    ],
    sections: [
      {
        id: "choreography",
        heading: "Choreography and rehearsals",
        paragraphs: [
          "Choreography starts 8–12 weeks before the event. We coordinate rehearsal schedules, track selection and costume guidance so performances feel polished, not pressured.",
        ],
      },
      {
        id: "stage-for-energy",
        heading: "A stage built for energy",
        paragraphs: [
          "A sangeet stage differs from the mandap: dynamic lighting, LED backdrops and a dance floor close to the stage create energy. Set aside a clear share of the décor budget for it.",
        ],
      },
      {
        id: "running-order",
        heading: "Running order",
        paragraphs: [
          "Performance order matters — elders first, the couple last. A written running order avoids awkward gaps and gives the host clean transitions.",
        ],
      },
      {
        id: "coverage-and-coordination",
        heading: "Coverage and coordination",
        paragraphs: [
          "Brief photographers and videographers to cover rehearsals and backstage moments — often the most honest pictures of the whole wedding.",
          "Coordinate vendors through one thread: the vendor coordination guide keeps the sound engineer, choreographer and décor team from working at cross-purposes.",
        ],
      },
    ],
    deck: { after: 2, text: "The sangeet is where families perform for each other. Good production lets them enjoy it." },
  },
  "hidden-event-expenses-corporate": {
    relatedSlugs: ["corporate-event-roi", "wedding-budget-allocation-guide", "corporate-gala-planning-checklist"],
    intro: [
      "The most common overruns in large events are predictable, yet they are consistently underestimated. Transparency at proposal stage saves the relationship at reconciliation stage.",
    ],
    sections: [
      {
        id: "venue-overtime",
        heading: "Venue overtime",
        paragraphs: [
          "Running past the contracted hours brings steep penalties at larger properties. Build buffers into the running order and confirm overtime rates in writing.",
        ],
      },
      {
        id: "scope-creep",
        heading: "AV and production scope creep",
        paragraphs: [
          "Extra microphones, last-minute video playback and upgraded lighting add up quickly. Every change order should need written approval.",
        ],
      },
      {
        id: "late-headcount",
        heading: "Late headcount changes",
        paragraphs: [
          "Guest numbers that rise in the final 72 hours affect food, seating and favours disproportionately. Minimum guarantees with tiered pricing protect both sides.",
        ],
      },
      {
        id: "vendor-travel",
        heading: "Vendor travel and per diems",
        paragraphs: [
          "Transport, accommodation and per diems for outstation teams are often missing from first estimates. Nexyyra lists them line by line in every itemised proposal.",
          "Weddings need the same discipline — the budget allocation guide explains why contingency exists for exactly these lines.",
        ],
      },
    ],
  },
  "annual-day-corporate-planning": {
    relatedSlugs: ["corporate-gala-planning-checklist", "corporate-event-roi", "corporate-gala-etiquette-guide"],
    intro: [
      "Annual days reinforce culture, recognise achievement and set the tone for the year ahead. We plan them as brand experiences, not catered gatherings.",
    ],
    sections: [
      {
        id: "balance-the-programme",
        heading: "Balance the programme",
        paragraphs: [
          "Keep the leadership address to 12–15 minutes, rehearse award cues, choose entertainment that reflects company values and leave room for unstructured time together.",
        ],
      },
      {
        id: "team-on-stage",
        heading: "Put the team on stage",
        paragraphs: [
          "Engagement peaks when teams see themselves in the production: internal talent showcases, department films and live polls create ownership beyond attendance.",
        ],
      },
      {
        id: "venue-and-access",
        heading: "Venue and access",
        paragraphs: [
          "For 500–2,000 employees, prioritise easy access from the Pune–Mumbai expressway, ample parking and breakout spaces for parallel activities.",
        ],
      },
      {
        id: "remote-offices",
        heading: "Include remote offices",
        paragraphs: [
          "A live stream with regional watch parties lets distributed teams take part rather than just observe.",
          "Post-event surveys and social sharing feed the return-on-investment report — the corporate event ROI guide sets out measurement frameworks.",
        ],
      },
    ],
  },
  "goa-beach-wedding-guide": {
    relatedSlugs: ["udaipur-palace-wedding-guide", "destination-wedding-trends-2026", "venue-site-visit-checklist"],
    intro: [
      "Goa is one of India's most accessible beach wedding destinations — direct flights, international-standard resorts and the relaxed atmosphere couples look for.",
    ],
    sections: [
      {
        id: "north-or-south",
        heading: "North or South Goa",
        paragraphs: [
          "North Goa, around Candolim and Sinquerim, suits larger celebrations with established wedding infrastructure. South Goa, around Palolem and Agonda, suits micro-weddings of under 80 guests.",
        ],
      },
      {
        id: "permits-and-timing",
        heading: "Permits and timing",
        paragraphs: [
          "Beach ceremonies need permissions from local authorities, so allow several weeks. We plan permit timelines, sound limits and the sunset window as fixed constraints.",
        ],
      },
      {
        id: "beyond-the-ceremony",
        heading: "Beyond the ceremony",
        paragraphs: [
          "Sundowner cruises, spice plantation visits and market walks give travelling families a multi-day memory.",
        ],
      },
      {
        id: "weather-backup",
        heading: "Weather backup",
        paragraphs: [
          "Weather backup is mandatory. Every beach plan needs an indoor or tented alternative of equal capacity, confirmed before the invitations are printed.",
          "If beach-casual does not match your family's vision, compare the Udaipur palace wedding guide.",
        ],
      },
    ],
  },
  "venue-site-visit-checklist": {
    relatedSlugs: ["pune-luxury-venues-guide", "wedding-planner-pune-guide", "goa-beach-wedding-guide"],
    intro: [
      "A venue photograph never shows load-in limits, acoustic dead zones or a car park that is too small. A structured site visit prevents expensive discoveries during setup week.",
    ],
    sections: [
      {
        id: "access-and-logistics",
        heading: "Access and logistics",
        paragraphs: [
          "Confirm vendor entry points, lift capacity for décor, loading-dock hours and the distance from kitchen to the main event space.",
        ],
      },
      {
        id: "infrastructure",
        heading: "Infrastructure",
        paragraphs: [
          "Count power points and load capacity, test the backup generator, check air conditioning at event-time temperatures and confirm mobile coverage for guests.",
        ],
      },
      {
        id: "sound-and-restrictions",
        heading: "Sound, curfews and restrictions",
        paragraphs: [
          "Review sound limits, curfew times, open-flame policies and rain-backup spaces with measurements — not verbal assurances.",
        ],
      },
      {
        id: "catering",
        heading: "Catering",
        paragraphs: [
          "Inspect kitchen hygiene, tasting schedules, in-house versus outside catering policies and service staff ratios for your guest count.",
        ],
      },
      {
        id: "write-it-down",
        heading: "Write it all down",
        paragraphs: [
          "Record photos, measurements and written confirmations, and compare venues side by side using the Pune venues guide as a framework.",
        ],
      },
    ],
  },
  "immersive-event-technology-2026": {
    relatedSlugs: ["sustainable-events-guide", "concert-production-pune", "exhibition-booth-design-tips"],
    intro: [
      "Immersive technology is reshaping events — not as gimmickry, but as tools that deepen emotional connection and extend reach beyond the room.",
    ],
    sections: [
      {
        id: "projection-mapping",
        heading: "Projection mapping",
        paragraphs: [
          "Palace facades, corporate stages and exhibition stands become storytelling surfaces when content is designed for the architecture.",
        ],
      },
      {
        id: "quiet-personalisation",
        heading: "Quiet personalisation",
        paragraphs: [
          "Software-assisted seating, real-time translation and lighting cued to programme moments work best when guests never notice them.",
        ],
      },
      {
        id: "streaming",
        heading: "Streaming for hybrid audiences",
        paragraphs: [
          "Multi-camera broadcasts, social clips and virtual networking lounges serve remote audiences without draining the energy in the room.",
        ],
      },
      {
        id: "lower-impact-technology",
        heading: "Lower-impact technology",
        paragraphs: [
          "LED lighting, digital programmes and online registration reduce environmental impact and improve the data you collect.",
          "For large-scale productions, the concert production guide covers the technical detail that weddings and corporate events increasingly borrow.",
        ],
      },
    ],
    deck: { after: 2, text: "Technology works best at an event when guests notice the moment, not the machinery." },
  },
  "vendor-coordination-wedding-tips": {
    relatedSlugs: ["wedding-planner-pune-guide", "mandap-decor-trends-luxury-weddings", "sangeet-night-planning-guide"],
    intro: [
      "Vendor coordination is where wedding plans succeed or unravel. The most beautiful design fails when florists, caterers and AV teams work from conflicting timelines.",
    ],
    sections: [
      {
        id: "one-point-of-contact",
        heading: "One point of contact",
        paragraphs: [
          "Your event director handles all vendor communication — so the decorator never schedules setup in the photographer's golden-hour window.",
        ],
      },
      {
        id: "master-timeline",
        heading: "One master timeline",
        paragraphs: [
          "Share a master timeline 72 hours before each function so every vendor knows load-in, sound-check and teardown windows. Version control stops old schedules circulating.",
        ],
      },
      {
        id: "resolving-conflicts",
        heading: "Agree how conflicts are resolved",
        paragraphs: [
          "Set conflict-resolution rules before event week, not in the moment when exhaustion peaks. Your planner protects your vision while keeping vendor relationships intact.",
        ],
      },
      {
        id: "quality-checkpoints",
        heading: "Quality checkpoints",
        paragraphs: [
          "Décor mock-ups, menu tastings and lighting rehearsals catch problems early, when corrections cost hours, not lakhs.",
          "For the creative side, the mandap décor trends and sangeet planning guides pair well with this checklist.",
        ],
      },
    ],
  },
  "corporate-gala-etiquette-guide": {
    relatedSlugs: ["corporate-gala-planning-checklist", "annual-day-corporate-planning", "corporate-event-roi"],
    intro: [
      "A corporate gala reflects the culture and standards of the organisation hosting it. Etiquette reaches every touchpoint, from arrival to departure.",
    ],
    sections: [
      {
        id: "arrival",
        heading: "Arrival and registration",
        paragraphs: [
          "Registration and valet set the first impression. Name badges, queue management and greetings should match the evening — not feel like a conference check-in.",
        ],
      },
      {
        id: "seating",
        heading: "Seating",
        paragraphs: [
          "Seat leadership where they are visible without being isolated, and mix tables where cross-team conversation helps the evening.",
        ],
      },
      {
        id: "award-presentations",
        heading: "Award presentations",
        paragraphs: [
          "Rehearse timings, test teleprompters and approve remarks in advance. Unscripted moments should be intentional, not overruns that delay dinner service.",
        ],
      },
      {
        id: "entertainment",
        heading: "Entertainment that fits the room",
        paragraphs: [
          "A financial-services gala and a start-up celebration need different entertainment; the tone should match the brand and the audience.",
          "For the logistics behind the etiquette, the corporate gala checklist and the annual day guide cover planning end-to-end.",
        ],
      },
    ],
  },
};

export function getBlogArticleContent(slug: string): BlogArticleContent | undefined {
  return BLOG_ARTICLE_CONTENT[slug];
}

/** Word count of everything the article page renders as body copy (for `articleSchema`). */
export function blogWordCount(content: BlogArticleContent): number {
  const text = [...content.intro, ...content.sections.flatMap((s) => [s.heading, ...s.paragraphs])].join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}

/** "Destination Weddings" → "destination-weddings" — the `?c=` value on /blog. */
export function blogCategorySlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Pre-selects the inquiry event type from a post's category; other categories leave it open. */
export function blogEventType(category: string): string | undefined {
  if (category === "Wedding Planning") return "WEDDING";
  if (category === "Destination Weddings") return "DESTINATION_WEDDING";
  if (category === "Corporate Events") return "CORPORATE";
  return undefined;
}
