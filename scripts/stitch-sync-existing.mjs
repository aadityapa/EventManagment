import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";
import { stitchTool } from "./stitch-api.mjs";

const root = path.dirname(fileURLToPath(import.meta.url)) + "/..";
const projectFile = path.join(root, "stitch-project.json");
const projectMeta = JSON.parse(fs.readFileSync(projectFile, "utf8"));
const projectId = projectMeta.projectId;

const envFile = path.join(root, ".env");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

const NAV_MAP = [
  { page: "home", keys: ["home"] },
  { page: "about", keys: ["about"] },
  { page: "services", keys: ["service"] },
  { page: "portfolio", keys: ["portfolio", "masterpiece", "glimpse"] },
  { page: "venues", keys: ["venue"] },
  { page: "vendors", keys: ["vendor", "partner"] },
  { page: "gallery", keys: ["gallery", "visual stor"] },
  { page: "pricing", keys: ["pricing", "investment", "package"] },
  { page: "blog", keys: ["blog", "insight", "article"] },
  { page: "contact", keys: ["contact", "touch", "reach", "extraordinary"] },
];

const project = stitchTool("get_project", { name: `projects/${projectId}` });
const ids = new Set();
const screens = [];

for (const s of project.screens || []) {
  const id = s.name?.split("/").pop();
  if (id) {
    ids.add(id);
    screens.push({ id, title: s.title || "" });
  }
}
for (const inst of project.screenInstances || []) {
  const name = inst.sourceScreen || "";
  const id = name.split("/").pop();
  if (id && name.includes("/screens/") && !ids.has(id)) {
    ids.add(id);
    screens.push({ id, title: inst.label || "" });
  }
}

for (const s of screens) {
  if (!s.title) {
    try {
      const d = stitchTool("get_screen", {
        name: `projects/${projectId}/screens/${s.id}`,
        projectId,
        screenId: s.id,
      });
      s.title = d.title || "";
    } catch {
      s.title = "";
    }
  }
}

console.log("All screens:");
for (const s of screens) console.log(`  ${s.id.slice(0, 8)}… ${s.title}`);

const assigned = new Set();
for (const { page, keys } of NAV_MAP) {
  const match = [...screens]
    .reverse()
    .find((s) => {
      if (assigned.has(s.id)) return false;
      const t = s.title.toLowerCase();
      if (!t || t.includes("headshot") || t.includes("prototype") || t.includes("design.md")) return false;
      return keys.some((k) => t.includes(k));
    });

  if (!match) {
    console.log(`✗ no match: ${page}`);
    continue;
  }

  assigned.add(match.id);
  console.log(`\n→ ${page}: ${match.title} (${match.id})`);
  spawnSync("node", ["scripts/stitch-fetch-code.mjs", page, match.id], {
    cwd: root,
    stdio: "inherit",
    shell: true,
  });
  projectMeta.screens = projectMeta.screens || {};
  projectMeta.screens[page] = match.id;
}

fs.writeFileSync(projectFile, JSON.stringify(projectMeta, null, 2));
console.log("\nDone.");
