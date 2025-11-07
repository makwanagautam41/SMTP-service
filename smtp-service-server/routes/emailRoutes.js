import express from "express";
import Email from "../models/Email.js";
import { info } from "../utils/logger.js";
import { apiKeyAuth } from "../middleware/apiKeyAuth.js";
import { getWorker } from "../workers/worker.js";

const router = express.Router();

function wakeWorker() {
  try {
    setImmediate(() => {
      getWorker()
        .tick()
        .catch((e) => {});
      setTimeout(() => getWorker().logCacheSize(), 0);
    });
  } catch {}
}

router.post("/send", apiKeyAuth, async (req, res) => {
  try {
    const { to, subject, text, html, meta, type } = req.body;
    const from = req.fromEmail;
    const user = req.fromUserId;
    if (!from || !to)
      return res.status(400).json({ error: "from and to required" });

    const email = await Email.create({
      from,
      to,
      subject,
      text,
      html,
      meta,
      type,
      user,
    });
    info("Queued email id:", email._id);

    wakeWorker();

    res.status(201).json({ success: true, id: email._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to queue email" });
  }
});

router.get("/status/:id", async (req, res) => {
  try {
    const e = await Email.findById(req.params.id).lean();
    if (!e) return res.status(404).json({ error: "not found" });
    res.json(e);
  } catch {
    res.status(500).json({ error: "server error" });
  }
});

router.get("/status", async (req, res) => {
  try {
    const emails = await Email.find({ from: req.body.email }).lean();
    if (!emails || emails.length === 0)
      return res
        .status(404)
        .json({ error: "No emails found for this address" });
    res.json(emails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/emails", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const emails = await Email.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .select(
        "_id from to subject status attempts lastError createdAt updatedAt"
      );
    res.json({ success: true, emails });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

export default router;
