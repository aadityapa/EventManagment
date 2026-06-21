import { generateSEO, faqSchema, reviewSchema, speakableWebPageSchema } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import { HomeView } from "@/brand";
import { HOME_FAQ_ITEMS } from "@/brand/data/faq";
import { testimonials } from "@/data/cms";

export const metadata = generateSEO({
  title: "Luxury Experience Architects Pune",
  description: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}. Experience architects crafting extraordinary weddings, corporate experiences, and destination celebrations.`,
  path: "/",
});

export default function HomePage() {
  const homeFaqs = faqSchema(HOME_FAQ_ITEMS.map((f) => ({ question: f.question, answer: f.answer })));
  const homeReviews = reviewSchema(
    testimonials.slice(0, 3).map((t) => ({
      author: t.name,
      reviewBody: t.content,
      ratingValue: t.rating,
    }))
  );
  const speakable = speakableWebPageSchema("/", ["h1", ".brand-label"]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakable) }} />
      {homeReviews.map((r, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(r) }} />
      ))}
      <HomeView />
    </>
  );
}
