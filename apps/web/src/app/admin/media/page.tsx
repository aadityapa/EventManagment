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
              Photos are managed on{" "}
              <a
                href="https://drive.google.com/drive/folders/1UZR_UhiZfVvcLUNvDJi3Rvw8udkfKgYM?usp=sharing"
                className="text-[var(--glitz-gold)] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Drive
              </a>
              . Run <code className="text-xs">npm run media:sync</code> after uploading, then redeploy.
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
            <li>Upload JPG/PNG/WebP into the shared Drive folder using subfolders: hero, weddings, venues, gallery, etc.</li>
            <li>Share the folder as &quot;Anyone with the link can view&quot; (or share with your service account).</li>
            <li>Run <code className="text-xs">npm run media:sync</code> locally, commit the updated manifest, and redeploy.</li>
            <li>Set <code className="text-xs">MEDIA_PROVIDER=google-drive</code> and <code className="text-xs">GOOGLE_DRIVE_API_KEY</code> on Vercel.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
