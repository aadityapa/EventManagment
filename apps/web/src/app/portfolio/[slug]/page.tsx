import { notFound } from "next/navigation";
import { BrandImage } from "@/brand/primitives/brand-image";
import { BRAND_CASE_STUDIES } from "@/brand/data/content";
import { generateSEO, breadcrumbSchema, creativeWorkSchema, faqSchema } from "@/lib/seo";

interface PortfolioCasePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BRAND_CASE_STUDIES.map((cs) => ({ slug: cs.id }));
}

export async function generateMetadata({ params }: PortfolioCasePageProps) {
  const { slug } = await params;
  const cs = BRAND_CASE_STUDIES.find((c) => c.id === slug);
  if (!cs) return generateSEO({ title: "Case Not Found", noIndex: true });
  return generateSEO({ title: cs.title, description: cs.story, path: `/portfolio/${slug}`, image: cs.image });
}

export default async function PortfolioCasePage({ params }: PortfolioCasePageProps) {
  const { slug } = await params;
  const cs = BRAND_CASE_STUDIES.find((c) => c.id === slug);
  if (!cs) notFound();

  const schema = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Portfolio", url: "/portfolio" },
    { name: cs.title, url: `/portfolio/${slug}` },
  ]);
  const workLd = creativeWorkSchema({
    name: cs.title,
    description: cs.story,
    slug,
    image: cs.image,
    location: cs.venue,
    genre: cs.category,
  });
  const caseFaqs = faqSchema([
    {
      question: `What was the scope of the ${cs.title} project?`,
      answer: `${cs.story} Venue: ${cs.venue}. Guests: ${cs.guests}. Investment: ${cs.budget}.`,
    },
    {
      question: `What challenge did Nexyyra solve for ${cs.title}?`,
      answer: cs.challenge,
    },
    {
      question: `What was the outcome of ${cs.title}?`,
      answer: cs.result,
    },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(workLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(caseFaqs) }} />
      <div className="brand-root">
        <section className="relative flex min-h-[70svh] items-end overflow-hidden">
          <BrandImage src={cs.image} alt={`${cs.title} — ${cs.category} by Nexyyra Events`} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="brand-container relative w-full pb-16 pt-32">
            <div className="v5-glass-portal max-w-2xl px-8 py-10">
              <span className="v4-kicker mb-3">{cs.category}</span>
              <h1 className="v4-display text-white">{cs.title}</h1>
              <p className="v4-standfirst mt-4 text-white/80">{cs.story}</p>
              <p className="mt-4 text-sm text-[var(--glitz-gold)]">
                {cs.venue} · {cs.guests} guests · {cs.budget}
              </p>
            </div>
          </div>
        </section>

        <section className="v4-section bg-[var(--glitz-bg)]">
          <div className="brand-container grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="v4-display text-xl">Challenge</h2>
              <p className="mt-4 text-[var(--text-secondary)]">{cs.challenge}</p>
            </div>
            <div>
              <h2 className="v4-display text-xl">Solution</h2>
              <p className="mt-4 text-[var(--text-secondary)]">{cs.solution}</p>
            </div>
            <div className="lg:col-span-2">
              <h2 className="v4-display text-xl">Result</h2>
              <p className="mt-4 text-[var(--text-secondary)]">{cs.result}</p>
              <blockquote className="mt-8 border-l-2 border-[var(--glitz-gold)] pl-6 font-[family-name:var(--font-cormorant)] text-2xl italic">
                &ldquo;{cs.testimonial}&rdquo; — {cs.client}
              </blockquote>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
