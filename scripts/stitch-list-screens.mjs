import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { stitchTool } from "./stitch-api.mjs";

const root = path.dirname(fileURLToPath(import.meta.url)) + "/..";
const projectId = JSON.parse(fs.readFileSync(path.join(root, "stitch-project.json"), "utf8")).projectId;
const project = stitchTool("get_project", { name: `projects/${projectId}` });

function collectScreens(p) {
  const out = [];
  for (const s of p.screens || []) {
    out.push({ id: s.name?.split("/").pop(), title: s.title, name: s.name });
  }
  for (const inst of p.screenInstances || []) {
    const name = inst.sourceScreen || inst.name;
    if (name?.includes("/screens/")) {
      out.push({ id: name.split("/").pop(), title: inst.label || inst.title, name });
    }
  }
  return out;
}

const screens = collectScreens(project);
console.log(JSON.stringify(screens, null, 2));
