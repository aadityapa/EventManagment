import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

// Load .env
const envFile = path.join(root, ".env");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

const tool = process.argv[2];
const dataArg = process.argv[3];
const data = dataArg?.startsWith("{") ? JSON.parse(dataArg) : {};
const tmp = path.join(root, ".stitch-tmp.json");
fs.writeFileSync(tmp, JSON.stringify(data));

const env = { ...process.env };
const cmd = `npx -y @_davideast/stitch-mcp tool ${tool} -f "${tmp}" -o json`;
try {
  const out = execSync(cmd, { cwd: root, env, encoding: "utf8", maxBuffer: 50 * 1024 * 1024 });
  console.log(out);
} finally {
  fs.unlinkSync(tmp);
}
