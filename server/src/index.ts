import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import fs from "fs";
import https from "https";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../.env") });

import authRoutes from "./routes/auth";
import bookingRoutes from "./routes/bookings";
import venueRoutes from "./routes/venues";
import vendorRoutes from "./routes/vendors";
import leadRoutes from "./routes/leads";
import paymentRoutes from "./routes/payments";
import adminRoutes from "./routes/admin";
import aiRoutes from "./routes/ai";
import cmsRoutes from "./routes/cms";
import { logError } from "./lib/http";
import { aiLimiter, globalLimiter, leadLimiter, moderateLimiter } from "./lib/rate-limit";

const app = express();
const PORT = process.env.API_PORT || 4000;
const HOST = process.env.API_HOST || "0.0.0.0";
const IS_PROD = process.env.NODE_ENV === "production";

// Refuse to boot without a real signing secret rather than serving 500s.
if (IS_PROD && (process.env.NEXTAUTH_SECRET?.trim().length ?? 0) < 32) {
  console.error("NEXTAUTH_SECRET (min 32 chars) is required in production");
  process.exit(1);
}

// Behind nginx / a load balancer: use X-Forwarded-For so rate limits are per
// client rather than one shared bucket for every visitor.
app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin: IS_PROD ? process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000" : true,
    credentials: true,
  })
);
app.use(morgan(IS_PROD ? "combined" : "dev"));
app.use(
  express.json({
    limit: "1mb",
    verify: (req, _res, buf) => {
      (req as unknown as { rawBody?: string }).rawBody = buf.toString("utf8");
    },
  })
);

// Whole-API ceiling; per-route limiters below are tighter where abuse is cheap.
app.use("/api/", globalLimiter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Nexyyra Events API", timestamp: new Date().toISOString() });
});

// Strict limits for credential and OTP endpoints live inside routes/auth.ts;
// /bookings/calculate carries its own inside routes/bookings.ts.
app.use("/api/auth", moderateLimiter, authRoutes);
app.use("/api/bookings", moderateLimiter, bookingRoutes);
app.use("/api/venues", moderateLimiter, venueRoutes);
app.use("/api/vendors", moderateLimiter, vendorRoutes);
app.use("/api/leads", leadLimiter, leadRoutes);
app.use("/api/payments", moderateLimiter, paymentRoutes);
app.use("/api/admin", moderateLimiter, adminRoutes);
app.use("/api/ai", aiLimiter, aiRoutes);
app.use("/api/cms", moderateLimiter, cmsRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err: Error & { type?: string; status?: number }, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // body-parser errors (malformed JSON, oversized body) are the client's fault.
  if (err.type === "entity.parse.failed") return res.status(400).json({ error: "Malformed JSON body" });
  if (err.type === "entity.too.large") return res.status(413).json({ error: "Request body too large" });
  logError("unhandled", err);
  res.status(500).json({ error: "Internal server error" });
});

function startServer() {
  const certFile = process.env.SSL_CERT_PATH || path.join(__dirname, "../../certs/cert.pem");
  const keyFile = process.env.SSL_KEY_PATH || path.join(__dirname, "../../certs/key.pem");
  const useHttps = process.env.USE_HTTPS === "true";

  if (useHttps && fs.existsSync(certFile) && fs.existsSync(keyFile)) {
    https
      .createServer(
        {
          key: fs.readFileSync(keyFile),
          cert: fs.readFileSync(certFile),
        },
        app
      )
      .listen(Number(PORT), HOST, () => {
        console.log(`Nexyyra Events API running on https://${HOST}:${PORT}`);
      });
    return;
  }

  app.listen(Number(PORT), HOST, () => {
    console.log(`Nexyyra Events API running on http://${HOST}:${PORT}`);
  });
}

startServer();

export default app;
