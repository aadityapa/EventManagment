import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { stitchTool } from "./stitch-api.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const projectId = JSON.parse(fs.readFileSync(path.join(root, "stitch-project.json"), "utf8")).projectId;

const designMd = fs.readFileSync(path.join(root, "DESIGN.md"), "utf8");
const designMdBase64 = Buffer.from(designMd, "utf8").toString("base64");

console.log("Uploading DESIGN.md to", projectId);
const upload = stitchTool("upload_design_md", { projectId, designMdBase64 });
console.log(JSON.stringify(upload, null, 2));

console.log("Creating design system...");
try {
  const ds = stitchTool("create_design_system_from_design_md", { projectId });
  console.log(JSON.stringify(ds, null, 2));
} catch (e) {
  console.warn("Design system:", e.message);
}
