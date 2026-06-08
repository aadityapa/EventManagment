import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { stitchTool } from "./stitch-api.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const projectId = JSON.parse(fs.readFileSync(path.join(root, "stitch-project.json"), "utf8")).projectId;

const project = stitchTool("get_project", { name: `projects/${projectId}` });
console.log(JSON.stringify(project, null, 2));
