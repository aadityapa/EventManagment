import { generateSEO, faqSchema, speakableWebPageSchema, breadcrumbSchema } from "@/lib/seo";
import { HomeView } from "@/brand";
import { HOME_FAQ_ITEMS } from "@/brand/data/faq";

export const metadata = {
  ...generateSEO({
    description:
      "Nexyyra Events is a luxury event management company in Pune by Nexyyra Events and Promotions Private Limited — weddings, corporate events, celebrations, brand activations and destination events across India.",
    path: "/",
  }),
  // Exact brand-first homepage title — strongest entity/site-name signal for Google.
  title: "Nexyyra Events | Luxury Event Management Company in Pune",
};

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
