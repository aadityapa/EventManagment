import fs from "node:fs/promises";
import type { MediaManifest } from "./types";
import { getManifestFilePath } from "./paths";

async function fileExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

/** Read-only manifest access — safe for page routes (no scanner imports). */
export async function readMediaManifest(): Promise<MediaManifest | null> {
  const filePath = getManifestFilePath();
  if (!(await fileExists(filePath))) return null;
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as MediaManifest;
  } catch {
    return null;
  }
}

export async function writeMediaManifest(manifest: MediaManifest): Promise<void> {
  const filePath = getManifestFilePath();
  await fs.writeFile(filePath, JSON.stringify(manifest, null, 2), "utf8");
}
