import { ServiceIcon } from "@/components/icons";
import { Marquee, SERVICE_GROUPS, type MarqueeItem } from "@/components/ui";
import { services } from "@/data/cms";

/** The twelve services in index order, each with its icon and link — the same information as chapter 01. */
const ITEMS: MarqueeItem[] = SERVICE_GROUPS.flatMap((g) => g.slugs).flatMap((slug) => {
  const service = services.find((s) => s.slug === slug);
  return service ? [{ label: service.title, href: `/services/${slug}`, icon: <ServiceIcon name={slug} size={24} /> }] : [];
});

/** V7: a slow ticker between the cover and the services chapter (decoration only; pausable). */
export function HomeMarquee() {
  return <Marquee items={ITEMS} ariaLabel="Our twelve services" location="home-marquee" />;
}
