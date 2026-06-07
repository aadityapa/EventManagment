import { generateSEO } from "@/lib/seo";
import { PageHero } from "@/components/shared/page-hero";
import { PortfolioGrid } from "@/components/portfolio/portfolio-grid";

export const metadata = generateSEO({
  title: "Portfolio",
  description:
    "Explore JIJU Events portfolio — luxury weddings, corporate galas, concerts, and more.",
  path: "/portfolio",
});

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        title="Our Portfolio"
        subtitle="Extraordinary events we've brought to life across the globe"
      />
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PortfolioGrid />
        </div>
      </section>
    </>
  );
}
