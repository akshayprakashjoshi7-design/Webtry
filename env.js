import "dotenv/config";

const integer = (value, fallback) => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV || "development",
  port: integer(process.env.PORT, 3000),
  appBaseUrl: process.env.APP_BASE_URL || "http://localhost:3000",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000"
});
