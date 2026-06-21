/**
 * List files from a publicly shared Drive folder via embedded folderview HTML.
 * Fallback when Drive API credentials are unavailable (folder must be link-shared).
 */

export interface PublicDriveFile {
  id: string;
  name: string;
}

const ENTRY_RE =
  /id="entry-([^"]+)"[^>]*>[\s\S]*?<div class="flip-entry-title">([^<]+)<\/div>/g;

export async function listPublicDriveFolderFiles(folderId: string): Promise<PublicDriveFile[]> {
  const url = `https://drive.google.com/embeddedfolderview?id=${encodeURIComponent(folderId)}#list`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "NexyyraMediaSync/1.0",
    },
  });

  if (!res.ok) {
    throw new Error(`Drive public folder fetch failed (${res.status})`);
  }

  const html = await res.text();
  const files: PublicDriveFile[] = [];
  const seen = new Set<string>();

  for (const match of html.matchAll(ENTRY_RE)) {
    const id = match[1];
    const name = match[2].trim();
    if (!id || !name || seen.has(id)) continue;
    seen.add(id);
    files.push({ id, name });
  }

  return files;
}
