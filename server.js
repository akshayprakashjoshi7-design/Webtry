import { createApp } from "./app.js";
import { env } from "./config/env.js";

const app = createApp();
const server = app.listen(env.port, () => {
  console.log(`TechVision listening at ${env.appBaseUrl}`);
  console.log("API health:", `${env.appBaseUrl}/api/health`);
});

function shutdown(signal) {
  console.log(`${signal} received; closing HTTP server...`);
  server.close((error) => {
    if (error) {
      console.error("Graceful shutdown failed.", error);
      process.exitCode = 1;
    }
  });
  setTimeout(() => process.exit(1), 10000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
