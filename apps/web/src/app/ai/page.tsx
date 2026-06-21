import { generateSEO } from "@/lib/seo";
import { AiExperienceView } from "@/brand/views/ai-experience-view";

export const metadata = generateSEO({
  title: "AI Experience Hub",
  description: "AI Event Architect, budget planner, venue recommender, vendor matching, and timeline generator for luxury events in India.",
  path: "/ai",
});

export default function AiPage() {
  return <AiExperienceView />;
}
