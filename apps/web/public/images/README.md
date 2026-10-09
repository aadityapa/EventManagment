# Nexyyra Events — Image Library

**Production photos are hosted on [Google Drive](https://drive.google.com/drive/folders/1UZR_UhiZfVvcLUNvDJi3Rvw8udkfKgYM?usp=sharing), not in Git.**

Large JPG/PNG files are gitignored under `public/images/`. Only small placeholder PNGs are tracked here.

## Add or update photos

1. Upload source images (JPG, PNG, WebP) into the shared Drive folder using the same subfolder names as below.
2. Ensure the folder is shared as **Anyone with the link can view** (or share with your service account email).
3. Set env vars (see root `.env.example`): `GOOGLE_DRIVE_FOLDER_ID`, `GOOGLE_DRIVE_API_KEY` or `GOOGLE_SERVICE_ACCOUNT_JSON`, and `MEDIA_PROVIDER=google-drive`.
4. Run `npm run media:sync` — rebuilds `public/media-manifest.json` and `src/brand/data/brand-images.generated.ts` with Drive CDN URLs.
5. Commit the updated manifest and redeploy.

## Drive subfolders

| Subfolder | Used on |
|-----------|---------|
| `hero/` | Homepage hero, hero gallery |
| `weddings/` | Wedding services |
| `corporate/` | Corporate events |
| `destination/` | Destination weddings |
| `celebrity/` | Celebrity events |
| `venues/` | Venue pages |
| `portfolio/` | Portfolio grid |
| `stories/` | Story gallery |
| `gallery/` | Main gallery page |

## Curation

`media:sync` knows which *folder* a photo came from, not what is in it. The hand-maintained layer `src/brand/data/image-curation.ts` fixes that: every Drive photo is keyed in `IMAGE_CURATION_SOURCE` by its Drive file ID (the `<id>` in `https://lh3.googleusercontent.com/d/<id>=w1920`) with

- descriptive `alt` text (what is visible — never clients, venue names or cities),
- `roles` it may play (`hero`, `wedding`, `venue`, `decor`, `og`, `about`, `contact`, `gallery`, …),
- a 1–5 `quality` score, a `focal` point for `object-position`, `facesProminent`, and the `textSafeArea` side that can carry headline copy,
- an optional `nearDuplicateOf` so two frames of the same set-up never share a page.

`buildBrandImageMap` (`src/lib/media/brand-images.ts`) fills every `BRAND_IMAGES` slot from these roles first — best quality first, de-duplicated across slots, no prominent faces behind copy — and only falls back to the folder scan for what curation cannot supply. `GENERATED_HERO_SLIDES` are the top text-safe landscape `hero` photos with curated alt text. Photos with no entry still work; they just never win a curated slot and get a generic alt.

Page code should never hard-code alt text for a Drive photo — use `imageAlt(src)` and `imageFocal(src)` from `src/brand/data/imagery.ts`.

Workflow:

1. Upload to Drive and run `npm run media:sync` (needs credentials) — or just edit the curation file.
2. Add/adjust the entry in `image-curation.ts`. Set `roles: []` for frames that must never appear (e.g. served rotated).
3. `npm run media:regen` — rebuilds `brand-images.generated.ts` from the committed manifest, no Drive call.
4. Changing the hero poster or OG card: set `HERO_POSTER_ID` / `OG_IMAGE_ID` in the curation file and run `npm run brand:hero-og` (writes `hero/hero-poster.webp`, `hero/hero-poster-mobile.webp`, `public/brand/nexyyra-og.png`, `nexyyra-og-square.png`). Those four files are committed; everything else under `public/images/` stays Drive-only.

## V6 covers (`public/images/covers/`)

The V6 pages never load an above-the-fold photo from Drive. `npm run media:covers` (`scripts/export-covers.mjs`) reads every curated asset carrying a `cover-*`, `service-cover-*` or `concept-*` role, fetches the Drive original once into `.cache/media/` (git-ignored) and writes three committed files per role:

| File | Geometry | Budget | Used by |
|------|----------|--------|---------|
| `<role>-1920.webp` | full frame, 1920 wide | ≤ 220 KB | desktop `Cover` (4:5 via `object-fit` + `focal`) |
| `<role>-1280.webp` | full frame, 1280 wide | ≤ 150 KB | laptops |
| `<role>-768.webp` | 768×960 (4:5) crop at the focal point | ≤ 90 KB | phones |

WebP quality starts at 78 and steps down until the budget fits; the run fails if it cannot. No sharpening, no colour or saturation change. The script also writes a 24px blur data URL for every asset (covers from the original, everything else from the `=w48` Drive variant) into the `MEDIA_EXPORTS` block of `image-curation.ts`, which feeds `CurationAsset.local` / `.blur`. `--force` re-exports covers that already exist. Root `.gitignore` un-ignores `apps/web/public/images/covers/*.webp` so the exports are committed.

### V6 roles (`src/brand/data/image-curation.ts`, `IMAGE_CURATION: CurationAsset[]`)

`assetForRole(role)` / `assetsByRole(role)` resolve these; `localSources(asset)` gives the local `src`/`srcSet` for covers.

| Role | Count | Notes |
|------|-------|-------|
| `cover-home`, `cover-services`, `cover-about`, `cover-portfolio`, `cover-why` | 1 each | page covers, local WebP, no close faces |
| `service-cover-<slug>` / `index-frame-<slug>` | 12 each | same asset for both; the seven services in `NEEDS_REAL_PHOTOGRAPHY` get an honest staging / venue frame |
| `spread-home`, `-services`, `-about`, `-why` | 1 each | wide landscapes, 21:9 on desktop |
| `diptych-home-l/r`, `case-cs-{1,2,3}-l/r` | 1 each | 3:4 panels |
| `house-portrait` | 1 | 4:5-safe frame for the About chapter |
| `concept-cs-{1,2,3}` | 1 each | category-matched real photo under a Concept tag (also exported locally for case covers) |
| `editorial-band` (`EDITORIAL_BAND`) | 10 | shared below-fold pool; never collides with `/services` |
| `blog-lead-<category>` (`blogLeadRole(category)`) | 6 | one per blog category in `cms.ts` |
| `gallery` / `thumb` | all usable photos | rotated frames, near-duplicates and the consent-pending celebrity frame are excluded; `thumb` = quality ≥ 3 |

No photo is used twice across the 17 cover roles, and the two halves of a `nearDuplicateOf` pair never share a page. `assetsForService(slug)` returns real gallery photos for a service and `[]` for `NEEDS_REAL_PHOTOGRAPHY` slugs; `withoutDuplicates(assets, shownIds)` is the dedupe helper for page packages.

## Local checklist

To list local files ready for upload:

```bash
npx tsx scripts/list-local-images-for-drive.ts
```

## Categories

`wedding`, `corporate`, `destination`, `celebrity`, `brand-activation`, `venue`, `award-ceremony`, `fashion-show`

Default category is inferred from the subfolder name.

## Commands

```bash
npm run media:sync    # Sync from Google Drive (falls back to local scan if Drive empty)
```

## Admin upload

Visit `/admin/media` — uploads are disabled when `MEDIA_PROVIDER=google-drive`. Add photos via Drive only.
