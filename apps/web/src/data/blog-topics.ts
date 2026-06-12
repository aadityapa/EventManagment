import { EVENT_IMAGES } from "@/lib/images";

export const BLOG_CATEGORIES = [
  "Wedding Planning",
  "Event Budgeting",
  "Corporate Events",
  "Destination Weddings",
  "Venue Selection",
  "Event Trends",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export type BlogTopicTemplate = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  tags: string[];
  readTime: string;
};

const CATEGORY_IMAGES: Record<BlogCategory, string> = {
  "Wedding Planning": EVENT_IMAGES.wedding,
  "Event Budgeting": EVENT_IMAGES.corporate,
  "Corporate Events": EVENT_IMAGES.corporate,
  "Destination Weddings": EVENT_IMAGES.destinationWedding,
  "Venue Selection": EVENT_IMAGES.venue1,
  "Event Trends": EVENT_IMAGES.concert,
};

const TOPIC_SEEDS: Record<BlogCategory, string[]> = {
  "Wedding Planning": [
    "mandap decor trends",
    "sangeet choreography ideas",
    "bridal entry concepts",
    "mehendi ceremony styling",
    "wedding timeline planning",
    "vendor coordination tips",
    "reception stage design",
    "floral arrangement guides",
    "wedding photography briefs",
    "guest experience design",
    "multi-day wedding logistics",
    "heritage venue weddings",
    "intimate wedding planning",
    "luxury wedding budgets",
    "wedding rehearsal checklists",
    "monsoon wedding contingencies",
    "Pune wedding venues",
    "Maharashtra wedding customs",
  ],
  "Event Budgeting": [
    "luxury event cost breakdown",
    "hidden event expenses",
    "vendor negotiation strategies",
    "ROI on corporate events",
    "wedding budget allocation",
    "cost per guest analysis",
    "seasonal pricing insights",
    "payment milestone planning",
    "contingency fund guidelines",
    "decor budget optimization",
    "catering cost management",
    "AV production budgeting",
    "destination wedding costs",
    "corporate gala budgets",
    "exhibition booth economics",
    "celebrity appearance fees",
    "tax and billing for events",
    "value engineering luxury events",
  ],
  "Corporate Events": [
    "annual day planning",
    "product launch strategies",
    "conference attendee engagement",
    "C-suite gala etiquette",
    "team building experiences",
    "award ceremony production",
    "hybrid event formats",
    "corporate gifting trends",
    "brand activation ideas",
    "executive retreat planning",
    "investor day events",
    "town hall production",
    "networking event design",
    "sustainability at corporate events",
    "post-event analytics",
    "MICE event management",
    "Pune corporate venues",
    "tech conference logistics",
  ],
  "Destination Weddings": [
    "Udaipur palace weddings",
    "Goa beach ceremonies",
    "Jaipur heritage venues",
    "guest travel logistics",
    "multi-venue coordination",
    "destination welcome experiences",
    "legal requirements abroad",
    "weather backup planning",
    "international vendor sourcing",
    "cultural integration ideas",
    "micro destination weddings",
    "luxury resort partnerships",
    "destination sangeet nights",
    "virtual guest inclusion",
    "sustainable destination events",
    "Rajasthan wedding routes",
    "Kerala backwater celebrations",
    "Himalayan retreat weddings",
  ],
  "Venue Selection": [
    "ballroom capacity planning",
    "outdoor venue contingencies",
    "heritage property contracts",
    "venue site visit checklists",
    "acoustic considerations",
    "parking and valet planning",
    "catering kitchen requirements",
    "AV infrastructure audit",
    "monsoon-ready venues",
    "beachfront venue permits",
    "convention center comparison",
    "boutique hotel venues",
    "farmhouse event spaces",
    "rooftop celebration venues",
    "venue negotiation tactics",
    "accessibility compliance",
    "Pune luxury venues",
    "Mumbai ballroom guide",
  ],
  "Event Trends": [
    "immersive event technology",
    "AI in event planning",
    "sustainable luxury events",
    "experiential marketing trends",
    "personalized guest journeys",
    "live streaming innovations",
    "celebrity collaboration trends",
    "fashion show production",
    "concert stage design",
    "exhibition interactivity",
    "wellness at corporate retreats",
    "gen-z celebration preferences",
    "metaverse event extensions",
    "zero-waste event design",
    "luxury F&B experiences",
    "lighting design trends",
    "2026 wedding color palettes",
    "Indian luxury event forecast",
  ],
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildExcerpt(category: BlogCategory, topic: string): string {
  return `Expert insights on ${topic} — practical guidance from Glitz Events for luxury ${category.toLowerCase()} in Pune and across India.`;
}

/** 108+ editorial topic templates for blog expansion and category UX */
export function generateBlogTopicTemplates(): BlogTopicTemplate[] {
  const templates: BlogTopicTemplate[] = [];

  for (const category of BLOG_CATEGORIES) {
    for (const seed of TOPIC_SEEDS[category]) {
      const slug = slugify(`${category}-${seed}`);
      templates.push({
        slug,
        title: `${seed.charAt(0).toUpperCase()}${seed.slice(1)} — ${category} Guide`,
        excerpt: buildExcerpt(category, seed),
        category,
        tags: [category.split(" ")[0], "Luxury Events", "Pune"],
        readTime: `${5 + (seed.length % 6)} min`,
      });
    }
  }

  return templates;
}

export const BLOG_TOPIC_TEMPLATES = generateBlogTopicTemplates();

export function getBlogTopicsByCategory(category: BlogCategory | "All"): BlogTopicTemplate[] {
  if (category === "All") return BLOG_TOPIC_TEMPLATES;
  return BLOG_TOPIC_TEMPLATES.filter((t) => t.category === category);
}

export function getCategoryImage(category: BlogCategory): string {
  return CATEGORY_IMAGES[category];
}
