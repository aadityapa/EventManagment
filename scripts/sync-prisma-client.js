const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "../node_modules/.prisma/client");
const dest = path.join(__dirname, "../server/node_modules/.prisma/client");

if (!fs.existsSync(src)) {
  console.error("Prisma client not found at", src);
  process.exit(1);
}

fs.mkdirSync(path.dirname(dest), { recursive: true });

if (fs.existsSync(dest)) {
  fs.rmSync(dest, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
}

fs.cpSync(src, dest, { recursive: true });
console.log("Synced Prisma client to server/node_modules");
