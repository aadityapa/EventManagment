import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const envFile = path.join(root, ".env");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

export function stitchTool(toolName, data = {}) {
  const tmp = path.join(root, `.stitch-${Date.now()}-${Math.random().toString(36).slice(2)}.json`);
  fs.writeFileSync(tmp, JSON.stringify(data));
  const r = spawnSync(
    "npx",
    ["-y", "@_davideast/stitch-mcp", "tool", toolName, "-f", tmp, "-o", "json"],
    { cwd: root, env: process.env, encoding: "utf8", shell: true, maxBuffer: 50 * 1024 * 1024 }
  );
  try {
    fs.unlinkSync(tmp);
  } catch {
    /* ignore */
  }
  if (r.status !== 0) {
    throw new Error(r.stderr || r.stdout || `stitch tool ${toolName} failed`);
  }
  const text = (r.stdout || "").trim();
  return text ? JSON.parse(text) : {};
}
