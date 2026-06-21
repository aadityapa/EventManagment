import Link from "next/link";
import { MediaUploader } from "@/components/media";

export const metadata = {
  title: "Media Library | Nexyyra Admin",
  robots: { index: false, follow: false },
};

export default function AdminMediaPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--glitz-gold)]">
              Admin
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-playfair)] text-3xl font-semibold">
              Media Library
            </h1>
            <p className="mt-2 text-sm text-muted">
              Upload images to <code className="text-xs">public/images/*</code> — they appear automatically across gallery, portfolio, and services.
            </p>
          </div>
          <Link
            href="/admin"
            className="text-sm font-medium text-[var(--glitz-gold)] hover:underline"
          >
            ← Back to admin
          </Link>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:p-8">
          <MediaUploader />
        </div>

        <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 text-sm text-muted">
          <p className="font-semibold text-[var(--text-primary)]">How it works</p>
          <ul className="mt-3 list-inside list-disc space-y-1.5">
            <li>Drop images into category folders — WebP variants + blur placeholders are generated automatically.</li>
            <li>Optional sidecar: <code className="text-xs">photo.jpg.meta.json</code> with title, alt, category.</li>
            <li>Run <strong>Reindex</strong> after manual FTP/git uploads, or use <code className="text-xs">npm run media:sync</code>.</li>
            <li>Future CMS: set <code className="text-xs">MEDIA_PROVIDER=sanity|strapi|supabase|payload</code>.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
