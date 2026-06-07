import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import { blogPosts } from "@/data/cms";
import { generateSEO, breadcrumbSchema } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

const blogContent: Record<string, string[]> = {
  "destination-wedding-trends-2026": [
    "Destination weddings continue to evolve, and 2026 brings exciting new trends for couples seeking unforgettable celebrations abroad.",
    "Micro-destinations are gaining popularity — intimate gatherings in lesser-known luxury locales like AlUla, Bhutan, and the Azores offer exclusivity without the crowds.",
    "Sustainable luxury is no longer optional. Couples are choosing eco-certified venues, locally sourced florals, and carbon-offset travel packages.",
    "Multi-day experiential itineraries replace traditional reception-only formats. Think welcome dinners, cultural immersions, adventure days, and farewell brunches.",
    "Technology enhances guest experience with AR venue previews, live-streaming for remote guests, and AI-powered seating optimization.",
  ],
  "corporate-event-roi": [
    "Corporate events represent significant investment. Measuring ROI ensures every rupee spent drives tangible business outcomes.",
    "Define clear KPIs before planning: lead generation targets, brand awareness metrics, employee engagement scores, or partnership conversions.",
    "Experiential activations outperform passive presentations. Interactive demos, networking gamification, and immersive brand zones create memorable touchpoints.",
    "Post-event analytics — survey data, social media reach, sales pipeline impact — should inform future event strategy.",
    "Partner with an agency like Glitz Events & Promotions that provides comprehensive post-event reporting and actionable insights.",
  ],
  "sustainable-events-guide": [
    "Luxury and sustainability are not mutually exclusive. Today's premium events embrace eco-conscious practices without compromising experience.",
    "Start with venue selection: choose LEED-certified spaces, outdoor venues powered by renewable energy, or properties with robust sustainability programs.",
    "Reduce waste through digital invitations, reusable decor elements, compostable serviceware, and donation programs for leftover florals and food.",
    "Source locally — regional cuisine, native florals, and local artisans reduce carbon footprint while supporting communities.",
    "Communicate your sustainability efforts to guests. Transparency builds brand trust and inspires others in your industry.",
  ],
};

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return generateSEO({ title: "Post Not Found", noIndex: true });

  return generateSEO({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    image: post.image,
    type: "article",
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const paragraphs = blogContent[slug] ?? [post.excerpt];
  const schema = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.title, url: `/blog/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <article>
        <div className="relative h-[40vh] min-h-[300px] overflow-hidden md:h-[50vh]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>

        <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" asChild className="mb-6">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </Button>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold md:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <div className="mt-4 flex items-center gap-4 text-sm text-muted">
            <span>{post.author}</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(post.publishedAt)}
            </span>
          </div>

          <div className="prose prose-lg mt-10 max-w-none">
            {paragraphs.map((p, i) => (
              <p key={i} className="mb-6 text-muted leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </div>
      </article>
    </>
  );
}
