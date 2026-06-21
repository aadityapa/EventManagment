import { generateSEO, faqSchema, reviewSchema, speakableWebPageSchema, eventPlanningServiceSchema, breadcrumbSchema } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import { HomeView } from "@/brand";
import { HOME_FAQ_ITEMS } from "@/brand/data/faq";
import { testimonials } from "@/data/cms";

export const metadata = generateSEO({
  title: "Luxury Event Planner Pune",
  description:
    "Nexyyra — luxury experience architects in Pune. Weddings, corporate galas, destination celebrations, and concerts across India since 2012.",
  path: "/",
});

export default function HomePage() {
  const homeFaqs = faqSchema(HOME_FAQ_ITEMS.map((f) => ({ question: f.question, answer: f.answer })));
  const eventPlanning = eventPlanningServiceSchema();
  const breadcrumbs = breadcrumbSchema([{ name: "Home", url: "/" }]);
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventPlanning) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakable) }} />
      {homeReviews.map((r, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(r) }} />
      ))}
      <HomeView />
    </>
  );
}
