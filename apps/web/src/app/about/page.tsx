import Image from "next/image";
import { Award } from "lucide-react";
import {
  companyProfile,
  teamMembers,
  awards,
  partners,
} from "@/data/cms";
import { EVENT_IMAGES } from "@/lib/images";
import { generateSEO } from "@/lib/seo";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = generateSEO({
  title: "About Us",
  description:
    "Learn about Glitz Events & Promotions — 15+ years of luxury event management excellence, our vision, mission, and award-winning team.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Glitz Events & Promotions"
        subtitle="Transforming visions into unforgettable experiences since 2010"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading
                align="left"
                eyebrow="Who We Are"
                title="Premier International Event Management"
                description={companyProfile.introduction}
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={EVENT_IMAGES.about}
                alt="Glitz Events & Promotions team at work"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary/5 py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: "Our Vision", content: companyProfile.vision },
              { title: "Our Mission", content: companyProfile.mission },
              { title: "Our Story", content: companyProfile.story },
            ].map((card) => (
              <Card key={card.title}>
                <CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted">{card.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Team"
            title="Meet the Experts"
            description="Passionate professionals dedicated to crafting extraordinary events."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <Card key={member.id} className="overflow-hidden">
                <div className="relative h-56">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{member.name}</CardTitle>
                  <p className="text-sm text-primary">{member.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted">{member.bio}</p>
                  <p className="mt-2 text-xs text-muted">Specialty: {member.specialty}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/5 py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Recognition" title="Awards & Accolades" />
          <div className="grid gap-4 sm:grid-cols-2">
            {awards.map((award) => (
              <div key={award.title} className="glass-card flex items-start gap-4 p-5">
                <Award className="h-8 w-8 shrink-0 text-primary" />
                <div>
                  <h3 className="font-semibold">{award.title}</h3>
                  <p className="text-sm text-muted">
                    {award.organization} · {award.year}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Partners"
            title="Trusted by Industry Leaders"
          />
          <div className="flex flex-wrap justify-center gap-4">
            {partners.map((partner) => (
              <span
                key={partner}
                className="glass-card px-6 py-3 text-sm font-medium"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
