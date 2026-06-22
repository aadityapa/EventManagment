/**
 * Scan public/images for duplicate photos and remove redundant copies.
 * Keeps original JPG in preferred category folder; removes webp variants.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = path.join(process.cwd(), "public", "images");
const SKIP_DIRS = new Set(["placeholders"]);
const FOLDER_PRIORITY = [
  "hero",
  "weddings",
  "venues",
  "gallery",
  "celebrity",
  "corporate",
  "destination",
  "portfolio",
  "stories",
];

const WEBP_DERIVED_RE =
  /(-640w|-828w|-1200w|-1920w)\.webp$|\.(jpe?g)\.webp$/i;
const ORIGINAL_JPG_RE = /\.(jpe?g)$/i;

function walk(dir: string, out: string[] = []): string[] {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(ent.name)) continue;
      walk(path.join(dir, ent.name), out);
    } else {
      out.push(path.join(dir, ent.name));
    }
  }
  return out;
}

function isWebpVariant(name: string): boolean {
  return name.toLowerCase().endsWith(".webp") && WEBP_DERIVED_RE.test(name);
}

function isOriginalJpg(name: string): boolean {
  return ORIGINAL_JPG_RE.test(name) && !name.toLowerCase().endsWith(".webp");
}

function originalForVariant(variantPath: string): string {
  const name = path.basename(variantPath);
  const base = name
    .replace(/(-640w|-828w|-1200w|-1920w)\.webp$/i, "")
    .replace(/\.(jpe?g)\.webp$/i, ".$1");
  return path.join(path.dirname(variantPath), base);
}

function fileStem(name: string): string {
  return path
    .basename(name)
    .replace(/\.(jpe?g|webp)$/i, "")
    .replace(/(-640w|-828w|-1200w|-1920w)$/i, "")
    .toLowerCase();
}

function folderOf(file: string): string {
  return path.relative(ROOT, file).split(path.sep)[0] ?? "";
}

function folderRank(folder: string): number {
  const idx = FOLDER_PRIORITY.indexOf(folder);
  return idx === -1 ? FOLDER_PRIORITY.length : idx;
}

function md5(file: string): string {
  const hash = crypto.createHash("md5");
  hash.update(fs.readFileSync(file));
  return hash.digest("hex");
}

function safeUnlink(file: string, dryRun: boolean): boolean {
  if (dryRun) return true;
  try {
    fs.unlinkSync(file);
    return true;
  } catch (err) {
    console.warn(`⚠ Could not delete ${path.relative(ROOT, file)}: ${(err as NodeJS.ErrnoException).message}`);
    return false;
  }
}

function pickKeeper(paths: string[]): string {
  return [...paths].sort((a, b) => {
    const fa = folderOf(a);
    const fb = folderOf(b);
    const ra = folderRank(fa);
    const rb = folderRank(fb);
    if (ra !== rb) return ra - rb;
    const sa = fs.statSync(a).size;
    const sb = fs.statSync(b).size;
    if (sa !== sb) return sb - sa;
    return a.localeCompare(b);
  })[0]!;
}

type Report = {
  deleted: string[];
  kept: string[];
  byFolder: Record<string, number>;
  contentDupGroups: number;
  crossFolderStemGroups: number;
  webpVariantsRemoved: number;
};

function main() {
  const dryRun = process.argv.includes("--dry-run");
  const files = walk(ROOT);

  const variants = files.filter((f) => isWebpVariant(path.basename(f)));

  const report: Report = {
    deleted: [],
    kept: [],
    byFolder: {},
    contentDupGroups: 0,
    crossFolderStemGroups: 0,
    webpVariantsRemoved: 0,
  };

  // 1. Remove derived webp variants (keep original JPG only)
  for (const variant of variants) {
    const originalPath = originalForVariant(variant);
    const hasOriginal =
      fs.existsSync(originalPath) && isOriginalJpg(path.basename(originalPath));
    // Delete when original exists, or orphan junk with no source file
    if (hasOriginal || !fs.existsSync(originalPath)) {
      report.deleted.push(path.relative(ROOT, variant));
      report.webpVariantsRemoved++;
      const folder = folderOf(variant);
      report.byFolder[folder] = (report.byFolder[folder] ?? 0) + 1;
      safeUnlink(variant, dryRun);
    }
  }

  // 3. Cross-folder content duplicates among originals
  const liveOriginals = walk(ROOT).filter((f) => isOriginalJpg(path.basename(f)));
  const byHash = new Map<string, string[]>();
  for (const f of liveOriginals) {
    const h = md5(f);
    const list = byHash.get(h) ?? [];
    list.push(f);
    byHash.set(h, list);
  }

  for (const [, group] of byHash) {
    if (group.length <= 1) continue;
    report.contentDupGroups++;
    const keeper = pickKeeper(group);
    report.kept.push(path.relative(ROOT, keeper));
    for (const f of group) {
      if (f === keeper) continue;
      report.deleted.push(path.relative(ROOT, f));
      const folder = folderOf(f);
      report.byFolder[folder] = (report.byFolder[folder] ?? 0) + 1;
      safeUnlink(f, dryRun);
    }
  }

  // 4. Cross-folder same stem (different content but same filename)
  const byStem = new Map<string, string[]>();
  const stillOriginals = walk(ROOT).filter((f) => isOriginalJpg(path.basename(f)));
  for (const f of stillOriginals) {
    const s = fileStem(path.basename(f));
    const list = byStem.get(s) ?? [];
    list.push(f);
    byStem.set(s, list);
  }

  for (const [, group] of byStem) {
    if (group.length <= 1) continue;
    const folders = new Set(group.map(folderOf));
    if (folders.size <= 1) continue;
    report.crossFolderStemGroups++;
    const keeper = pickKeeper(group);
    if (!report.kept.includes(path.relative(ROOT, keeper))) {
      report.kept.push(path.relative(ROOT, keeper));
    }
    for (const f of group) {
      if (f === keeper) continue;
      const rel = path.relative(ROOT, f);
      if (report.deleted.includes(rel)) continue;
      report.deleted.push(rel);
      const folder = folderOf(f);
      report.byFolder[folder] = (report.byFolder[folder] ?? 0) + 1;
      safeUnlink(f, dryRun);
    }
  }

  console.log(JSON.stringify(report, null, 2));
  console.log(`\n${dryRun ? "[DRY RUN] " : ""}Deleted ${report.deleted.length} files`);
}

main();
