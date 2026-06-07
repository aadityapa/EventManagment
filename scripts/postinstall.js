if (process.env.VERCEL === "1") {
  console.log("Skipping Prisma generate on Vercel (frontend-only deploy)");
  process.exit(0);
}

const { execSync } = require("child_process");

execSync("npm run db:generate", { stdio: "inherit" });
