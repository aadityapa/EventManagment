import { generateSEO, faqSchema, speakableWebPageSchema, breadcrumbSchema } from "@/lib/seo";
import { HomeView } from "@/brand";
import { HOME_FAQ_ITEMS } from "@/brand/data/faq";

export const metadata = generateSEO({
  title: "Luxury Event Planner Pune",
  description:
    "Nexyyra — luxury experience architects in Pune. Weddings, corporate galas, destination celebrations, and concerts across India since 2012.",
  path: "/",
});

export default function HomePage() {
  const homeFaqs = faqSchema(HOME_FAQ_ITEMS.map((f) => ({ question: f.question, answer: f.answer })));
  const breadcrumbs = breadcrumbSchema([{ name: "Home", url: "/" }]);
  const speakable = speakableWebPageSchema("/", ["h1", ".brand-label"]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakable) }} />
      <HomeView />
    </>
  );
}
