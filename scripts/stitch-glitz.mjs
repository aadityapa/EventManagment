import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const apiKey = process.env.STITCH_API_KEY;

if (!apiKey) {
  console.error("Set STITCH_API_KEY in environment or .env");
  process.exit(1);
}

const env = { ...process.env, STITCH_API_KEY: apiKey };

function stitchTool(toolName, data = {}) {
  const json = JSON.stringify(data).replace(/"/g, '\\"');
  const cmd = `npx -y @_davideast/stitch-mcp tool ${toolName} -d "${json}" -o json`;
  const out = execSync(cmd, { cwd: root, env, encoding: "utf8", maxBuffer: 50 * 1024 * 1024 });
  return JSON.parse(out);
}

const PAGES = [
  {
    route: "/",
    name: "Home",
    prompt: `Luxury black and gold event management homepage for "Glitz Events & Promotions" Pune. Fullscreen cinematic hero with logo, headline "Creating Extraordinary Experiences", subheadline luxury event management, gold particles on black. CTAs: Book Event, Free Consultation, WhatsApp +91 9730594753. Sections: stats counters, premium service cards grid, portfolio masonry, testimonials carousel, gold CTA band. Playfair Display + gold #D4AF37 accents. Desktop 1280px.`,
  },
  {
    route: "/about",
    name: "About",
    prompt: `About page for Glitz Events & Promotions - luxury black gold theme. Company story, vision mission, team grid, awards, partner logos. Pune event management company. Premium editorial layout.`,
  },
  {
    route: "/services",
    name: "Services",
    prompt: `Services page for Glitz Events - wedding planning, corporate events, concerts, exhibitions, celebrity management. Black background gold accent cards with hover states. Luxury event agency Pune.`,
  },
  {
    route: "/contact",
    name: "Contact",
    prompt: `Contact page Glitz Events & Promotions. Logo display, contact form, phone +91 9730594753, WhatsApp, Pune address. Black gold luxury design with glass cards.`,
  },
  {
    route: "/book-event",
    name: "Book Event",
    prompt: `Multi-step event booking wizard for Glitz Events. Steps: event type, date, venue, guests, budget, services, review, payment. Black gold premium UI progress stepper.`,
  },
];

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForScreen(projectId, sessionId, maxAttempts = 20) {
  for (let i = 0; i < maxAttempts; i++) {
    await sleep(30000);
    try {
      const screens = stitchTool("list_screens", { projectId });
      const found = screens.screens?.find((s) => s.sessionId === sessionId || s.name?.includes(sessionId));
      if (found?.name) {
        const id = found.name.split("/").pop();
        return id;
      }
      if (screens.screens?.length) {
        const latest = screens.screens[screens.screens.length - 1];
        const id = latest.name?.split("/").pop();
        if (id) return id;
      }
    } catch {
      /* retry */
    }
    console.log(`  Waiting for screen... attempt ${i + 1}/${maxAttempts}`);
  }
  return null;
}

async function main() {
  const exportDir = path.join(root, "stitch-exports");
  fs.mkdirSync(exportDir, { recursive: true });

  console.log("Creating Stitch project...");
  const project = stitchTool("create_project", {
    title: "Glitz Events & Promotions",
  });
  const projectId = project.name?.replace("projects/", "") || project.projectId;
  console.log("Project ID:", projectId);

  const designMd = fs.readFileSync(path.join(root, "DESIGN.md"), "utf8");
  const designMdBase64 = Buffer.from(designMd, "utf8").toString("base64");

  console.log("Uploading DESIGN.md...");
  stitchTool("upload_design_md", { projectId, designMdBase64 });

  console.log("Creating design system from DESIGN.md...");
  try {
    stitchTool("create_design_system_from_design_md", { projectId });
  } catch (e) {
    console.warn("Design system step:", e.message);
  }

  const projectMeta = stitchTool("get_project", { name: `projects/${projectId}` });
  const designSystem =
    projectMeta.designTheme?.designSystem ||
    projectMeta.screenInstances?.find((s) => s.type === "DESIGN_SYSTEM_INSTANCE")?.sourceAsset;

  const manifest = { projectId, pages: [], createdAt: new Date().toISOString() };

  for (const page of PAGES) {
    console.log(`\nGenerating: ${page.name}...`);
    try {
      const gen = stitchTool("generate_screen_from_text", {
        projectId,
        deviceType: "DESKTOP",
        modelId: "GEMINI_3_1_PRO",
        designSystem: designSystem || undefined,
        prompt: page.prompt,
      });
      console.log("  Session:", gen.sessionId);

      const screenId = await waitForScreen(projectId, gen.sessionId, 12);
      if (!screenId) {
        console.warn(`  Timeout waiting for ${page.name}`);
        continue;
      }

      console.log("  Screen ID:", screenId);
      const code = stitchTool("get_screen_code", { projectId, screenId });
      const html =
        typeof code === "string" ? code : code.html || code.content || JSON.stringify(code, null, 2);

      const safeName = page.route === "/" ? "home" : page.route.replace(/^\//, "");
      const htmlPath = path.join(exportDir, `${safeName}.html`);
      fs.writeFileSync(htmlPath, html);
      manifest.pages.push({ ...page, screenId, htmlPath });
      console.log("  Saved:", htmlPath);
    } catch (err) {
      console.error(`  Failed ${page.name}:`, err.message);
    }
  }

  fs.writeFileSync(path.join(exportDir, "manifest.json"), JSON.stringify(manifest, null, 2));
  fs.writeFileSync(path.join(root, "stitch-project.json"), JSON.stringify({ projectId }, null, 2));
  console.log("\nDone. Project:", projectId);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
