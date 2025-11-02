import nodemailer from "nodemailer";
import dns from "dns/promises";
import Email from "../models/Email.js";
import ApiKey from "../models/ApiKey.js";
import AppCredential from "../models/AppCredential.js";
import { decrypt } from "../utils/encryption.util.js";
import { info, error } from "../utils/logger.js";
import { emitEmailEvent } from "../routes/emailEventsRoutes.js";

/**
 * Email types that should use your global SMTP relay credentials
 */
const PUBLIC_TYPES = ["register", "forgot-password", "resend-verification"];

// Cache for transporters to avoid recreating them
const transporterCache = new Map();

export function startWorker(env) {
  const POLL_INTERVAL = Number(env.WORKER_INTERVAL_MS || 1000); // Reduced from 3000ms
  const BATCH_SIZE = Number(env.WORKER_BATCH_SIZE || 10); // Increased from 5
  const WORKER_INSTANCES = Number(env.WORKER_INSTANCES || 3); // New: Multiple workers
  const MAX_PARALLEL = Number(env.MAX_PARALLEL_EMAILS || 5); // Process emails in parallel

  /**
   * Validate recipient's domain MX record with caching
   */
  const domainCache = new Map();
  async function validateEmailDomain(to) {
    try {
      const domain = to.split("@")[1];
      if (!domain) return false;

      // Check cache first
      if (domainCache.has(domain)) {
        return domainCache.get(domain);
      }

      const mxRecords = await dns.resolveMx(domain);
      const isValid = mxRecords && mxRecords.length > 0;

      // Cache for 1 hour
      domainCache.set(domain, isValid);
      setTimeout(() => domainCache.delete(domain), 3600000);

      return isValid;
    } catch {
      return false;
    }
  }

  /**
   * Get or create a transporter (cached)
   */
  function getTransporter(config, cacheKey) {
    if (transporterCache.has(cacheKey)) {
      return transporterCache.get(cacheKey);
    }

    const transporter = nodemailer.createTransport(config);
    transporterCache.set(cacheKey, transporter);

    // Clear cache after 10 minutes
    setTimeout(() => transporterCache.delete(cacheKey), 600000);

    return transporter;
  }

  /**
   * Process a single email
   */
  async function processSingleEmail(email) {
    // Lock email to avoid double sending
    const claimed = await Email.findOneAndUpdate(
      { _id: email._id, status: "pending" },
      { $set: { status: "sending" } },
      { new: true }
    );

    if (!claimed) return;

    emitEmailEvent(claimed._id.toString(), "sending");

    try {
      // Step 1: Validate domain
      const isValidDomain = await validateEmailDomain(claimed.to);
      if (!isValidDomain) {
        const errorMsg = "Domain not found or has no MX records";
        await Email.updateOne(
          { _id: claimed._id },
          {
            $set: {
              status: "failed",
              lastError: errorMsg,
              nextAttemptAt: null,
            },
            $inc: { attempts: 1 },
          }
        );
        emitEmailEvent(claimed._id.toString(), {
          status: "failed",
          error: errorMsg,
        });
        error(`❌ Invalid domain for ${claimed.to}: ${errorMsg}`);
        return;
      }

      // Step 2: Determine email type
      const isPublicType = PUBLIC_TYPES.includes(claimed.type);

      let transporterConfig;
      let senderEmail;
      let cacheKey;

      if (isPublicType) {
        // Public: Use your global SMTP_RELAY credentials
        transporterConfig = {
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          requireTLS: true,
          auth: {
            user: env.SMTP_RELAY_USER,
            pass: env.SMTP_RELAY_PASS,
          },
          tls: { rejectUnauthorized: false },
          pool: true, // Enable connection pooling
          maxConnections: 5,
          maxMessages: 100,
        };
        senderEmail = env.SMTP_RELAY_USER;
        cacheKey = `public_${env.SMTP_RELAY_USER}`;

        info(`📤 Using PUBLIC SMTP for ${claimed.type} → ${claimed.to}`);
      } else {
        // Private: Use user's app credentials
        const apiKey = await ApiKey.findOne({
          user: claimed.user,
        });
        if (!apiKey || !apiKey.user) {
          throw new Error("API key not found or invalid");
        }

        const appCredential = await AppCredential.findOne({
          createdBy: apiKey.user,
        }).select("+appPassword");

        if (!appCredential) {
          throw new Error("User has no app credentials configured");
        }

        const decryptedAppPassword = decrypt(appCredential.appPassword);

        transporterConfig = {
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          requireTLS: true,
          auth: {
            user: appCredential.appUserEmail,
            pass: decryptedAppPassword,
          },
          tls: { rejectUnauthorized: false },
          pool: true, // Enable connection pooling
          maxConnections: 5,
          maxMessages: 100,
        };
        senderEmail = appCredential.appUserEmail;
        cacheKey = `user_${appCredential.appUserEmail}`;

        info(`📧 Using USER SMTP for ${claimed.to}`);
      }

      // Step 3: Get/Create transporter
      const transporter = getTransporter(transporterConfig, cacheKey);

      // Step 4: Send email
      await transporter.sendMail({
        from: claimed.from || senderEmail,
        to: claimed.to,
        subject: claimed.subject,
        text: claimed.text,
        html: claimed.html,
      });

      // Step 5: Mark as sent
      await Email.updateOne(
        { _id: claimed._id },
        {
          $set: { status: "sent", lastError: "", nextAttemptAt: null },
          $inc: { attempts: 1 },
        }
      );

      emitEmailEvent(claimed._id.toString(), "sent");
      info(`✅ Email sent successfully: ${claimed._id}`);
    } catch (err) {
      const errorMsg = err?.message || "Unknown email send error";

      // Exponential backoff for retries
      const retryDelay = Math.min(
        30000 * Math.pow(2, claimed.attempts || 0),
        300000
      );

      await Email.updateOne(
        { _id: claimed._id },
        {
          $set: {
            status: "failed",
            lastError: errorMsg,
            nextAttemptAt: new Date(Date.now() + retryDelay),
          },
          $inc: { attempts: 1 },
        }
      );

      emitEmailEvent(claimed._id.toString(), {
        status: "failed",
        error: errorMsg,
      });

      error(`❌ Failed to send email ${claimed._id}: ${errorMsg}`);
    }
  }

  /**
   * Worker instance - processes queue in batches with parallel execution
   */
  async function workerInstance(instanceId) {
    try {
      const emails = await Email.find({
        status: "pending",
        nextAttemptAt: { $lte: new Date() },
      })
        .sort({ createdAt: 1 })
        .limit(BATCH_SIZE);

      if (!emails.length) return;

      info(`⚙️ Worker #${instanceId}: Found ${emails.length} pending emails.`);

      // Process emails in parallel batches
      const chunks = [];
      for (let i = 0; i < emails.length; i += MAX_PARALLEL) {
        chunks.push(emails.slice(i, i + MAX_PARALLEL));
      }

      for (const chunk of chunks) {
        await Promise.allSettled(
          chunk.map((email) => processSingleEmail(email))
        );
      }
    } catch (err) {
      error(`Worker #${instanceId} batch error: ${err.message}`);
    }
  }

  /**
   * Start multiple worker instances
   */
  info(
    `🚀 Starting ${WORKER_INSTANCES} Email Workers (poll: ${POLL_INTERVAL}ms, batch: ${BATCH_SIZE}, parallel: ${MAX_PARALLEL})`
  );

  // Start multiple worker instances with staggered timing
  for (let i = 0; i < WORKER_INSTANCES; i++) {
    setTimeout(() => {
      setInterval(() => workerInstance(i + 1), POLL_INTERVAL);
      info(`✨ Worker #${i + 1} started`);
    }, i * 200); // Stagger start by 200ms to avoid race conditions
  }

  // Cleanup cached transporters periodically
  setInterval(() => {
    const now = Date.now();
    info(`🧹 Cleaning up transporter cache (size: ${transporterCache.size})`);
  }, 600000); // Every 10 minutes
}
