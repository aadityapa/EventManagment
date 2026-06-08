/** Senior UI/UX prompts — consistent Glitz design system across all Stitch screens */

const BRAND = `Brand: "Glitz Events & Promotions" Pune India. Luxury black (#0A0A0A) & gold (#D4AF37) cinematic aesthetic. Playfair Display headings, Montserrat body. Glassmorphism cards, gold glow CTAs, scroll-reveal animations. Phone +91 9730594753, WhatsApp CTA. Desktop 1280px. Do NOT include site header/nav/footer — main content only.`;

export const STITCH_PROMPTS = {
  services: `${BRAND}
Services hub page. Hero eyebrow "What We Do", H1 "Curated Event Experiences". Grid of 8 luxury service cards: Weddings, Corporate Events, Concerts, Exhibitions, Celebrity Management, Product Launches, Award Functions, Destination Weddings. Each card: Material icon, title, 2-line description, "Explore" link, hover lift + gold border glow. Secondary section: 3-step process (Consult → Plan → Execute). Bottom gold CTA band "Book Free Consultation".`,

  contact: `${BRAND}
Contact page. Split layout: left column — H1 "Let's Create Something Extraordinary", contact cards (Phone +91 9730594753, Email hello@glitzevents.in, Pune address, business hours). Right column — glass contact form (Name, Email, Phone, Event Type dropdown, Message, gold submit button). Embedded map placeholder. WhatsApp floating hint.`,

  "book-event": `${BRAND}
Event booking wizard. Top: progress stepper (5 steps). Step 1 visible: Event Type grid (Wedding, Corporate, Concert, Exhibition, Other) as selectable gold-bordered cards. Sidebar summary panel. Navigation: Back (ghost) + Continue (gold). Form fields with gold focus rings. Premium, calm, confidence-inspiring UX.`,

  portfolio: `${BRAND}
Portfolio showcase. Hero: "Our Masterpieces" + filter chips (All, Weddings, Corporate, Concerts). Masonry image grid 9 items with hover overlay showing event name + category. Lightbox-style hover zoom. Stats row below grid. CTA to book consultation.`,

  pricing: `${BRAND}
Pricing page. Hero "Investment in Excellence". 3 tier cards: Silver, Gold (featured/highlighted), Platinum. Each: price range, feature checklist with gold checkmarks, CTA button. FAQ accordion section below. Transparent, premium tone — no cheap vibes.`,

  testimonials: `${BRAND}
Testimonials page. Hero "Voices of Delight". Featured large quote card with 5 gold stars. Grid of 6 client review cards with avatar, name, role, quote. Video testimonial placeholder tile. Trust badges row.`,

  gallery: `${BRAND}
Photo gallery page. Hero "Visual Stories". Category filter tabs. Responsive masonry photo grid 12 images, cinematic event photography. Hover gold frame effect. Load more button.`,

  faqs: `${BRAND}
FAQ page. Hero "Questions Answered". Two-column: left sticky intro + WhatsApp CTA, right accordion FAQ list (10 items: booking, pricing, cancellation, venues, catering, timeline, payments, destination weddings, corporate, customization). Gold expand icons.`,

  blog: `${BRAND}
Blog listing page. Hero "Insights & Inspiration". Featured post large card + grid of 6 article cards (image, category chip, title, excerpt, read time). Newsletter signup band at bottom.`,

  terms: `${BRAND}
Terms of Service legal page. Clean readable typography on dark bg. Sections: Acceptance, Services, Booking, Payment, Cancellation, Liability, IP, Governing Law. Gold section dividers. Professional legal layout.`,

  privacy: `${BRAND}
Privacy Policy page. Sections: Data Collection, Usage, Cookies, Third Parties, Your Rights, Contact. Readable prose, gold accent headings, last updated date.`,

  refund: `${BRAND}
Refund Policy page. Clear sections: Eligibility, Timeline, Process, Non-refundable items, Contact for disputes. Trust-building professional tone with gold accents.`,

  vendors: `${BRAND}
Vendor partners page. Hero "Trusted Partners". Logo grid of vendor categories (Catering, Décor, AV, Photography, Entertainment). Partner cards with rating stars. CTA to join vendor network.`,

  venues: `${BRAND}
Venues page. Hero "Stunning Venues". Filter by capacity and type. Grid of 6 venue cards with image, name, location Pune, capacity, starting price. Map section placeholder.`,
};

/** Matches site header nav: Home About Services Portfolio Venues Vendors Gallery Pricing Blog Contact */
export const STITCH_NAV_ORDER = [
  "services",
  "portfolio",
  "venues",
  "vendors",
  "gallery",
  "pricing",
  "blog",
  "contact",
];

export const STITCH_PAGE_ORDER = [
  ...STITCH_NAV_ORDER,
  "book-event",
  "testimonials",
  "faqs",
  "terms",
  "privacy",
  "refund",
];
