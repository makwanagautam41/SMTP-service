// routes/emailRoutes.js
import express from "express";
import Email from "../models/Email.js";
import { info } from "../utils/logger.js";
import { apiKeyAuth } from "../middleware/apiKeyAuth.js";

const router = express.Router();

/**
 * POST /api/email/send
 * Body: {  to, subject, text, html, meta }
 * This queues the email in MongoDB for worker to pick up.
 */
router.post("/send", apiKeyAuth, async (req, res) => {
  try {
    const { to, subject, text, html, meta } = req.body;
    const from = req.fromEmail;
    if (!from || !to) {
      return res.status(400).json({ error: "from and to required" });
    }
    const email = await Email.create({
      from,
      to,
      subject,
      text,
      html,
      meta,
    });
    info("Queued email id:", email._id);
    res.status(201).json({ success: true, id: email._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to queue email" });
  }
});

/**
 * GET status
 */
router.get("/status/:id", async (req, res) => {
  try {
    const e = await Email.findById(req.params.id).lean();
    if (!e) return res.status(404).json({ error: "not found" });
    res.json(e);
  } catch (err) {
    res.status(500).json({ error: "server error" });
  }
});

/**
 * Optional immediate send (blocking) - use with caution
 */
router.get("/logs", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50; // default 50
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
