import { assetsByRole, withoutDuplicates, type CurationAsset } from "@/brand/data/image-curation";
import { galleryCategory } from "@/components/ui/gallery";
import type { MediaAsset, MediaImageFolder } from "./types";
import { readMediaManifest } from "./manifest-read";
import { isComingSoonImage } from "./placeholders";

const SERVICE_FOLDER_MAP: Record<string, MediaImageFolder> = {
  "wedding-planning": "weddings",
  "corporate-events": "corporate",
  "destination-weddings": "destination",
  "celebrity-management": "celebrity",
  "brand-promotions": "corporate",
  "fashion-shows": "gallery",
  "award-functions": "gallery",
};

const GALLERY_FOLDER_ORDER: Record<string, number> = {
  gallery: 0,
  weddings: 1,
  venues: 2,
  hero: 3,
  celebrity: 4,
  corporate: 5,
  destination: 6,
  portfolio: 7,
  stories: 8,
};

function sortGalleryAssets(assets: MediaAsset[]): MediaAsset[] {
  return [...assets].sort((a, b) => {
    const folderDelta =
      (GALLERY_FOLDER_ORDER[a.folder] ?? 99) - (GALLERY_FOLDER_ORDER[b.folder] ?? 99);
    if (folderDelta !== 0) return folderDelta;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

/** Read-only service gallery — manifest only, no filesystem scan. */
export async function getServiceMediaFromManifest(
  serviceSlug: string,
  limit = 8
): Promise<MediaAsset[]> {
  const manifest = await readMediaManifest();
  if (!manifest?.assets.length) return [];

  const folder = SERVICE_FOLDER_MAP[serviceSlug];
  if (folder) {
    const folderAssets = manifest.assets.filter(
      (asset) => asset.folder === folder && !isComingSoonImage(asset.src)
    );
    if (folderAssets.length) return folderAssets.slice(0, limit);
  }

  const gallery = sortGalleryAssets(
    manifest.assets.filter((asset) => !isComingSoonImage(asset.src))
  );
  return gallery.slice(0, limit);
}

/* ── The archive (/gallery, /portfolio): curated photos, manifest-checked ── */

export const ARCHIVE_FILTERS = [
  { value: "all", label: "All" },
  { value: "weddings", label: "Weddings" },
  { value: "venues", label: "Venues" },
] as const;

export type ArchiveFilter = (typeof ARCHIVE_FILTERS)[number]["value"];

export const ARCHIVE_PAGE_SIZE = 24;

type QueryValue = string | string[] | undefined;
const first = (v: QueryValue) => (Array.isArray(v) ? v[0] : v);

export function parseArchiveFilter(value: QueryValue): ArchiveFilter {
  const v = first(value);
  return ARCHIVE_FILTERS.some((f) => f.value === v) ? (v as ArchiveFilter) : "all";
}

/** `?page=` → a positive integer; anything else is page 1. */
export function parsePage(value: QueryValue): number {
  const n = Number(first(value));
  return Number.isInteger(n) && n > 0 ? n : 1;
}

/**
 * Archive photos, best first: every curated `gallery` frame whose file is
 * still in public/media-manifest.json (a photo removed from Drive drops out),
 * minus `exclude` and their near-duplicates so no frame repeats on a page.
 */
export async function getArchiveAssets(exclude: Iterable<string> = []): Promise<CurationAsset[]> {
  const manifest = await readMediaManifest();
  const live = manifest?.assets.length
    ? new Set(manifest.assets.filter((a) => !isComingSoonImage(a.src)).map((a) => a.id))
    : null;
  const curated = assetsByRole("gallery").filter((a) => !live || live.has(a.manifestId));
  // Drops the excluded frames themselves as well as their near-duplicates.
  return withoutDuplicates(curated, exclude);
}

export function filterArchive(assets: CurationAsset[], filter: ArchiveFilter): CurationAsset[] {
  return filter === "all" ? assets : assets.filter((a) => galleryCategory(a) === filter);
}

export function archiveCounts(assets: CurationAsset[]): Record<ArchiveFilter, number> {
  return {
    all: assets.length,
    weddings: filterArchive(assets, "weddings").length,
    venues: filterArchive(assets, "venues").length,
  };
}

/**
 * A fixed mix for an in-page archive (the /portfolio TabsRadio filter needs
 * every tab populated): the best N of each category, kept in quality order.
 */
export function pickArchive(
  assets: CurationAsset[],
  quota: { weddings: number; venues: number; other: number }
): CurationAsset[] {
  const taken = { weddings: 0, venues: 0, other: 0 } as Record<string, number>;
  return assets.filter((a) => {
    const cat = galleryCategory(a);
    const key = cat === "weddings" || cat === "venues" ? cat : "other";
    if (taken[key] >= quota[key as keyof typeof quota]) return false;
    taken[key] += 1;
    return true;
  });
}

/** Wide frames spaced evenly through the list, so each gallery page gets its share. */
export function spreadWides(assets: CurationAsset[]): CurationAsset[] {
  const wides = assets.filter((a) => a.span === "wide");
  const rest = assets.filter((a) => a.span !== "wide");
  if (!wides.length || !rest.length) return assets;
  const step = assets.length / wides.length;
  const out: CurationAsset[] = [];
  let w = 0;
  let r = 0;
  for (let i = 0; i < assets.length; i++) {
    const wantWide = w < wides.length && (r >= rest.length || i >= Math.floor(w * step + step / 2));
    out.push(wantWide ? wides[w++] : rest[r++]);
  }
  return out;
}

export function paginate<T>(items: T[], page: number, size = ARCHIVE_PAGE_SIZE) {
  const pageCount = Math.max(1, Math.ceil(items.length / size));
  return { items: items.slice((page - 1) * size, page * size), page, pageCount };
}

/**
 * Orders tiles so the 12-column gallery packs without `grid-auto-flow: dense`
 * (focus order stays visual order). Desktop spans: wide 8, standard/tall 4;
 * phones: wide 12, others 6. Wides travel in pairs as [wide·tall][tall·wide]
 * (a 3:2 frame on 8 columns is as tall as a 3:4 frame on 4), separated by runs
 * of six same-shape tiles — two full desktop rows, three full phone rows — so
 * neither breakpoint leaves holes. A wide with no partner becomes standard.
 */
export function composeRows(assets: CurationAsset[]): CurationAsset[] {
  const wides = assets.filter((a) => a.span === "wide");
  const talls = assets.filter((a) => a.span === "tall");
  const standards = assets.filter((a) => a.span === "standard");

  type Block = CurationAsset[];
  const wideBlocks: Block[] = [];
  while (wides.length >= 2) {
    const partners = talls.length >= 2 ? talls : standards.length >= 2 ? standards : null;
    if (!partners) break;
    const [a, b] = wides.splice(0, 2);
    const [p, q] = partners.splice(0, 2);
    wideBlocks.push([a, p, q, b]);
  }
  // Unpaired wides keep their quality slot as standard tiles.
  standards.push(...wides.map((a) => ({ ...a, span: "standard" as const })));

  const sixes: Block[] = [];
  while (talls.length >= 6 || standards.length >= 6) {
    if (talls.length >= 6) sixes.push(talls.splice(0, 6));
    if (standards.length >= 6) sixes.push(standards.splice(0, 6));
  }

  const out: CurationAsset[] = [];
  const perWide = wideBlocks.length ? Math.ceil(sixes.length / wideBlocks.length) : 0;
  for (const block of wideBlocks) {
    out.push(...block);
    for (const six of sixes.splice(0, perWide)) out.push(...six);
  }
  for (const six of sixes) out.push(...six);
  out.push(...talls, ...standards);
  return out;
}

/** One page of the archive for a filter: filtered, wides spread, paginated, packed. */
export function archivePage(assets: CurationAsset[], filter: ArchiveFilter, page: number) {
  const filtered = filterArchive(assets, filter);
  const paged = paginate(spreadWides(filtered), page);
  return { ...paged, items: composeRows(paged.items), total: filtered.length };
}
