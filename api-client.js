import { CONFIG } from "./config.js";

export class ApiError extends Error {
  constructor(message, status = 0, code = "API_ERROR") {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export async function apiRequest(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CONFIG.requestTimeoutMs);
  try {
    const response = await fetch(`${CONFIG.apiBaseUrl}${path}`, {
      ...options,
      credentials: "same-origin",
      signal: options.signal ?? controller.signal,
      headers: {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers
      }
    });
    const contentType = response.headers.get("content-type") || "";
    const body = contentType.includes("application/json")
      ? await response.json()
      : await response.text();
    if (!response.ok) {
      const message = typeof body === "object" && body?.error?.message
        ? body.error.message
        : `Request failed (${response.status})`;
      throw new ApiError(message, response.status, body?.error?.code);
    }
    return body;
  } catch (error) {
    if (error.name === "AbortError") throw new ApiError("The request timed out.", 408, "TIMEOUT");
    if (error instanceof ApiError) throw error;
    throw new ApiError("The server could not be reached.", 0, "NETWORK_ERROR");
  } finally {
    clearTimeout(timeout);
  }
}
