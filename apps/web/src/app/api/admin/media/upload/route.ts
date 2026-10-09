import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getMediaProvider } from "@/lib/media/providers";
import { MEDIA_IMAGE_FOLDERS, type MediaCategory, type MediaImageFolder } from "@/lib/media/types";
import { MEDIA_CACHE_TAG } from "@/lib/media/server";
import { isMediaReadonly } from "@/lib/media/runtime";
import { rejectCrossSite } from "../../../_lib/auth";
import { isDevAdminBypass, requireAdminSession } from "../_lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);

function parseFolder(value: FormDataEntryValue | null): MediaImageFolder {
  const folder = String(value ?? "gallery");
  return MEDIA_IMAGE_FOLDERS.includes(folder as MediaImageFolder)
    ? (folder as MediaImageFolder)
    : "gallery";
}

function textField(form: FormData, name: string, max: number): string | undefined {
  const value = form.get(name);
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim().slice(0, max);
  return trimmed || undefined;
}

export async function POST(request: NextRequest) {
  const blocked = rejectCrossSite(request);
  if (blocked) return blocked;

  if (!isDevAdminBypass()) {
    const auth = await requireAdminSession();
    if (!auth.ok) return auth.response;
  }

  if (isMediaReadonly()) {
    return NextResponse.json(
      {
        error: "Upload is disabled in production. Add images to public/images locally, run media:sync, commit, and redeploy.",
      },
      { status: 503 }
    );
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Only JPEG, PNG, WebP, AVIF or GIF images are accepted" }, { status: 400 });
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "Image must be 15 MB or smaller" }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const folder = parseFolder(form.get("folder"));
    const category = textField(form, "category", 60) as MediaCategory | undefined;
    const title = textField(form, "title", 200);
    const alt = textField(form, "alt", 300);
    const featured = form.get("featured") === "true";

    const provider = getMediaProvider();
    const asset = await provider.upload(buffer, file.name, {
      folder,
      category,
      title,
      alt,
      featured,
    });

    revalidateTag(MEDIA_CACHE_TAG, "max");

    return NextResponse.json({ ok: true, asset }, { status: 201 });
  } catch (err) {
    console.error("[admin/media/upload]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
