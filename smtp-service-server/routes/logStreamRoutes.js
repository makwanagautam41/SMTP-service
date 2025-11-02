import Log from "../models/Log.js";
import express from "express";
import EventEmitter from "events";

const router = express.Router();
export const logEmitter = new EventEmitter();

/**
 * SSE route for live log streaming
 */
router.get("/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.write("event: ping\ndata: connected\n\n");

  const listener = (log) => {
    res.write(`data: ${JSON.stringify(log)}\n\n`);
  };

  logEmitter.on("log", listener);

  req.on("close", () => {
    logEmitter.removeListener("log", listener);
  });
});

router.get("/latest", async (req, res) => {
  try {
    const logs = await Log.find().sort({ time: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
