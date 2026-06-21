import { generateSEO } from "@/lib/seo";
import { BookView } from "@/brand";

export const metadata = generateSEO({ title: "Book Consultation", description: "Book your luxury event consultation with Nexyyra Events.", path: "/book-event" });

export default function BookEventPage() {
  return <BookView />;
}
