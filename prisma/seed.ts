import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const EVENT_IMAGES = {
  corporate: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
  wedding: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
  destinationWedding: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80",
  concert: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
  conference: "https://images.unsplash.com/photo-1505373877841-8d25f39c466e?w=800&q=80",
  fashionShow: "https://images.unsplash.com/photo-1558171813-4c088753a089?w=800&q=80",
  venue1: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
  venue2: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
};

async function main() {
  console.log("🌱 Seeding Nexyyra Events database...\n");

  const existing = await prisma.companyProfile.findFirst();
  if (!existing) {
    await prisma.companyProfile.create({
      data: {
        introduction: "Nexyyra Events is a premier international event management company.",
        vision: "To redefine luxury event experiences worldwide.",
        mission: "Creating unforgettable moments through exceptional planning and execution.",
        story: "Founded in 2010, Nexyyra Events has grown to become a trusted name in premium event management.",
        eventsManaged: 2500,
        happyClients: 1800,
        yearsExperience: 15,
        citiesCovered: 45,
      },
    });
  }

  const adminHash = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@nexyyraevents.in" },
    create: { email: "admin@nexyyraevents.in", name: "Admin", passwordHash: adminHash, role: "ADMIN" },
    update: {},
  });

  const services = [
    { slug: "corporate-events", title: "Corporate Events", description: "Elevate your brand with impeccably planned corporate gatherings.", icon: "Building2", image: EVENT_IMAGES.corporate, features: ["Conference Planning", "Annual Day Events"], basePrice: 500000, order: 1 },
    { slug: "wedding-planning", title: "Wedding Planning", description: "From intimate ceremonies to grand celebrations.", icon: "Heart", image: EVENT_IMAGES.wedding, features: ["Full Planning", "Day-of Coordination"], basePrice: 800000, order: 2 },
    { slug: "destination-weddings", title: "Destination Weddings", description: "Say I do in paradise.", icon: "Plane", image: EVENT_IMAGES.destinationWedding, features: ["International Venues", "Guest Logistics"], basePrice: 1500000, order: 3 },
    { slug: "concert-management", title: "Concert Management", description: "End-to-end concert production.", icon: "Music", image: EVENT_IMAGES.concert, features: ["Artist Management", "Stage Production"], basePrice: 2000000, order: 4 },
  ];

  for (const s of services) {
    await prisma.service.upsert({ where: { slug: s.slug }, create: s, update: s });
  }

  const venues = [
    { name: "The Grand Ballroom", slug: "grand-ballroom-mumbai", description: "Luxurious ballroom in Mumbai.", city: "Mumbai", state: "Maharashtra", address: "BKC, Mumbai", capacity: 800, pricePerDay: 500000, images: [EVENT_IMAGES.venue1], amenities: ["AC", "Parking", "AV Equipment"], rating: 4.9, featured: true },
    { name: "Royal Garden Estate", slug: "royal-garden-delhi", description: "Sprawling garden estate.", city: "Delhi", state: "Delhi", address: "Mehrauli, Delhi", capacity: 1500, pricePerDay: 750000, images: [EVENT_IMAGES.venue2], amenities: ["Garden", "Pool", "Valet"], rating: 4.8, featured: true },
  ];

  for (const v of venues) {
    await prisma.venue.upsert({ where: { slug: v.slug }, create: v, update: v });
  }

  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    create: { code: "WELCOME10", discountType: "percentage", discountValue: 10, maxUses: 1000 },
    update: {},
  });

  const faqs = [
    { question: "How far in advance should I book?", answer: "We recommend 6-12 months for weddings and 3-6 months for corporate events.", category: "General", order: 1 },
    { question: "Do you handle international events?", answer: "Yes! We've managed events in 45+ cities worldwide.", category: "Services", order: 2 },
    { question: "What payment methods do you accept?", answer: "Razorpay, Stripe, PayPal, bank transfers, and UPI.", category: "Payment", order: 3 },
  ];

  for (const faq of faqs) {
    await prisma.fAQ.create({ data: faq }).catch(() => {});
  }

  console.log("✅ Database seeded successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
