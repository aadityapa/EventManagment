import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";
import { stitchTool } from "./stitch-api.mjs";
import { STITCH_PROMPTS, STITCH_PAGE_ORDER } from "./stitch-prompts.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const projectFile = path.join(root, "stitch-project.json");
const projectMeta = JSON.parse(fs.readFileSync(projectFile, "utf8"));
const projectId = projectMeta.projectId;

const only = process.argv.slice(2);
const pages = only.length ? only.filter((p) => STITCH_PROMPTS[p]) : STITCH_PAGE_ORDER;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function loadEnv() {
  const envFile = path.join(root, ".env");
  if (fs.existsSync(envFile)) {
    for (const line of fs.readFileSync(envFile, "utf8").split("\n")) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  }
}
loadEnv();

function listProjectScreens() {
  const project = stitchTool("get_project", { name: `projects/${projectId}` });
  const ids = new Set();
  const entries = [];

  for (const s of project.screens || []) {
    const id = s.name?.split("/").pop();
    if (id) {
      ids.add(id);
      entries.push({ id, title: s.title || "" });
    }
  }
  for (const inst of project.screenInstances || []) {
    const name = inst.sourceScreen || inst.name || "";
    const id = name.split("/").pop();
    if (id && name.includes("/screens/") && !ids.has(id)) {
      ids.add(id);
      entries.push({ id, title: inst.label || inst.title || "" });
    }
  }

  for (const e of entries) {
    if (!e.title) {
      try {
        const detail = stitchTool("get_screen", {
          name: `projects/${projectId}/screens/${e.id}`,
          projectId,
          screenId: e.id,
        });
        e.title = detail.title || detail.displayName || "";
      } catch {
        /* ignore */
      }
    }
  }
  return entries;
}

function knownScreenIds() {
  try {
    return new Set(listProjectScreens().map((s) => s.id));
  } catch {
    return new Set(Object.values(projectMeta.screens || {}));
  }
}

function findScreenForPage(screens, pageName) {
  const keywords = {
    "book-event": ["book", "wizard", "booking"],
    faqs: ["faq", "question"],
    blog: ["blog", "insight", "article"],
    portfolio: ["portfolio", "masterpiece", "glimpse"],
    venues: ["venue"],
    vendors: ["vendor", "partner"],
    gallery: ["gallery", "visual stor"],
    pricing: ["pricing", "investment", "package"],
    contact: ["contact", "touch", "reach"],
    services: ["service"],
    about: ["about"],
    home: ["home"],
  };
  const keys = keywords[pageName] || [pageName.replace("-", " ")];

  return [...screens].reverse().find((s) => {
    const t = (s.title || "").toLowerCase();
    return keys.some((k) => t.includes(k));
  });
}

async function fetchPage(pageName, screenId) {
  const r = spawnSync("node", ["scripts/stitch-fetch-code.mjs", pageName, screenId], {
    cwd: root,
    stdio: "inherit",
    shell: true,
  });
  if (r.status === 0) {
    projectMeta.screens = projectMeta.screens || {};
    projectMeta.screens[pageName] = screenId;
    fs.writeFileSync(projectFile, JSON.stringify(projectMeta, null, 2));
    return true;
  }
  return false;
}

async function processPage(pageName) {
  const exportPath = path.join(root, "apps/web/src/lib/stitch/exports", `${pageName}.html`);
  const force = process.argv.includes("--force");
  if (fs.existsSync(exportPath) && !only.length && !force) {
    console.log(`⏭  ${pageName} — already exported, skipping`);
    return "skipped";
  }

  const existing = findScreenForPage(listProjectScreens(), pageName);
  if (existing?.id && !force) {
    console.log(`📥 Found existing: ${existing.title || existing.id}`);
    const ok = await fetchPage(pageName, existing.id);
    return ok ? "fetched-existing" : "fetch-failed";
  }

  const before = knownScreenIds();
  console.log(`\n🎨 Generating: ${pageName}`);

  try {
    stitchTool("generate_screen_from_text", {
      projectId,
      deviceType: "DESKTOP",
      modelId: "GEMINI_3_1_PRO",
      prompt: STITCH_PROMPTS[pageName],
    });
  } catch (e) {
    console.error(`✗ generate failed: ${e.message}`);
    return "failed";
  }

  for (let i = 0; i < 18; i++) {
    await sleep(20000);
    try {
      const screens = listProjectScreens();
      const newScreens = screens.filter((s) => !before.has(s.id));
      const match = findScreenForPage(newScreens.length ? newScreens : screens, pageName);
      if (match?.id) {
        const screenId = match.id;
        console.log(`✓ Found screen: ${match.title || screenId}`);
        const ok = await fetchPage(pageName, screenId);
        return ok ? "done" : "fetch-failed";
      }
    } catch (e) {
      console.warn(`  poll ${i + 1}: ${e.message}`);
    }
    console.log(`  … waiting (${i + 1}/18)`);
  }

  console.error(`✗ timeout: ${pageName}`);
  return "timeout";
}

const results = {};
for (const page of pages) {
  results[page] = await processPage(page);
}

console.log("\n=== Batch Results ===");
for (const [k, v] of Object.entries(results)) console.log(`  ${k}: ${v}`);
