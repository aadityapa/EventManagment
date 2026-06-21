import { generateSEO, reviewSchema } from "@/lib/seo";
import { TestimonialsView } from "@/brand";
import { testimonials } from "@/data/cms";

export const metadata = generateSEO({
  title: "Client Testimonials",
  description: "Stories from Nexyyra Events clients — luxury weddings, corporate galas, and product launches across India.",
  path: "/testimonials",
});

export default function TestimonialsPage() {
  const reviewsLd = reviewSchema(
    testimonials.map((t) => ({
      author: t.name,
      reviewBody: t.content,
      ratingValue: t.rating,
    })),
  );

  return (
    <>
      {reviewsLd.map((r, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(r) }} />
      ))}
      <TestimonialsView />
    </>
  );
}
