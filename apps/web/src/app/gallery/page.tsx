import Image from "next/image";
import { generateSEO } from "@/lib/seo";
import { EVENT_IMAGES } from "@/lib/images";
import { PageHero } from "@/components/shared/page-hero";

export const metadata = generateSEO({
  title: "Gallery",
  description: "Browse our stunning event gallery — weddings, corporate events, concerts, and more.",
  path: "/gallery",
});

export default function GalleryPage() {
  return (
    <>
      <PageHero
        title="Event Gallery"
        subtitle="A visual journey through our most memorable celebrations"
      />
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
            {EVENT_IMAGES.gallery.map((src, i) => (
              <div
                key={src}
                className="mb-4 break-inside-avoid overflow-hidden rounded-xl"
              >
                <Image
                  src={src}
                  alt={`Event gallery image ${i + 1}`}
                  width={600}
                  height={i % 3 === 0 ? 800 : i % 3 === 1 ? 500 : 650}
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
