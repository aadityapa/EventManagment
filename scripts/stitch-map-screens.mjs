import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { stitchTool } from "./stitch-api.mjs";

const root = path.dirname(fileURLToPath(import.meta.url)) + "/..";
const projectId = JSON.parse(fs.readFileSync(path.join(root, "stitch-project.json"), "utf8")).projectId;

const ids = [
  "282b322769914a039960f4f5a9a10a35",
  "2ffee7cd467d4b90b89f9052e887aeff",
  "333b97fc5f54446381ef869a1ff52051",
  "7d30445230524da0a7153ed9eb8c9b27",
  "b682017409e2466187ecd7757bfd5009",
  "cd20bf24f4044fbbb0d51556086960fb",
  "d85bb382fa8c44a8b3f5283cd7ecff59",
];

for (const id of ids) {
  try {
    const s = stitchTool("get_screen", {
      name: `projects/${projectId}/screens/${id}`,
      projectId,
      screenId: id,
    });
    console.log(id, "→", s.title || s.displayName || s.label || "untitled");
  } catch (e) {
    console.log(id, "→ error:", e.message.slice(0, 80));
  }
}
