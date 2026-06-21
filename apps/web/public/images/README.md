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
