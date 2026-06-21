/**
 * Print local source images grouped by folder — for manual Google Drive upload.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { getImagesRoot } from "../src/lib/media/paths";
import { MEDIA_IMAGE_FOLDERS } from "../src/lib/media/types";
import { MEDIA_SOURCE_EXTENSIONS } from "../src/lib/media/paths";

const DRIVE_FOLDER =
  "https://drive.google.com/drive/folders/1UZR_UhiZfVvcLUNvDJi3Rvw8udkfKgYM?usp=sharing";

async function main() {
  const root = getImagesRoot();
  let total = 0;

  console.log(`Upload these files to Google Drive:\n${DRIVE_FOLDER}\n`);
  console.log("Create matching subfolders (hero, weddings, venues, gallery, etc.)\n");

  for (const folder of MEDIA_IMAGE_FOLDERS) {
    const folderPath = path.join(root, folder);
    let entries: string[] = [];
    try {
      const files = await fs.readdir(folderPath);
      entries = files.filter((f) => {
        const ext = path.extname(f).toLowerCase();
        return MEDIA_SOURCE_EXTENSIONS.has(ext) && !f.endsWith(".meta.json");
      });
    } catch {
      continue;
    }

    if (!entries.length) continue;
    console.log(`## ${folder}/ (${entries.length} files)`);
    for (const name of entries.sort()) {
      console.log(`  ${folder}/${name}`);
      total += 1;
    }
    console.log("");
  }

  console.log(`Total: ${total} source images`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
