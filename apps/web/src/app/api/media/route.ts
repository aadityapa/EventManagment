import { NextRequest, NextResponse } from "next/server";
import { getMediaProvider } from "@/lib/media/providers";
import { isMediaReadonly } from "@/lib/media/runtime";
import type { MediaQuery } from "@/lib/media/types";
import { MEDIA_IMAGE_FOLDERS, MEDIA_CATEGORIES } from "@/lib/media/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const folderParam = searchParams.get("folder");
    const categoryParam = searchParams.get("category");
    const limitParam = searchParams.get("limit");
    const typeParam = searchParams.get("type");
    const force = searchParams.get("force") === "1";

    const provider = getMediaProvider();
    if (force) {
      if (isMediaReadonly()) {
        return NextResponse.json(
          { error: "Force reindex is disabled in production." },
          { status: 503 }
        );
      }
      await provider.reindex();
    }

    const query: MediaQuery = {};

    if (folderParam) {
      const folders = folderParam.split(",").filter((f) =>
        MEDIA_IMAGE_FOLDERS.includes(f as never)
      );
      if (folders.length === 1) query.folder = folders[0] as MediaQuery["folder"];
      else if (folders.length > 1) query.folder = folders as MediaQuery["folder"];
    }

    if (categoryParam) {
      const cats = categoryParam.split(",").filter((c) =>
        MEDIA_CATEGORIES.includes(c as never)
      );
      if (cats.length === 1) query.category = cats[0] as MediaQuery["category"];
      else if (cats.length > 1) query.category = cats as MediaQuery["category"];
    }

    if (limitParam) query.limit = Math.min(parseInt(limitParam, 10) || 24, 100);
    if (typeParam === "image" || typeParam === "video") query.type = typeParam;

    const [assets, videos, manifest] = await Promise.all([
      provider.query(query),
      provider.getVideos(),
      provider.getManifest(),
    ]);

    return NextResponse.json({
      assets,
      videos,
      meta: {
        generatedAt: manifest.generatedAt,
        provider: manifest.provider,
        total: manifest.assets.length,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load media";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
