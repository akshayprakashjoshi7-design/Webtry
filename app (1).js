import express from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "./config/env.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDir, "..");

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        imgSrc: ["'self'", "data:"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'"],
        upgradeInsecureRequests: env.nodeEnv === "production" ? [] : null
      }
    },
    crossOriginEmbedderPolicy: false
  }));

  app.use(cors({
    origin: env.corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
  }));
  app.use(compression());
  app.use(express.json({ limit: "256kb", strict: true }));
  app.use(express.urlencoded({ extended: false, limit: "32kb" }));
  app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

  app.get("/api/health", (_req, res) => {
    res.set("Cache-Control", "no-store").json({
      status: "ok",
      service: "techvision-api",
      timestamp: new Date().toISOString(),
      configuredServices: {
        database: Boolean(process.env.DATABASE_URL),
        redis: Boolean(process.env.REDIS_URL),
        gemini: Boolean(process.env.GEMINI_API_KEY),
        executionWorkers: process.env.EXECUTION_WORKER_CONFIGURATION === "configured",
        terminalGateway: process.env.TERMINAL_GATEWAY_CONFIGURATION === "configured"
      }
    });
  });

  app.use(express.static(projectRoot, {
    index: "index.html",
    dotfiles: "deny",
    fallthrough: true,
    setHeaders(res, filePath) {
      if (filePath.endsWith(".html")) res.setHeader("Cache-Control", "no-cache");
      else res.setHeader("X-Content-Type-Options", "nosniff");
    }
  }));

  app.use("/api", (_req, res) => {
    res.status(404).json({
      error: { code: "NOT_IMPLEMENTED", message: "This API endpoint is not implemented in this batch." }
    });
  });

  app.use((req, res) => {
    if (req.accepts("html")) return res.status(404).sendFile(path.join(projectRoot, "index.html"));
    return res.status(404).json({ error: { code: "NOT_FOUND", message: "Resource not found." } });
  });

  app.use((error, _req, res, _next) => {
    const status = Number.isInteger(error.status) && error.status >= 400 && error.status < 600
      ? error.status : 500;
    if (env.nodeEnv !== "production") console.error(error);
    res.status(status).json({
      error: {
        code: status === 500 ? "INTERNAL_ERROR" : "REQUEST_ERROR",
        message: status === 500 ? "An unexpected server error occurred." : error.message
      }
    });
  });

  return app;
}
