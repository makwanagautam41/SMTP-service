import express from "express";
import EventEmitter from "events";
import { internalSecretAuth } from "../middleware/internalSecretAuth.js";
import { apiKeyAuth } from "../middleware/apiKeyAuth.js";

const router = express.Router();
const emailEmitter = new EventEmitter();

/**
 * Function used by worker to broadcast email status updates
 * Supports both string and object payloads.
 */
export function emitEmailEvent(id, payload) {
  const eventData =
    typeof payload === "string"
      ? { id, status: payload, time: new Date().toISOString() }
      : { id, time: new Date().toISOString(), ...payload };

  emailEmitter.emit(id, eventData);
}

/**
 * Client subscribes to live updates for a specific email ID
 * Supports both internal secret (for user server) and API key auth (for external users)
 */
const handleEvents = async (req, res) => {
  const isInternal = internalSecretAuth(req);
  
  if (!isInternal) {
    // Try API key auth for external users
    try {
      await new Promise((resolve, reject) => {
        apiKeyAuth(req, res, (err) => (err ? reject(err) : resolve()));
      });
    } catch (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }

  const { id } = req.params;

  // Set up SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Initial ping to confirm connection
  res.write("event: ping\ndata: connected\n\n");

  const listener = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Subscribe to specific email ID events
  emailEmitter.on(id, listener);

  // Cleanup when connection closes
  req.on("close", () => {
    emailEmitter.removeListener(id, listener);
  });
};

router.get("/events/:id", handleEvents);
router.options("/events/:id", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-api-key, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.status(204).end();
});

export default router;
