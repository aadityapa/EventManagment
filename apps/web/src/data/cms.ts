import { EVENT_IMAGES } from "@/lib/images";

export const companyProfile = {
  introduction:
    "Glitz Events & Promotions is Pune's premier luxury event management company, transforming visions into unforgettable black-tie experiences. With over 12 years of excellence, we've orchestrated 1,800+ events across India — from intimate destination weddings to grand corporate galas, celebrity appearances, and stadium concerts.",
  vision:
    "To be India's most trusted luxury event management brand, setting new standards in creativity, precision, and guest experience.",
  mission:
    "We craft extraordinary moments through meticulous planning, innovative design, and flawless execution — ensuring every event reflects our clients' unique story and exceeds every expectation.",
  story:
    "Founded in Pune, Glitz Events & Promotions began as a boutique wedding and promotions studio. What started with a single dream celebration has evolved into a luxury event powerhouse, trusted by leading brands, celebrities, and discerning families across Maharashtra and beyond.",
  stats: {
    eventsManaged: 1800,
    happyClients: 1400,
    yearsExperience: 12,
    citiesCovered: 35,
  },
};

export const teamMembers = [
  { id: "1", name: "Priya Sharma", role: "Founder & CEO", bio: "15+ years transforming events into legendary experiences.", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80", specialty: "Luxury Weddings" },
  { id: "2", name: "Raj Mehta", role: "Creative Director", bio: "Award-winning designer with a passion for immersive experiences.", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80", specialty: "Brand Events" },
  { id: "3", name: "Ananya Kapoor", role: "Head of Operations", bio: "Ensures flawless execution across every event detail.", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80", specialty: "Corporate Events" },
  { id: "4", name: "Vikram Singh", role: "Technical Director", bio: "Master of stage design, lighting, and production technology.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", specialty: "Concerts & Festivals" },
  { id: "5", name: "Sneha Reddy", role: "Wedding Specialist", bio: "Curates dream destination weddings across the globe.", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80", specialty: "Destination Weddings" },
  { id: "6", name: "Arjun Patel", role: "Client Relations", bio: "Your dedicated partner from first call to final applause.", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80", specialty: "Client Experience" },
];

export const services = [
  { slug: "corporate-events", title: "Corporate Events", description: "Elevate your brand with impeccably planned corporate gatherings, galas, and team celebrations.", icon: "Building2", image: EVENT_IMAGES.corporate, features: ["Conference Planning", "Annual Day Events", "Team Building", "Award Ceremonies"], basePrice: 500000 },
  { slug: "wedding-planning", title: "Wedding Planning", description: "From intimate ceremonies to grand celebrations — every detail crafted with love.", icon: "Heart", image: EVENT_IMAGES.wedding, features: ["Full Planning", "Day-of Coordination", "Vendor Management", "Custom Design"], basePrice: 800000 },
  { slug: "destination-weddings", title: "Destination Weddings", description: "Say 'I do' in paradise. We handle everything from travel to the last dance.", icon: "Plane", image: EVENT_IMAGES.destinationWedding, features: ["International Venues", "Guest Logistics", "Legal Assistance", "Cultural Integration"], basePrice: 1500000 },
  { slug: "birthday-events", title: "Birthday Events", description: "Milestone celebrations that create memories for a lifetime.", icon: "Cake", image: EVENT_IMAGES.birthday, features: ["Theme Parties", "Kids Events", "Milestone Celebrations", "Surprise Planning"], basePrice: 200000 },
  { slug: "product-launches", title: "Product Launches", description: "Make your launch unforgettable with immersive brand experiences.", icon: "Rocket", image: EVENT_IMAGES.productLaunch, features: ["Media Management", "Influencer Outreach", "Stage Design", "Live Streaming"], basePrice: 750000 },
  { slug: "conferences", title: "Conferences", description: "World-class conference management from 50 to 5,000 attendees.", icon: "Users", image: EVENT_IMAGES.conference, features: ["Speaker Management", "Registration", "AV Production", "Networking Events"], basePrice: 600000 },
  { slug: "exhibitions", title: "Exhibitions", description: "Stunning exhibition spaces that captivate and convert.", icon: "LayoutGrid", image: EVENT_IMAGES.exhibition, features: ["Booth Design", "Floor Planning", "Lead Capture", "Setup & Teardown"], basePrice: 400000 },
  { slug: "concert-management", title: "Concert Management", description: "End-to-end concert production from intimate gigs to stadium shows.", icon: "Music", image: EVENT_IMAGES.concert, features: ["Artist Management", "Stage Production", "Ticketing", "Security"], basePrice: 2000000 },
  { slug: "celebrity-management", title: "Celebrity Management", description: "Exclusive celebrity appearances and VIP event experiences.", icon: "Star", image: EVENT_IMAGES.celebrity, features: ["Celebrity Booking", "Red Carpet", "Media Coordination", "VIP Handling"], basePrice: 1000000 },
  { slug: "brand-promotions", title: "Brand Promotions", description: "Experiential marketing that creates buzz and drives engagement.", icon: "Megaphone", image: EVENT_IMAGES.brandPromotion, features: ["Activations", "Pop-up Events", "Sampling Campaigns", "Social Media"], basePrice: 350000 },
  { slug: "fashion-shows", title: "Fashion Shows", description: "Runway productions that showcase style with sophistication.", icon: "Shirt", image: EVENT_IMAGES.fashionShow, features: ["Runway Design", "Model Coordination", "Backstage Management", "Press Events"], basePrice: 900000 },
  { slug: "event-production", title: "Event Production", description: "Complete technical production — lighting, sound, staging, and more.", icon: "Clapperboard", image: EVENT_IMAGES.concert, features: ["Stage Design", "Lighting", "Sound Engineering", "Special Effects"], basePrice: 500000 },
];

export const testimonials = [
  { id: "1", name: "Aisha & Rahul", role: "Wedding Clients", content: "Glitz Events made our destination wedding in Udaipur absolutely magical. Every detail was perfect — from the floral arrangements to the surprise fireworks finale.", rating: 5, image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80", eventType: "WEDDING" },
  { id: "2", name: "Vikram Malhotra", role: "CEO, TechCorp India", content: "Our annual conference for 2,000 attendees was flawlessly executed. Glitz's team handled everything with military precision.", rating: 5, image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80", eventType: "CORPORATE" },
  { id: "3", name: "Natasha Fernandes", role: "Marketing Director", content: "The product launch event generated 50M+ social media impressions. Glitz understands how to create buzz.", rating: 5, image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80", eventType: "PRODUCT_LAUNCH" },
  { id: "4", name: "The Kapoor Family", role: "Birthday Celebration", content: "Our daughter's 18th birthday was the talk of the town. The theme, entertainment, and food were all extraordinary.", rating: 5, image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80", eventType: "BIRTHDAY" },
  { id: "5", name: "Global Finance Summit", role: "Conference Organizer", content: "Managing 5,000 delegates across 3 days with zero hiccups. Glitz Events is simply the best in the business.", rating: 5, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80", eventType: "CONFERENCE" },
];

export const awards = [
  { title: "Best Event Management Company", organization: "Event Industry Awards India", year: 2025 },
  { title: "Luxury Wedding Planner of the Year", organization: "Wedding Sutra", year: 2024 },
  { title: "Excellence in Corporate Events", organization: "MICE India", year: 2024 },
  { title: "Innovation in Event Technology", organization: "Event Tech Summit", year: 2023 },
];

export const partners = [
  "Taj Hotels", "Marriott", "ITC Hotels", "Oberoi", "Hyatt",
  "Sony Music", "Zee Entertainment", "Star India", "Netflix India",
  "Tata Group", "Reliance", "Aditya Birla Group", "Mahindra",
];

export const venues = [
  { id: "1", name: "The Grand Ballroom", slug: "grand-ballroom-mumbai", city: "Mumbai", capacity: 800, pricePerDay: 500000, rating: 4.9, images: [EVENT_IMAGES.venue1], amenities: ["AC", "Parking", "Catering Kitchen", "AV Equipment"], description: "Luxurious ballroom in the heart of Mumbai with crystal chandeliers and premium amenities." },
  { id: "2", name: "Royal Garden Estate", slug: "royal-garden-delhi", city: "Delhi", capacity: 1500, pricePerDay: 750000, rating: 4.8, images: [EVENT_IMAGES.venue2], amenities: ["Garden", "Pool", "Bridal Suite", "Valet"], description: "Sprawling garden estate perfect for grand weddings and outdoor celebrations." },
  { id: "3", name: "Skyline Convention Center", slug: "skyline-bangalore", city: "Bangalore", capacity: 2000, pricePerDay: 600000, rating: 4.7, images: [EVENT_IMAGES.venue3], amenities: ["Multiple Halls", "Business Center", "High-Speed WiFi", "Translation Booths"], description: "State-of-the-art convention center for conferences and corporate events." },
  { id: "4", name: "Beachfront Paradise", slug: "beachfront-goa", city: "Goa", capacity: 500, pricePerDay: 900000, rating: 4.9, images: [EVENT_IMAGES.venue4], amenities: ["Beach Access", "Sunset Deck", "Spa", "Water Sports"], description: "Exclusive beachfront venue for destination weddings and luxury retreats." },
];

export const vendors = [
  { id: "1", businessName: "Lens & Light Studio", slug: "lens-light-studio", category: "Photographers", city: "Mumbai", rating: 4.9, priceRange: "₹1-3 Lakhs", verified: true, images: ["https://images.unsplash.com/photo-1554048612-b6a482b17f66?w=400&q=80"] },
  { id: "2", businessName: "Bloom & Blossom Decor", slug: "bloom-blossom", category: "Decorators", city: "Delhi", rating: 4.8, priceRange: "₹2-8 Lakhs", verified: true, images: ["https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80"] },
  { id: "3", businessName: "Gourmet Affairs", slug: "gourmet-affairs", category: "Caterers", city: "Mumbai", rating: 4.9, priceRange: "₹800-1500/person", verified: true, images: ["https://images.unsplash.com/photo-1555244162-803834f70033?w=400&q=80"] },
  { id: "4", businessName: "Beat Masters DJ", slug: "beat-masters", category: "DJs", city: "Bangalore", rating: 4.7, priceRange: "₹30K-1 Lakh", verified: true, images: ["https://images.unsplash.com/photo-1571266028243-e68f8570c9e2?w=400&q=80"] },
  { id: "5", businessName: "Harmony Live Band", slug: "harmony-band", category: "Bands", city: "Mumbai", rating: 4.8, priceRange: "₹1-5 Lakhs", verified: true, images: ["https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80"] },
  { id: "6", businessName: "Glam Studio", slug: "glam-studio", category: "Makeup Artists", city: "Delhi", rating: 4.9, priceRange: "₹25K-1 Lakh", verified: true, images: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80"] },
];

export const portfolioItems = [
  { id: "1", title: "TechCorp Annual Gala", slug: "techcorp-gala", eventType: "CORPORATE", image: EVENT_IMAGES.corporate, location: "Mumbai", guestCount: 1500, description: "A stunning black-tie gala celebrating 25 years of innovation." },
  { id: "2", title: "Royal Udaipur Wedding", slug: "royal-udaipur-wedding", eventType: "WEDDING", image: EVENT_IMAGES.wedding, location: "Udaipur", guestCount: 800, description: "A 5-day destination wedding at a heritage palace." },
  { id: "3", title: "Sunset Beach Wedding", slug: "sunset-beach-wedding", eventType: "DESTINATION_WEDDING", image: EVENT_IMAGES.destinationWedding, location: "Goa", guestCount: 200, description: "Intimate beachfront ceremony at golden hour." },
  { id: "4", title: "Music Fest 2025", slug: "music-fest-2025", eventType: "CONCERT", image: EVENT_IMAGES.concert, location: "Bangalore", guestCount: 10000, description: "3-day music festival featuring 50+ artists." },
  { id: "5", title: "Fashion Week Finale", slug: "fashion-week", eventType: "FASHION_SHOW", image: EVENT_IMAGES.fashionShow, location: "Mumbai", guestCount: 500, description: "Closing show for India's premier fashion week." },
  { id: "6", title: "Product X Launch", slug: "product-x-launch", eventType: "PRODUCT_LAUNCH", image: EVENT_IMAGES.productLaunch, location: "Delhi", guestCount: 300, description: "Immersive launch experience with holographic displays." },
];

export { GLITZ_FAQS as faqs } from "@/brand/data/faq";

export const blogPosts = [
  { slug: "destination-wedding-trends-2026", title: "Top Destination Wedding Trends for 2026", excerpt: "Discover the hottest destination wedding trends shaping luxury celebrations this year.", image: EVENT_IMAGES.destinationWedding, author: "Sneha Reddy", tags: ["Weddings", "Trends"], category: "Weddings", publishedAt: "2026-05-15", readTime: "8 min" },
  { slug: "corporate-event-roi", title: "Maximizing ROI on Corporate Events", excerpt: "Learn how to measure and maximize return on investment for your corporate events.", image: EVENT_IMAGES.corporate, author: "Raj Mehta", tags: ["Corporate", "Strategy"], category: "Corporate", publishedAt: "2026-05-01", readTime: "6 min" },
  { slug: "sustainable-events-guide", title: "The Complete Guide to Sustainable Events", excerpt: "How to plan eco-friendly events without compromising on luxury and experience.", image: EVENT_IMAGES.conference, author: "Ananya Kapoor", tags: ["Sustainability", "Planning"], category: "Planning", publishedAt: "2026-04-20", readTime: "10 min" },
  { slug: "wedding-planner-pune-guide", title: "How to Choose a Wedding Planner in Pune", excerpt: "A definitive guide to selecting the right luxury wedding planner in Pune — questions to ask, red flags, and what premium service looks like.", image: EVENT_IMAGES.wedding, author: "Priya Sharma", tags: ["Weddings", "Pune", "Guide"], category: "Weddings", publishedAt: "2026-04-01", readTime: "7 min" },
  { slug: "corporate-gala-planning-checklist", title: "Corporate Gala Planning Checklist for 2026", excerpt: "Step-by-step checklist for planning a flawless corporate gala — from venue selection to post-event analytics.", image: EVENT_IMAGES.corporate, author: "Ananya Kapoor", tags: ["Corporate", "Checklist"], category: "Corporate", publishedAt: "2026-03-15", readTime: "9 min" },
  { slug: "exhibition-booth-design-tips", title: "10 Exhibition Booth Design Tips That Convert", excerpt: "Trade show booth design strategies that attract footfall, capture leads, and maximise ROI at Pune exhibitions.", image: EVENT_IMAGES.exhibition, author: "Raj Mehta", tags: ["Exhibitions", "Design"], category: "Exhibitions", publishedAt: "2026-03-01", readTime: "5 min" },
  { slug: "luxury-birthday-celebration-ideas", title: "Luxury Birthday Celebration Ideas in Maharashtra", excerpt: "Milestone birthday party concepts — from intimate dinner soirées to themed extravaganzas with celebrity entertainment.", image: EVENT_IMAGES.birthday, author: "Sneha Reddy", tags: ["Celebrations", "Luxury"], category: "Celebrations", publishedAt: "2026-02-20", readTime: "6 min" },
  { slug: "concert-production-pune", title: "Concert Production in Pune: What Goes Into a Stadium Show", excerpt: "Behind the scenes of large-scale concert management — artist logistics, stage design, security, and crowd flow.", image: EVENT_IMAGES.concert, author: "Vikram Singh", tags: ["Concerts", "Production"], category: "Entertainment", publishedAt: "2026-02-01", readTime: "11 min" },
];

export { BLOG_CATEGORIES, BLOG_TOPIC_TEMPLATES } from "@/data/blog-topics";

export const pricingPlans = [
  { name: "Essential", price: 300000, description: "Perfect for intimate gatherings", features: ["Event consultation", "Vendor recommendations", "Day-of coordination", "Basic decor guidance", "Timeline management"], popular: false },
  { name: "Premium", price: 800000, description: "Our most popular package", features: ["Full event planning", "Custom design & decor", "Vendor management", "Guest coordination", "Rehearsal management", "Premium support"], popular: true },
  { name: "Luxury", price: 2000000, description: "The ultimate experience", features: ["Dedicated event director", "Bespoke design concept", "Celebrity vendor access", "International coordination", "VIP guest management", "Post-event analytics", "24/7 concierge"], popular: false },
];
