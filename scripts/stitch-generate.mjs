import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { stitchTool } from "./stitch-api.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const projectId = JSON.parse(fs.readFileSync(path.join(root, "stitch-project.json"), "utf8")).projectId;

import { STITCH_PROMPTS } from "./stitch-prompts.mjs";

const pageName = process.argv[2] || "home";
const prompt = STITCH_PROMPTS[pageName];
if (!prompt) {
  console.error("Unknown page:", pageName);
  process.exit(1);
}

console.log(`Generating ${pageName}...`);
const gen = stitchTool("generate_screen_from_text", {
  projectId,
  deviceType: "DESKTOP",
  modelId: "GEMINI_3_1_PRO",
  prompt,
});

const outDir = path.join(root, "stitch-exports");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, `${pageName}-session.json`), JSON.stringify(gen, null, 2));
console.log(JSON.stringify(gen, null, 2));
