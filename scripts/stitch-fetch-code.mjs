import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { stitchTool } from "./stitch-api.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const projectId = JSON.parse(fs.readFileSync(path.join(root, "stitch-project.json"), "utf8")).projectId;
const pageName = process.argv[2] || "home";
const screenIdArg = process.argv[3];

const outDir = path.join(root, "stitch-exports");
fs.mkdirSync(outDir, { recursive: true });

let screenId = screenIdArg;
if (!screenId) {
  const screens = stitchTool("list_screens", { projectId });
  const list = screens.screens || screens.screenInstances || [];
  console.log("Screens:", list.map((s) => ({ name: s.name || s.title, id: (s.name || "").split("/").pop() })));
  const match = list.find((s) => {
    const t = (s.title || s.label || s.name || "").toLowerCase();
    return t.includes(pageName) || (pageName === "home" && t.includes("home"));
  });
  screenId = (match?.name || match?.sourceScreen || "").split("/").pop();
  if (!screenId && list.length) {
    screenId = (list[list.length - 1].name || "").split("/").pop();
  }
}

if (!screenId) {
  console.error("No screen found for", pageName);
  process.exit(1);
}

console.log(`Fetching code for ${pageName} screen ${screenId}...`);
const code = stitchTool("get_screen_code", { projectId, screenId });
const raw = typeof code === "string" ? code : code.htmlContent || code.htmlCode || code.html || code.content || JSON.stringify(code, null, 2);
const html = raw.startsWith("{") ? JSON.parse(raw).htmlContent || raw : raw;

const htmlPath = path.join(outDir, `${pageName}.html`);
fs.writeFileSync(htmlPath, html);

const metaPath = path.join(outDir, `${pageName}.meta.json`);
fs.writeFileSync(metaPath, JSON.stringify({ projectId, screenId, pageName }, null, 2));

const appStitchDir = path.join(root, "apps/web/src/lib/stitch/exports");
fs.mkdirSync(appStitchDir, { recursive: true });
fs.writeFileSync(path.join(appStitchDir, `${pageName}.html`), html);
fs.writeFileSync(path.join(appStitchDir, `${pageName}.meta.json`), JSON.stringify({ projectId, screenId }, null, 2));

console.log("Saved:", htmlPath, `(${html.length} chars)`);
