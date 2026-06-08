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

const tmp = path.join(root, ".stitch-tmp.json");
fs.writeFileSync(tmp, JSON.stringify({ title: "Glitz Events & Promotions" }));

const r = spawnSync(
  "npx",
  ["-y", "@_davideast/stitch-mcp", "tool", "create_project", "-f", tmp, "-o", "json"],
  { cwd: root, env: process.env, encoding: "utf8", shell: true, maxBuffer: 50 * 1024 * 1024 }
);
fs.unlinkSync(tmp);
process.stdout.write(r.stdout || "");
process.stderr.write(r.stderr || "");
if (r.status !== 0) process.exit(r.status || 1);
