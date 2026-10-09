import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getMediaProvider } from "@/lib/media/providers";
import { MEDIA_CACHE_TAG, LIVE_DRIVE_CACHE_TAG } from "@/lib/media/server";
import { shouldUseLiveDriveSync } from "@/lib/media/live-drive-manifest";
import { rejectCrossSite } from "../../../_lib/auth";
import { isDevAdminBypass, requireAdminSession } from "../_lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const blocked = rejectCrossSite(request);
  if (blocked) return blocked;

  if (!isDevAdminBypass()) {
    const auth = await requireAdminSession();
    if (!auth.ok) return auth.response;
  }

  try {
    const provider = getMediaProvider();
    const manifest = await provider.reindex();
    revalidateTag(MEDIA_CACHE_TAG, "max");
    revalidateTag(LIVE_DRIVE_CACHE_TAG, "max");

    return NextResponse.json({
      ok: true,
      live: shouldUseLiveDriveSync(),
      count: manifest.assets.length,
      videos: manifest.videos.length,
      generatedAt: manifest.generatedAt,
    });
  } catch (err) {
    // Provider errors can include Drive folder ids and API responses; keep them in the logs.
    console.error("[admin/media/reindex]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Reindex failed" }, { status: 500 });
  }
}
