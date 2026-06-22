import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import {
  fetchLiveDriveManifestUncached,
  LIVE_DRIVE_CACHE_TAG,
  shouldUseLiveDriveSync,
} from "@/lib/media/live-drive-manifest";
import { MEDIA_CACHE_TAG } from "@/lib/media/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Vercel Cron — refresh Google Drive media cache every few minutes. */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (!shouldUseLiveDriveSync()) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: "MEDIA_LIVE_SYNC disabled or Google Drive not configured",
    });
  }

  try {
    revalidateTag(LIVE_DRIVE_CACHE_TAG, "max");
    revalidateTag(MEDIA_CACHE_TAG, "max");

    const manifest = await fetchLiveDriveManifestUncached();

    return NextResponse.json({
      ok: true,
      images: manifest.assets.length,
      generatedAt: manifest.generatedAt,
      provider: manifest.provider,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Cron media sync failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
