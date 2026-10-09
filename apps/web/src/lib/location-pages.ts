import { BRAND_INVESTMENTS } from "@/brand/data/content";
import type { ServiceSlug } from "@/components/ui/types";
import { services } from "@/data/cms";
import { SITE_CONFIG } from "./constants";
import { ORG_ID } from "./seo";
import { UNIVERSAL_LOCAL_FAQS } from "./geo-content";

export interface LocationPage {
  slug: string;
  city: string;
  state: string;
  /** SEO title (metadata only). */
  title: string;
  h1: string;
  description: string;
  keywords: string[];
  /** Cover lead — unique to the city: logistics, travel from Pune, venue types. */
  intro: string;
  /** "How we work in {city}" — three paragraphs, materially unique per city. */
  howWeWork: string[];
  /** The six services shown in "Services in {city}". */
  services: ServiceSlug[];
  faqs: { question: string; answer: string }[];
  geo: { latitude: number; longitude: number };
}

/** "₹8 Lakhs" from the service's `basePrice` in cms.ts — prices are never typed into copy. */
export function startingPrice(slug: ServiceSlug): string {
  const price = services.find((s) => s.slug === slug)?.basePrice ?? 0;
  return price >= 1_00_00_000 ? `₹${price / 1_00_00_000} Crore` : `₹${price / 1_00_000} Lakhs`;
}

const [, SIGNATURE, GRAND] = BRAND_INVESTMENTS;

/** "The Signature Gala" → "the Signature Gala", for collection names mid-sentence. */
const inSentence = (name: string) => name.replace(/^The\s+/, "the ");

/*
 * Copy rules (DESIGN.md §1.2): capability and process only — no partnerships,
 * no track record, no named venues. Travel times are approximate and stated as such.
 */
export const LOCATION_PAGES: LocationPage[] = [
  {
    slug: "pune",
    city: "Pune",
    state: "Maharashtra",
    title: "Luxury Event Planner Pune",
    h1: "Event planning in Pune",
    description:
      "Weddings, corporate events and celebrations in Pune, planned from our Delivery & Coordination Office in the city by one event director.",
    keywords: ["Event Planner Pune", "Wedding Planner Pune", "Luxury Events Pune"],
    intro:
      "Pune is where our Delivery & Coordination Office sits, so site walks, tastings and vendor meetings fit around your week rather than a travel plan.",
    howWeWork: [
      "Planning in Pune starts with a walk through the venue rather than a slideshow. Your event director can meet you on the lawn, sit in on the caterer's tasting and check the power supply in the same week. That keeps the gap between consultation and itemised proposal inside our 48-hour commitment.",
      "The city offers hotel ballrooms, open lawns, heritage bungalows and farm estates out towards Mulshi and Lonavala. The season shapes the choice: November to February brings cool evenings for outdoor mandaps, March to May pushes daytime functions indoors, and the June to September monsoon calls for a covered lawn or a confirmed indoor fallback.",
      "Traffic between the western IT corridors and the old city can add an hour to a guest transfer, so we time pickups and choose where out-of-town guests stay. Décor, sound, lighting and catering suppliers are briefed from one production schedule, in English, Hindi or Marathi, and your event director runs the day on site.",
    ],
    services: ["wedding-planning", "corporate-events", "birthday-events", "conferences", "exhibitions", "event-production"],
    faqs: [
      {
        question: "Can we meet a planner in person in Pune?",
        answer:
          "Yes. Consultations run by phone or video call, and in person in Pune by appointment, usually at your shortlisted venue, since that is where most decisions get made. Call or WhatsApp +91 7020640157 to fix a time.",
      },
      {
        question: "When is wedding season in Pune?",
        answer:
          "November to February is the busiest stretch, with cooler evenings that suit outdoor ceremonies. Popular dates go early, so start nine to twelve months ahead. Monsoon dates from June to September are easier to secure with a covered or indoor setting.",
      },
    ],
    geo: { latitude: 18.5204, longitude: 73.8567 },
  },
  {
    slug: "mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    title: "Luxury Event Planner Mumbai",
    h1: "Event planning in Mumbai",
    description:
      "Weddings, corporate events, launches and brand activations in Mumbai, planned from Pune around hotel load-in windows, monsoon and city traffic.",
    keywords: ["Event Planner Mumbai", "Wedding Planner Mumbai", "Corporate Events Mumbai"],
    intro:
      "Mumbai events run on tight load-in windows, sea air and city traffic. We plan them from Pune, three to four hours away on the Expressway, with a schedule that respects all three.",
    howWeWork: [
      "Mumbai's five-star hotels often let décor and production crews in only after the previous function clears, sometimes late at night. We build the set-up plan around that window, design stage elements to assemble quickly, and confirm every supplier's arrival slot with the hotel's banqueting team in writing.",
      "Venue types range from hotel ballrooms and convention halls to sea-facing lawns, rooftops and heritage buildings in the older parts of the city. Between June and September the monsoon is heavy, so an open-air plan needs a covered alternative booked, not pencilled in. Outdoor amplified music generally has to stop at 10pm, which we build into the running order for sangeets and after-parties.",
      "Guests flying in or driving from Pune get transfer timings that allow for peak traffic on the sea link and arterial roads. Crew and equipment travel by road on the Mumbai–Pune Expressway, or we hire locally when the venue's in-house supplier is mandatory. One event director holds the schedule from the first supplier call to the final load-out.",
    ],
    services: ["wedding-planning", "corporate-events", "product-launches", "brand-promotions", "fashion-shows", "celebrity-management"],
    faqs: [
      {
        question: "Do you plan events in Mumbai from Pune?",
        answer:
          "Yes. Planning, design and supplier coordination run from our Pune office, and your event director and core crew travel to Mumbai for site visits, set-up and the event itself. The drive is roughly three to four hours on the Expressway, so a site visit fits in a day.",
      },
      {
        question: "Can you work with a Mumbai hotel's in-house suppliers?",
        answer:
          "Yes. Many city hotels require their own caterers or AV suppliers. We coordinate with them rather than around them, and your itemised proposal shows which lines the hotel supplies and which we produce.",
      },
    ],
    geo: { latitude: 19.076, longitude: 72.8777 },
  },
  {
    slug: "nashik",
    city: "Nashik",
    state: "Maharashtra",
    title: "Wedding & Event Planner Nashik",
    h1: "Event planning in Nashik",
    description:
      "Vineyard, resort and lakeside weddings and company off-sites in Nashik, planned from Pune with guest stays and transfers arranged.",
    keywords: ["Wedding Planner Nashik", "Event Management Nashik", "Vineyard Wedding Nashik"],
    intro:
      "Nashik pairs vineyard estates and lakeside resorts with a cooler, slower pace. About five hours by road from Pune, it suits weekend weddings and company off-sites.",
    howWeWork: [
      "Nashik works best as a short destination: guests drive up from Pune or Mumbai, stay two nights and leave after brunch. We plan room blocks across resorts and estates on the city's edges, set check-in and departure times, and arrange transfers so nobody is left finding the venue after dark.",
      "Vineyard estates, riverside lawns, hill-view resorts and banquet halls in town each bring their own rules on music, catering and décor. The grape harvest from January to March draws people to estate events, while the monsoon turns the hills green but makes open lawns unreliable. Large pilgrimage periods fill the city's hotels quickly, so we check the religious calendar before holding a date.",
      "Local caterers, florists and tent suppliers are briefed alongside the crew we bring from Pune, on one production schedule for both. For corporate retreats we plan sessions, team activities and dinners around the estate's own facilities. Your event director stays on site from set-up to check-out.",
    ],
    services: ["wedding-planning", "destination-weddings", "corporate-events", "conferences", "birthday-events", "event-production"],
    faqs: [
      {
        question: "Can you plan a vineyard wedding in Nashik?",
        answer:
          "Yes. We plan estate and vineyard weddings around each property's rules on music, catering and capacity, and arrange guest stays and transfers. Your proposal lists the estate's costs separately from décor, production and hospitality.",
      },
      {
        question: "How far ahead should we book a Nashik weekend?",
        answer:
          "Nine to twelve months for peak November to February weekends, and earlier if your dates overlap a festival or pilgrimage period, when hotel rooms in the city become scarce.",
      },
    ],
    geo: { latitude: 19.9975, longitude: 73.7898 },
  },
  {
    slug: "nagpur",
    city: "Nagpur",
    state: "Maharashtra",
    title: "Event Management Nagpur",
    h1: "Event planning in Nagpur",
    description:
      "Weddings, conferences and family celebrations in Nagpur and Vidarbha, planned around the region's summer heat and short winter season.",
    keywords: ["Event Management Nagpur", "Wedding Planner Nagpur", "Corporate Events Nagpur"],
    intro:
      "Nagpur sits at the centre of Vidarbha, the region that is home to our registered office. We plan weddings, conferences and family celebrations here around fierce summers and a short, festive winter.",
    howWeWork: [
      "From Pune, Nagpur is about 90 minutes by air or an overnight train, so we combine the first site visit with supplier meetings and tastings in a single trip. Our registered office in Telhara is also in Vidarbha, a few hours west by road, which keeps regional travel simple.",
      "Summer afternoons in April and May regularly cross 45°C, so daytime outdoor functions move to the evening, or indoors with proper cooling. The November to February season is the most comfortable for lawns and open mandaps. Venue types include large garden lawns, hotel banquet halls, club grounds and convention spaces suited to association meetings.",
      "Guest lists in the region can run long, and we plan seating, catering counts and parking on paper rather than estimating on the day. Local tent, catering and lighting suppliers are briefed from a single schedule, in Marathi, Hindi or English. Your event director leads the event on site, start to finish.",
    ],
    services: ["wedding-planning", "corporate-events", "conferences", "exhibitions", "birthday-events", "event-production"],
    faqs: [
      {
        question: "Do you plan events in Nagpur and the wider Vidarbha region?",
        answer:
          "Yes. We plan weddings, corporate meetings and celebrations in Nagpur and across Vidarbha. Planning runs from our Pune office, and the event director and core crew travel for site visits and the event.",
      },
      {
        question: "What is the best time of year for an outdoor event in Nagpur?",
        answer:
          "November to February. Summer heat makes daytime outdoor events hard work from April to June, and the monsoon follows. If your date falls in summer, hold the main function in the evening or indoors.",
      },
    ],
    geo: { latitude: 21.1458, longitude: 79.0882 },
  },
  {
    slug: "ahmedabad",
    city: "Ahmedabad",
    state: "Gujarat",
    title: "Luxury Wedding Planner Ahmedabad",
    h1: "Event planning in Ahmedabad",
    description:
      "Weddings and corporate events in Ahmedabad, planned around Navratri, Gujarat's catering and bar rules, and the city's party plots and havelis.",
    keywords: ["Wedding Planner Ahmedabad", "Event Planner Gujarat", "Corporate Events Ahmedabad"],
    intro:
      "Ahmedabad events follow Gujarat's own rhythm: Navratri in autumn, warm winters on the lawns, and catering and bar rules that differ from Maharashtra's.",
    howWeWork: [
      "Gujarat's prohibition rules mean alcohol can be served only with the right permits at licensed venues, so we settle the bar question at the first consultation rather than the last. Many families prefer vegetarian or Jain menus, and we brief caterers on kitchen separation and ingredient lists early.",
      "Party plots, farm lawns, hotel banquets and heritage havelis in the old walled city are the usual venue types, each with different limits on décor and sound. The Navratri weeks in September or October book out tents, sound and lighting across the city, so we hold suppliers early if your date falls nearby. October to February is the comfortable outdoor season; summer afternoons are fierce.",
      "Pune to Ahmedabad is a little over an hour by air, which makes site visits and tastings straightforward. We combine crew from Pune with local décor and catering suppliers on one production schedule. Your event director runs the day and is the single point of contact for your family or company.",
    ],
    services: ["wedding-planning", "corporate-events", "exhibitions", "product-launches", "brand-promotions", "event-production"],
    faqs: [
      {
        question: "Can you plan a wedding with a bar in Ahmedabad?",
        answer:
          "Yes, within Gujarat's rules. Alcohol service needs the applicable permits and a licensed venue. We confirm what is possible for your venue and guest list before design begins, and plan a non-alcoholic bar where permits do not apply.",
      },
      {
        question: "Do you work with Jain and vegetarian caterers?",
        answer:
          "Yes. We brief caterers on menu restrictions, kitchen separation and service timing at the planning stage, and your proposal itemises catering so you can compare options.",
      },
    ],
    geo: { latitude: 23.0225, longitude: 72.5714 },
  },
  {
    slug: "surat",
    city: "Surat",
    state: "Gujarat",
    title: "Event Planner Surat",
    h1: "Event planning in Surat",
    description:
      "Large weddings, corporate galas and dealer meets in Surat, with guest flow, catering counts and production planned for long guest lists.",
    keywords: ["Event Planner Surat", "Wedding Planner Surat", "Corporate Events Surat"],
    intro:
      "Surat weddings often run across several days with guest lists in the hundreds. We plan arrivals, seating, food service and production for that scale, from Pune, about eight hours away by road.",
    howWeWork: [
      "With a long guest list, the details that matter most are arrival, seating and food service. We plan entry points, registration, seating charts and the number of service counters on paper before the venue is dressed, so the evening runs without queues.",
      "Venues range from farmhouses and party plots on the city's outskirts to riverside banquet halls and hotel ballrooms. The monsoon along this coast is heavy from June to September, so we confirm drainage, covered areas and generator backup for any open-air date. Gujarat's liquor rules apply here as well, which shapes the reception menu from the first conversation.",
      "Surat is roughly 420 km from Pune by road and closer still to Mumbai, so heavy staging can travel from either city or be hired locally. We choose by cost and lead time and show both options in your proposal. Local caterers, florists and sound suppliers work to one schedule set by your event director.",
    ],
    services: ["wedding-planning", "corporate-events", "exhibitions", "concert-management", "birthday-events", "event-production"],
    faqs: [
      {
        question: "Can you manage a wedding with more than 1,000 guests in Surat?",
        answer: `Yes. Large guest counts are planned through registration, seating, catering service points and transfers worked out in advance. Celebrations of 500+ guests sit in ${inSentence(GRAND.name)} collection, from ${GRAND.from}, and every proposal is itemised.`,
      },
      {
        question: "Do you travel to Surat for site visits?",
        answer:
          "Yes. Your event director visits the shortlisted venues with you and meets local suppliers before the proposal is finalised.",
      },
    ],
    geo: { latitude: 21.1702, longitude: 72.8311 },
  },
  {
    slug: "goa",
    city: "Goa",
    state: "Goa",
    title: "Destination Wedding Planner Goa",
    h1: "Event planning in Goa",
    description:
      "Beach, villa and riverside weddings in Goa, planned from Pune around the coastal season, beach permissions, sound rules and guest flights.",
    keywords: ["Destination Wedding Goa", "Beach Wedding Planner Goa", "Resort Wedding Goa"],
    intro:
      "In Goa, guests fly in, stay several nights and expect the setting to do some of the work. We plan beach, villa and riverside weddings around the coast's season, permissions and sound rules.",
    howWeWork: [
      "Goa's comfortable season runs from November to February. From June to September the monsoon closes many beachfront set-ups and makes open-air ceremonies impractical, though resort interiors and villas still work for smaller gatherings. We hold December dates early, when flights and rooms are at their most expensive.",
      "Venue types include beach resorts, Portuguese-era villas and mansions, riverside lawns and private estates in both North and South Goa. Beach events need permission from the local authorities, and outdoor amplified music is expected to stop by 10pm, so sangeets and after-parties move indoors or to venues licensed for later hours.",
      "Pune to Goa is about an hour by air or nine to ten hours by road. Guests land at either Mopa or Dabolim, which are far apart, so we match room blocks and transfers to each guest's flight. Décor and production are split between crew from Pune and local suppliers, all on one schedule led by your event director.",
    ],
    services: ["destination-weddings", "wedding-planning", "birthday-events", "corporate-events", "concert-management", "event-production"],
    faqs: [
      {
        question: "When is the best time for a beach wedding in Goa?",
        answer:
          "November to February offers the most reliable weather. The monsoon from June to September rules out most beach ceremonies; a resort or villa setting works better then.",
      },
      {
        question: "Do beach weddings in Goa need permission?",
        answer:
          "Yes. Beach events generally need permission from the local authorities, and sound rules apply outdoors after 10pm. We handle the applications and plan the timeline around any conditions attached.",
      },
    ],
    geo: { latitude: 15.2993, longitude: 74.124 },
  },
  {
    slug: "delhi",
    city: "Delhi",
    state: "Delhi NCR",
    title: "Luxury Event Planner Delhi",
    h1: "Event planning in Delhi NCR",
    description:
      "Weddings, corporate events and launches across Delhi, Gurugram and Noida, planned from Pune for distance, winter fog and peak-season demand.",
    keywords: ["Event Planner Delhi", "Wedding Planner Delhi NCR", "Corporate Events Delhi"],
    intro:
      "Delhi NCR is three cities in one: Delhi, Gurugram and Noida. We plan weddings and corporate events here for distance, winter fog and peak-season demand from the very first call.",
    howWeWork: [
      "The wedding season from November to February is also when fog can delay early-morning and late-night flights. We advise guests and crew to arrive a day early, keep a buffer before the first function, and avoid tight connections on the day itself.",
      "Farmhouse estates, hotel ballrooms, banquet complexes and heritage properties are spread across NCR, and a venue in Gurugram can be more than an hour from guest hotels in Noida. We cluster rooms near the venue where we can and schedule transfers outside rush hour. Winter nights turn cold, so open-air set-ups need heating, and November air quality can change outdoor plans.",
      "Pune to Delhi is about two hours by air. Planning and design run from Pune, while tenting, catering and lighting suppliers are hired in NCR and briefed on one production schedule. For conferences and launches we coordinate the venue's technical team and speaker travel, with your event director as the single point of contact.",
    ],
    services: ["wedding-planning", "corporate-events", "product-launches", "conferences", "celebrity-management", "fashion-shows"],
    faqs: [
      {
        question: "Do you plan events in Delhi NCR from Pune?",
        answer:
          "Yes. Design, budgeting and supplier coordination run from our Pune office, and your event director and core crew travel to Delhi NCR for site visits, set-up and the event.",
      },
      {
        question: "How do you plan around winter fog in Delhi?",
        answer:
          "We build buffers into travel for guests, crew and artists: arriving a day before the first function, avoiding early-morning flights on event days, and keeping room in the running order for late arrivals.",
      },
    ],
    geo: { latitude: 28.6139, longitude: 77.209 },
  },
  {
    slug: "jaipur",
    city: "Jaipur",
    state: "Rajasthan",
    title: "Palace Wedding Planner Jaipur",
    h1: "Event planning in Jaipur",
    description:
      "Heritage hotel, haveli and fort-setting weddings in Jaipur, with décor, sound and guest stays planned within each property's rules.",
    keywords: ["Palace Wedding Jaipur", "Wedding Planner Jaipur", "Destination Wedding Rajasthan"],
    intro:
      "Jaipur weddings are built around heritage hotels, haveli courtyards and fort settings, each with rules that protect the building. We plan décor, sound and guest stays to fit those rules from the start.",
    howWeWork: [
      "Heritage properties often restrict fixings to walls, open flame, heavy loads on old floors and music after a set hour. We walk the property with its events team, write the restrictions down and design within them, so nothing is refused on set-up day.",
      "October to March is the comfortable season; summer days are very hot, and the short monsoon can still disrupt an open courtyard. Popular winter dates fill early at the city's heritage hotels, so we suggest securing the venue nine to twelve months ahead. With a larger guest list, rooms are often split across properties, and we plan shuttles to match.",
      "Pune to Jaipur is about two hours by air. Rajasthani folk musicians, block-print and floral artisans and local caterers can all be part of the design; we brief them alongside crew from Pune on one production schedule. Your event director coordinates every function across the wedding days.",
    ],
    services: ["destination-weddings", "wedding-planning", "corporate-events", "birthday-events", "celebrity-management", "event-production"],
    faqs: [
      {
        question: "Can you plan a palace or heritage hotel wedding in Jaipur?",
        answer:
          "Yes. We plan within each heritage property's rules on décor, sound, flame and capacity, and arrange room blocks and shuttles when guests stay across several hotels.",
      },
      {
        question: "How early should we book a Jaipur winter wedding?",
        answer:
          "Nine to twelve months ahead for November to February dates. Heritage properties have limited availability on popular dates, and holding the venue first lets design and travel follow.",
      },
    ],
    geo: { latitude: 26.9124, longitude: 75.7873 },
  },
  {
    slug: "hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    title: "Luxury Event Planner Hyderabad",
    h1: "Event planning in Hyderabad",
    description:
      "Weddings, conferences and launches in Hyderabad, at palace hotels, convention centres and resorts, planned from Pune with local suppliers.",
    keywords: ["Event Planner Hyderabad", "Wedding Planner Hyderabad", "Corporate Events Hyderabad"],
    intro:
      "Hyderabad offers palace hotels, large convention centres and resort estates on the city's edge. We plan weddings, conferences and launches here with crew from Pune and suppliers hired in the city.",
    howWeWork: [
      "Pune to Hyderabad is a little over an hour by air or about nine hours by road. Heavy staging can be trucked from Pune or hired in the city; we compare both on cost and lead time, and your proposal shows which we chose and why.",
      "Venue types range from heritage palace hotels and function halls to convention centres built for conferences and exhibitions, and resorts out towards the ring road. Summer afternoons from March to May are hot, so outdoor functions move to the evening. Distances between the airport, the IT districts and the older city are long, so we plan transfers by time of day.",
      "Consultations run in English or Hindi, and we work with local caterers who know Hyderabadi and Telugu menus as well as wider Indian cuisine. For corporate events we coordinate registration, staging, AV and speaker logistics with the venue's technical team. One event director holds the schedule from first call to load-out.",
    ],
    services: ["wedding-planning", "corporate-events", "conferences", "product-launches", "exhibitions", "event-production"],
    faqs: [
      {
        question: "Do you plan corporate conferences in Hyderabad?",
        answer: `Yes. We plan conferences, offsites and launches in Hyderabad, coordinating venue AV, registration, staging and speaker travel. Conference production starts from ${startingPrice("conferences")}, scoped in an itemised proposal.`,
      },
      {
        question: "Can you plan a Hyderabad wedding with a Telugu ceremony?",
        answer:
          "Yes. We work with your family's priest and local suppliers on ritual requirements, timings and set-up, and plan décor and hospitality around the ceremony.",
      },
    ],
    geo: { latitude: 17.385, longitude: 78.4867 },
  },
  {
    slug: "bangalore",
    city: "Bangalore",
    state: "Karnataka",
    title: "Luxury Event Planner Bangalore",
    h1: "Event planning in Bangalore",
    description:
      "Conferences, offsites, product launches and weddings in Bangalore, planned from Pune around the city's rain, traffic and airport distance.",
    keywords: ["Event Planner Bangalore", "Wedding Planner Bangalore", "Corporate Events Bangalore"],
    intro:
      "Bangalore's mild weather makes it a year-round events city, but its traffic and two rainy seasons need planning. We produce conferences, launches and weddings here with crew from Pune and local suppliers.",
    howWeWork: [
      "Evening showers are common from May to October, sometimes heavy, so every open-air function gets a covered fallback written into the venue contract. The cool, dry months from November to February are the most reliable for garden settings.",
      "Corporate briefs here often mean conferences, team offsites and product launches at hotel ballrooms, convention centres and resorts on the city's fringe. The airport is well north of the centre and a cross-city drive can take well over an hour, so we place guests close to the venue and schedule transfers away from peak traffic.",
      "Pune to Bangalore is about 90 minutes by air. AV, staging and lighting are sourced locally when that saves freight, and crew from Pune covers design, show-calling and guest management. Your event director is the single contact for your company or family, from proposal to wrap.",
    ],
    services: ["corporate-events", "conferences", "product-launches", "brand-promotions", "wedding-planning", "concert-management"],
    faqs: [
      {
        question: "Do you plan company offsites near Bangalore?",
        answer:
          "Yes. We plan offsites at resorts around Bangalore — sessions, team activities, dinners, rooms and transfers — on one itemised proposal.",
      },
      {
        question: "How do you handle rain at Bangalore events?",
        answer:
          "Every open-air plan has a covered alternative confirmed in writing with the venue, and we watch the forecast in the final week so the call on the fallback is made in good time.",
      },
    ],
    geo: { latitude: 12.9716, longitude: 77.5946 },
  },
  {
    slug: "indore",
    city: "Indore",
    state: "Madhya Pradesh",
    title: "Event Management Indore",
    h1: "Event planning in Indore",
    description:
      "Weddings, dealer meets and celebrations in Indore, plus destination functions at Maheshwar and Mandu, planned from Pune.",
    keywords: ["Event Management Indore", "Wedding Planner Indore", "Corporate Events Indore"],
    intro:
      "Indore celebrates with food at the centre, and the city's lawns and banquet halls are built for it. We plan weddings and corporate events here, and smaller destination functions at Maheshwar and Mandu.",
    howWeWork: [
      "Pune to Indore is a little over an hour by air, or a long day by road. We pair site visits with catering tastings, because the menu carries as much weight here as the décor. Caterers are briefed on live counters, regional specialities and timing so food service keeps pace with the guest list.",
      "Venue types include large garden lawns, hotel banquet halls and resorts on the outskirts, with the riverside heritage towns of Maheshwar and Mandu a couple of hours away for smaller destination weddings. Summers are hot from April to June, the monsoon follows, and October to February is the comfortable outdoor season.",
      "For corporate meetings and dealer conferences we coordinate halls, AV and stays for out-of-town delegates. Local tent, lighting and décor suppliers work alongside crew from Pune on one production schedule, run by your event director.",
    ],
    services: ["wedding-planning", "destination-weddings", "corporate-events", "exhibitions", "birthday-events", "event-production"],
    faqs: [
      {
        question: "Can you plan a destination wedding at Maheshwar or Mandu?",
        answer:
          "Yes. Both are roughly two to three hours by road from Indore. Rooms there are limited, so we plan stays across properties, transfers from Indore airport, and a production plan that respects heritage rules.",
      },
      {
        question: "Do you plan dealer meets and conferences in Indore?",
        answer:
          "Yes. We coordinate the venue, stage, AV, registration and delegate stays, with an itemised proposal after a free consultation.",
      },
    ],
    geo: { latitude: 22.7196, longitude: 75.8577 },
  },
  {
    slug: "udaipur",
    city: "Udaipur",
    state: "Rajasthan",
    title: "Palace Wedding Planner Udaipur",
    h1: "Event planning in Udaipur",
    description:
      "Lake and palace-hotel weddings in Udaipur, with boat transfers, multi-hotel guest stays and heritage rules planned from Pune.",
    keywords: ["Palace Wedding Udaipur", "Destination Wedding Udaipur", "Luxury Wedding Rajasthan"],
    intro:
      "Udaipur weddings happen on and around the lakes: palace hotels, island settings, ghats and hill-view resorts. We plan the boats, shuttles and heritage rules that come with them.",
    howWeWork: [
      "Lake venues add a layer most cities do not: boat transfers for guests, crew and equipment, with limited jetty times. We schedule every crossing, plan for older guests and children, and keep décor elements light enough to move by water where needed.",
      "Hotel rooms in the old city are limited, so a larger wedding usually spreads guests across several properties. We assign room blocks, run shuttles between them and keep the welcome desk at each hotel briefed. October to March is the comfortable season; summer is hot, and the monsoon refills the lakes between July and September.",
      "Most guests fly into Udaipur's airport, around 30 to 40 minutes from the city, so we build arrivals around flight schedules from their home cities. Heritage properties set rules on sound, open flame and fixings, which we record at the site walk and design within. Your event director leads every function, with local suppliers and crew from Pune on one schedule.",
    ],
    services: ["destination-weddings", "wedding-planning", "celebrity-management", "event-production", "birthday-events", "corporate-events"],
    faqs: [
      {
        question: "How much does a palace wedding in Udaipur cost?",
        answer: `It depends on the property, guest count, number of functions and design. As a guide, ${inSentence(SIGNATURE.name)} collection starts from ${SIGNATURE.from} for 150–500 guests and ${inSentence(GRAND.name)} from ${GRAND.from} for 500+; destination wedding planning as a single service starts from ${startingPrice("destination-weddings")}. Your itemised proposal follows within 48 hours of a free consultation.`,
      },
      {
        question: "Do guests need boat transfers for Udaipur lake venues?",
        answer:
          "For island and some lakeside venues, yes. We schedule the crossings, staff each jetty and plan access for older guests and children.",
      },
    ],
    geo: { latitude: 24.5854, longitude: 73.7125 },
  },
];

export function getLocationPage(slug: string): LocationPage | undefined {
  return LOCATION_PAGES.find((p) => p.slug === slug);
}

export function getExpandedLocationFaqs(page: LocationPage) {
  const seen = new Set<string>();
  return [...page.faqs, ...UNIVERSAL_LOCAL_FAQS].filter((faq) => {
    if (seen.has(faq.question)) return false;
    seen.add(faq.question);
    return true;
  });
}

/**
 * A Service node per city page, not a LocalBusiness: the company has one
 * registered office (Telhara) and a Pune coordination office, so a city page
 * names the city as `areaServed` only — no PostalAddress or geo that would
 * imply an office there.
 */
export function locationBusinessSchema(page: LocationPage) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_CONFIG.url}/locations/${page.slug}#service`,
    name: `Event planning in ${page.city}`,
    serviceType: "Event planning",
    description: page.description,
    url: `${SITE_CONFIG.url}/locations/${page.slug}`,
    provider: { "@id": ORG_ID },
    /* Goa is a state, not a city: when the page's place is the state itself,
       type it as a State in India instead of a City inside itself. */
    areaServed:
      page.city === page.state
        ? { "@type": "State", name: page.state, containedInPlace: { "@type": "Country", name: "India" } }
        : { "@type": "City", name: page.city, containedInPlace: { "@type": "AdministrativeArea", name: page.state } },
  };
}
