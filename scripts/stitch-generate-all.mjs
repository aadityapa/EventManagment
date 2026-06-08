import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { stitchTool } from "./stitch-api.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const projectId = JSON.parse(fs.readFileSync(path.join(root, "stitch-project.json"), "utf8")).projectId;

const pages = process.argv.slice(2);
const all = pages.length
  ? pages
  : ["about", "services", "contact", "book-event"];

const prompts = {
  about: `About page for Glitz Events & Promotions Pune - luxury black gold editorial layout. Company story, vision and mission cards, leadership team grid, awards timeline, partner logos. Phone +91 9730594753.`,
  services: `Services page Glitz Events - wedding planning, corporate events, concerts, exhibitions, celebrity management. Black background gold accent cards. Pune luxury event agency.`,
  contact: `Contact page Glitz Events & Promotions. Contact form, phone +91 9730594753, WhatsApp, Pune address. Black gold glass morphism.`,
  "book-event": `Multi-step event booking wizard Glitz Events. Progress stepper with event type, date, venue, guests, budget, services, review. Black gold premium UI.`,
};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitAndFetch(pageName, maxAttempts = 15) {
  for (let i = 0; i < maxAttempts; i++) {
    await sleep(25000);
    try {
      const project = stitchTool("get_project", { name: `projects/${projectId}` });
      const screens = project.screens || [];
      const match = [...screens].reverse().find((s) => {
        const t = (s.title || "").toLowerCase();
        return t.includes(pageName) || (pageName === "book-event" && t.includes("book"));
      });
      if (match?.name) {
        const screenId = match.name.split("/").pop();
        const { spawnSync } = await import("child_process");
        spawnSync("node", ["scripts/stitch-fetch-code.mjs", pageName, screenId], {
          cwd: root,
          stdio: "inherit",
          shell: true,
        });
        return screenId;
      }
    } catch (e) {
      console.warn("  poll:", e.message);
    }
    console.log(`  waiting ${pageName}... ${i + 1}/${maxAttempts}`);
  }
  return null;
}

for (const page of all) {
  console.log(`\n=== ${page} ===`);
  try {
    stitchTool("generate_screen_from_text", {
      projectId,
      deviceType: "DESKTOP",
      modelId: "GEMINI_3_1_PRO",
      prompt: prompts[page],
    });
    await waitAndFetch(page);
  } catch (e) {
    console.error(page, e.message);
  }
}

console.log("\nAll done.");
