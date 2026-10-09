import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

/**
 * Development seed. Run with `npm run db:seed` from the repo root.
 *
 * Env:
 *   ADMIN_EMAIL      admin login (default admin@nexyyra.com)
 *   ADMIN_PASSWORD   admin password; when unset a random one is generated and
 *                    printed ONCE for a newly created admin (never for an existing one)
 *   SEED_ALLOW_PROD  must be "1" to run with NODE_ENV=production
 *
 * Content here follows the honesty rules in V6-BRIEF.md: no invented history,
 * statistics, venues, vendors or testimonials.
 */

const prisma = new PrismaClient();

function randomPassword(): string {
  // 18 bytes → 24 url-safe chars; satisfies the 8-char minimum with room to spare.
  return randomBytes(18).toString("base64url");
}

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL?.trim() || "admin@nexyyra.com").toLowerCase();
  const providedPassword = process.env.ADMIN_PASSWORD?.trim();
  if (providedPassword && providedPassword.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters");
  }

  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });

  if (existing) {
    if (providedPassword) {
      await prisma.user.update({
        where: { id: existing.id },
        data: { passwordHash: await bcrypt.hash(providedPassword, 12), role: "ADMIN" },
      });
      console.log(`Admin ${email}: password updated from ADMIN_PASSWORD.`);
    } else {
      console.log(`Admin ${email}: already exists, password unchanged.`);
    }
    return;
  }

  const password = providedPassword ?? randomPassword();
  await prisma.user.create({
    data: { email, name: "Admin", passwordHash: await bcrypt.hash(password, 12), role: "ADMIN" },
  });
  console.log(`Admin ${email}: created.`);
  if (!providedPassword) {
    console.log("");
    console.log("  Generated admin password (shown once, not stored anywhere else):");
    console.log(`  ${password}`);
    console.log("");
  }
}

async function seedContent() {
  const existing = await prisma.companyProfile.findFirst();
  if (!existing) {
    await prisma.companyProfile.create({
      data: {
        introduction:
          "Nexyyra Events and Promotions Private Limited designs and produces weddings, destination weddings, corporate events, launches, concerts and exhibitions across India and international destinations.",
        vision: "Creating Experiences That Last Forever.",
        mission:
          "One dedicated event director, an itemised proposal within 48 hours of a free consultation, and production that is planned to the minute.",
        story:
          "Incorporated in 2026 and registered in Telhara, Maharashtra, with delivery and coordination from Pune.",
        // The schema defaults are placeholder marketing numbers; the company has no track record to publish.
        eventsManaged: 0,
        happyClients: 0,
        yearsExperience: 0,
        citiesCovered: 0,
      },
    });
  }

  const services = [
    {
      slug: "wedding-planning",
      title: "Wedding Planning",
      description: "From intimate ceremonies to multi-day celebrations, planned and produced end to end.",
      icon: "Heart",
      image: "/images/services/wedding-planning.jpg",
      features: ["Full planning", "Day-of coordination", "Vendor management"],
      basePrice: 800000,
      order: 1,
    },
    {
      slug: "destination-weddings",
      title: "Destination Weddings",
      description: "Venue scouting, guest logistics and on-site production in India and abroad.",
      icon: "Plane",
      image: "/images/services/destination-weddings.jpg",
      features: ["Venue scouting", "Guest logistics", "Local vendor network"],
      basePrice: 1500000,
      order: 2,
    },
    {
      slug: "corporate-events",
      title: "Corporate Events",
      description: "Conferences, annual days, offsites and launches with brand-true production.",
      icon: "Building2",
      image: "/images/services/corporate-events.jpg",
      features: ["Conference planning", "Annual day events", "Stage and AV"],
      basePrice: 500000,
      order: 3,
    },
    {
      slug: "concert-management",
      title: "Concert Management",
      description: "Artist liaison, staging, sound and crowd flow for live music events.",
      icon: "Music",
      image: "/images/services/concert-management.jpg",
      features: ["Artist liaison", "Stage production", "Permissions and safety"],
      basePrice: 2000000,
      order: 4,
    },
  ];
  for (const s of services) {
    await prisma.service.upsert({ where: { slug: s.slug }, create: s, update: s });
  }

  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    create: { code: "WELCOME10", discountType: "percentage", discountValue: 10, maxUses: 1000, minAmount: 100000 },
    update: {},
  });

  const faqs = [
    {
      question: "How far in advance should I book?",
      answer: "We recommend 6–12 months for weddings and 3–6 months for corporate events, but we also take on shorter timelines.",
      category: "General",
      order: 1,
    },
    {
      question: "Do you handle destination and international events?",
      answer: "Yes. We plan destination weddings and events across India and at international destinations.",
      category: "Services",
      order: 2,
    },
    {
      question: "What payment methods do you accept?",
      answer: "Razorpay, bank transfer and UPI. A 30% advance secures the date; the balance is paid in milestones.",
      category: "Payment",
      order: 3,
    },
  ];
  if ((await prisma.fAQ.count()) === 0) {
    await prisma.fAQ.createMany({ data: faqs });
  }
}

async function main() {
  if (process.env.NODE_ENV === "production" && process.env.SEED_ALLOW_PROD !== "1") {
    throw new Error("Refusing to seed with NODE_ENV=production. Set SEED_ALLOW_PROD=1 to override.");
  }

  console.log("Seeding Nexyyra Events database...");
  await seedAdmin();
  await seedContent();
  console.log("Database seeded.");
}

main()
  .catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
