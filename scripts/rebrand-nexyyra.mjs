import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIRS = ["apps/web", "server/src", "prisma"];
const EXT = new Set([".ts", ".tsx", ".json", ".html", ".md"]);

const REPLACEMENTS = [
  ["Glitz Events &amp; Promotions", "Nexyyra Events"],
  ["Glitz Events & Promotions", "Nexyyra Events"],
  ["GLITZ EVENTS", "NEXYYRA EVENTS"],
  ["Glitz Events", "Nexyyra Events"],
  ["Hello Glitz", "Hello Nexyyra"],
  ["Hi Glitz!", "Hi Nexyyra!"],
  ["with Glitz", "with Nexyyra"],
  ["Glitz's", "Nexyyra's"],
  ["Glitz quality", "Nexyyra quality"],
  ["Glitz planning", "Nexyyra planning"],
  ["Glitz Planners", "Nexyyra Planners"],
  ["Glitz team", "Nexyyra team"],
  ["Glitz executes", "Nexyyra executes"],
  ["Glitz brings", "Nexyyra brings"],
  ["Why Glitz", "Why Nexyyra"],
  ["Why Choose Glitz", "Why Choose Nexyyra"],
  ["The Glitz Difference", "The Nexyyra Difference"],
  ["The Glitz Event Experience", "The Nexyyra Experience"],
  ["The Glitz Journal", "The Nexyyra Journal"],
  ["The Glitz Collection", "The Nexyyra Collection"],
  ["Glitz Assistant", "Nexyyra Assistant"],
  ["I'm Glitz's", "I'm Nexyyra's"],
  ["Glitz Logo", "Nexyyra Logo"],
  ["Glitz Event is", "Nexyyra experience is"],
  ["every Glitz Event", "every Nexyyra experience"],
  ["Glitz+Events", "Nexyyra+Events"],
  ["hello@glitzevents.in", "hello@nexyyraevents.in"],
  ["@glitzevents", "@nexyyraevents"],
  ["instagram.com/glitzevents", "instagram.com/nexyyraevents"],
  ["facebook.com/glitzevents", "facebook.com/nexyyraevents"],
  ["youtube.com/glitzevents", "youtube.com/nexyyraevents"],
  ["linkedin.com/company/glitzevents", "linkedin.com/company/nexyyraevents"],
  ["Glitz-", "Nexy-"],
  ["Glitz-exit-intent", "Nexyyra-exit-intent"],
  ["Every Glitz", "Every Nexyyra"],
  ["engaging Glitz", "engaging Nexyyra"],
  ["Can Glitz", "Can Nexyyra"],
  ["does Glitz", "does Nexyyra"],
  ["Glitz maintains", "Nexyyra maintains"],
  ["Glitz destination", "Nexyyra destination"],
  ["Glitz made", "Nexyyra made"],
  ["Glitz understands", "Nexyyra understands"],
  ["through Glitz", "through Nexyyra"],
  ["partner with Glitz", "partner with Nexyyra"],
  ["You are Glitz", "You are Nexyyra"],
  ["for Glitz", "for Nexyyra"],
  ["Glitz", "Nexyyra"],
  ["We are Glitz", "We are Nexyyra"],
  ["Founded by Priya Sharma in Pune in 2012, Glitz began", "Founded by Priya Sharma in Pune in 2012, Nexyyra began"],
];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.name === "node_modules" || entry.name === ".next") continue;
    if (entry.isDirectory()) walk(full, files);
    else if (EXT.has(path.extname(entry.name))) files.push(full);
  }
  return files;
}

let count = 0;
for (const dir of DIRS) {
  for (const file of walk(path.join(ROOT, dir))) {
    let content = fs.readFileSync(file, "utf8");
    const original = content;
    for (const [from, to] of REPLACEMENTS) {
      content = content.split(from).join(to);
    }
    if (content !== original) {
      fs.writeFileSync(file, content, "utf8");
      count++;
    }
  }
}
console.log(`Files modified: ${count}`);
