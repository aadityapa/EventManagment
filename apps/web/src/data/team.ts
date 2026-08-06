/**
 * Nexyyra leadership team — single source of truth.
 * Consumed by the About page team section and Person schema markup.
 */

export interface TeamMember {
  slug: string;
  name: string;
  /** Public designation shown on the card and in schema. */
  role: string;
  bio: string;
  responsibilities: string[];
  /** Monogram fallback when no photo is provided. */
  initials: string;
  /** Optional profile photo (1:1). Falls back to gold monogram. */
  image?: string;
  linkedin?: string;
  email?: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    slug: "yash-bajaj",
    name: "Yash Bajaj",
    role: "Founder & Managing Director",
    bio: "Yash Bajaj leads Nexyyra Events with a vision to create unforgettable celebrations through exceptional planning, operational excellence, and customer satisfaction.",
    responsibilities: ["Business Strategy", "Event Operations", "Client Relations", "Overall Management"],
    initials: "YB",
    linkedin: "https://linkedin.com/company/nexyyraevents",
    email: "Info.Events@nexyyra.com",
  },
  {
    slug: "aaditya-padiya",
    name: "Aaditya Padiya",
    role: "Founder & Chief Technology Officer",
    bio: "Aaditya Padiya drives the company's technology ecosystem, digital transformation, AI-powered solutions, and innovative event management systems.",
    responsibilities: ["Technology Strategy", "Website Development", "Automation", "Digital Innovation", "Technical Operations"],
    initials: "AP",
    linkedin: "https://linkedin.com/company/nexyyraevents",
    email: "Info.Events@nexyyra.com",
  },
  {
    slug: "amey-korde",
    name: "Amey Korde",
    role: "Founder & Chief Marketing Officer",
    bio: "Amey Korde leads branding, marketing campaigns, and business development while building lasting relationships with clients and partners.",
    responsibilities: ["Marketing Strategy", "Brand Development", "Business Growth", "Client Acquisition", "Digital Marketing"],
    initials: "AK",
    linkedin: "https://linkedin.com/company/nexyyraevents",
    email: "Info.Events@nexyyra.com",
  },
  {
    slug: "bharti-jadhav",
    name: "Bharti Jadhav",
    role: "Head — Decoration Department",
    bio: "Bharti Jadhav specializes in transforming venues into stunning event experiences with elegant themes and creative décor concepts.",
    responsibilities: ["Event Decoration", "Theme Planning", "Floral Design", "Venue Styling", "Creative Execution"],
    initials: "BJ",
    linkedin: "https://linkedin.com/company/nexyyraevents",
    email: "Info.Events@nexyyra.com",
  },
  {
    slug: "radhika-bajaj",
    name: "Radhika Bajaj",
    role: "Data & Administration Manager",
    bio: "Radhika Bajaj ensures smooth administrative operations, accurate documentation, and efficient coordination across every event.",
    responsibilities: ["Data Management", "Documentation", "Event Coordination", "Administrative Operations"],
    initials: "RB",
    linkedin: "https://linkedin.com/company/nexyyraevents",
    email: "Info.Events@nexyyra.com",
  },
  {
    slug: "shilpa-sharma",
    name: "Shilpa Sharma",
    role: "Finance & Accounts Manager",
    bio: "Shilpa Sharma manages the company's financial operations, budgeting, accounting, and ensures strong financial discipline.",
    responsibilities: ["Financial Planning", "Budget Management", "Vendor Payments", "Accounts", "Compliance"],
    initials: "SS",
    linkedin: "https://linkedin.com/company/nexyyraevents",
    email: "Info.Events@nexyyra.com",
  },
];
