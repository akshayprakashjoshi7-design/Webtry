import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../../server/app.js";

test("health endpoint returns a truthful service status", async (t) => {
  const app = createApp();
  const server = app.listen(0);
  t.after(() => server.close());
  await new Promise((resolve) => server.once("listening", resolve));
  const address = server.address();
  const response = await fetch(`http://127.0.0.1:${address.port}/api/health`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.status, "ok");
  assert.equal(body.service, "techvision-api");
  assert.equal(typeof body.configuredServices.gemini, "boolean");
});
