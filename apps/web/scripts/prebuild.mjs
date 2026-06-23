/**
 * Prebuild gate — skips heavy media sync on Vercel when committed manifest exists.
 */
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const manifestPath = path.join(root, "public", "media-manifest.json");

function hasDriveCredentials() {
  return Boolean(
    process.env.GOOGLE_DRIVE_API_KEY?.trim() ||
      process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim(),
  );
}

function run(script) {
  const result = spawnSync("npm", ["run", script], {
    cwd: root,
    stdio: "inherit",
    shell: true,
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

if (process.env.VERCEL === "1" && !hasDriveCredentials() && existsSync(manifestPath)) {
  console.log("✓ Vercel prebuild: using committed media-manifest.json (no Drive key)");
  process.exit(0);
}

run("cache:clean");
run("media:sync:safe");
