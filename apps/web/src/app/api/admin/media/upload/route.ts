import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getMediaProvider } from "@/lib/media/providers";
import { MEDIA_IMAGE_FOLDERS, type MediaCategory, type MediaImageFolder } from "@/lib/media/types";
import { MEDIA_CACHE_TAG } from "@/lib/media/server";
import { isDevAdminBypass, requireAdminSession } from "../_lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseFolder(value: FormDataEntryValue | null): MediaImageFolder {
  const folder = String(value ?? "gallery");
  return MEDIA_IMAGE_FOLDERS.includes(folder as MediaImageFolder)
    ? (folder as MediaImageFolder)
    : "gallery";
}

export async function POST(request: NextRequest) {
  if (!isDevAdminBypass()) {
    const auth = await requireAdminSession();
    if (!auth.ok) return auth.response;
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const folder = parseFolder(form.get("folder"));
    const category = form.get("category") as MediaCategory | null;
    const title = form.get("title")?.toString();
    const alt = form.get("alt")?.toString();
    const featured = form.get("featured") === "true";

    const provider = getMediaProvider();
    const asset = await provider.upload(buffer, file.name, {
      folder,
      category: category ?? undefined,
      title: title || undefined,
      alt: alt || undefined,
      featured,
    });

    revalidateTag(MEDIA_CACHE_TAG, "max");

    return NextResponse.json({ ok: true, asset }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
