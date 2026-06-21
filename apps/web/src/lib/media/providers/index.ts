import type {
  MediaAsset,
  MediaManifest,
  MediaProvider,
  MediaQuery,
  MediaUploadInput,
  MediaVideoAsset,
} from "../types";
import { getOrRebuildManifest, refreshMediaManifest } from "../manifest-io";

function matchesQuery(asset: MediaAsset, query?: MediaQuery): boolean {
  if (!query) return true;
  if (query.type && asset.type !== query.type) return false;
  if (query.featured !== undefined && !!asset.featured !== query.featured) return false;

  if (query.folder) {
    const folders = Array.isArray(query.folder) ? query.folder : [query.folder];
    if (!folders.includes(asset.folder as never)) return false;
  }

  if (query.category) {
    const cats = Array.isArray(query.category) ? query.category : [query.category];
    if (!cats.includes(asset.category)) return false;
  }

  return true;
}

export class FilesystemMediaProvider implements MediaProvider {
  readonly name = "filesystem";

  async getManifest(): Promise<MediaManifest> {
    return getOrRebuildManifest();
  }

  async query(query?: MediaQuery): Promise<MediaAsset[]> {
    const manifest = await this.getManifest();
    let results = manifest.assets.filter((a) => matchesQuery(a, query));
    if (query?.limit) results = results.slice(0, query.limit);
    return results;
  }

  async getVideos(): Promise<MediaVideoAsset[]> {
    const manifest = await this.getManifest();
    return manifest.videos;
  }

  async upload(file: Buffer, filename: string, input: MediaUploadInput): Promise<MediaAsset> {
    const { uploadMediaFile } = await import("../manifest-service");
    return uploadMediaFile(file, filename, input);
  }

  async reindex(): Promise<MediaManifest> {
    return refreshMediaManifest();
  }
}

/** CMS provider stubs — swap via getMediaProvider() */
export class SanityMediaProvider implements MediaProvider {
  readonly name = "sanity";
  async getManifest(): Promise<MediaManifest> {
    throw new Error("SanityMediaProvider: set SANITY_PROJECT_ID and implement fetch");
  }
  async query(): Promise<MediaAsset[]> {
    throw new Error("SanityMediaProvider not configured");
  }
  async getVideos(): Promise<MediaVideoAsset[]> {
    return [];
  }
  async upload(): Promise<MediaAsset> {
    throw new Error("SanityMediaProvider: use Sanity Studio for uploads");
  }
  async reindex(): Promise<MediaManifest> {
    return this.getManifest();
  }
}

export class StrapiMediaProvider implements MediaProvider {
  readonly name = "strapi";
  async getManifest(): Promise<MediaManifest> {
    throw new Error("StrapiMediaProvider: set STRAPI_URL and implement fetch");
  }
  async query(): Promise<MediaAsset[]> {
    throw new Error("StrapiMediaProvider not configured");
  }
  async getVideos(): Promise<MediaVideoAsset[]> {
    return [];
  }
  async upload(): Promise<MediaAsset> {
    throw new Error("StrapiMediaProvider: use Strapi admin for uploads");
  }
  async reindex(): Promise<MediaManifest> {
    return this.getManifest();
  }
}

export class SupabaseMediaProvider implements MediaProvider {
  readonly name = "supabase";
  async getManifest(): Promise<MediaManifest> {
    throw new Error("SupabaseMediaProvider: set SUPABASE_URL + bucket and implement list");
  }
  async query(): Promise<MediaAsset[]> {
    throw new Error("SupabaseMediaProvider not configured");
  }
  async getVideos(): Promise<MediaVideoAsset[]> {
    return [];
  }
  async upload(): Promise<MediaAsset> {
    throw new Error("SupabaseMediaProvider: implement storage upload");
  }
  async reindex(): Promise<MediaManifest> {
    return this.getManifest();
  }
}

export class PayloadMediaProvider implements MediaProvider {
  readonly name = "payload";
  async getManifest(): Promise<MediaManifest> {
    throw new Error("PayloadMediaProvider: set PAYLOAD_URL and implement fetch");
  }
  async query(): Promise<MediaAsset[]> {
    throw new Error("PayloadMediaProvider not configured");
  }
  async getVideos(): Promise<MediaVideoAsset[]> {
    return [];
  }
  async upload(): Promise<MediaAsset> {
    throw new Error("PayloadMediaProvider: use Payload admin for uploads");
  }
  async reindex(): Promise<MediaManifest> {
    return this.getManifest();
  }
}

let cachedProvider: MediaProvider | null = null;

export function getMediaProvider(): MediaProvider {
  if (cachedProvider) return cachedProvider;

  const provider = process.env.MEDIA_PROVIDER ?? "filesystem";

  switch (provider) {
    case "sanity":
      cachedProvider = new SanityMediaProvider();
      break;
    case "strapi":
      cachedProvider = new StrapiMediaProvider();
      break;
    case "supabase":
      cachedProvider = new SupabaseMediaProvider();
      break;
    case "payload":
      cachedProvider = new PayloadMediaProvider();
      break;
    default:
      cachedProvider = new FilesystemMediaProvider();
  }

  return cachedProvider;
}

export function resetMediaProviderCache(): void {
  cachedProvider = null;
}
