import { generateSEO, organizationSchema } from "@/lib/seo";
import { HomeView } from "@/brand";

export const metadata = generateSEO({
  title: "Luxury Event Management Company Pune",
  description: "Glitz Events & Promotions — India's premier luxury wedding planner, corporate event organizer, and destination celebration specialist.",
  keywords: ["Wedding Planner Pune", "Corporate Event Planner Pune", "Destination Wedding Planner India", "Luxury Wedding Planner India", "Event Management Company Pune"],
  path: "/",
});

export default function HomePage() {
  const schema = organizationSchema();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <HomeView />
    </>
  );
}
