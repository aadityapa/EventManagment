import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
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

const app = express();
const PORT = process.env.API_PORT || 4000;
const HOST = process.env.API_HOST || "0.0.0.0";

app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        : true,
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(
  express.json({
    limit: "10mb",
    verify: (req, _res, buf) => {
      (req as unknown as { rawBody?: string }).rawBody = buf.toString("utf8");
    },
  })
);

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use("/api/", limiter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Nexyyra Events API", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/cms", cmsRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
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
        console.log(`🎉 Nexyyra Events API running on https://${HOST}:${PORT}`);
      });
    return;
  }

  app.listen(Number(PORT), HOST, () => {
    console.log(`🎉 Nexyyra Events API running on http://${HOST}:${PORT}`);
  });
}

startServer();

export default app;
