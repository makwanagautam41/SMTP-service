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

export function startWorker(env) {
  const POLL_INTERVAL = Number(env.WORKER_INTERVAL_MS || 3000);
  const BATCH_SIZE = Number(env.WORKER_BATCH_SIZE || 5);

  /**
   * Validate recipient's domain MX record
   */
  async function validateEmailDomain(to) {
    try {
      const domain = to.split("@")[1];
      if (!domain) return false;
      const mxRecords = await dns.resolveMx(domain);
      return mxRecords && mxRecords.length > 0;
    } catch {
      return false;
    }
  }

  /**
   * Main background worker loop
   */
  async function processQueue() {
    try {
      const emails = await Email.find({
        status: "pending",
        nextAttemptAt: { $lte: new Date() },
      })
        .sort({ createdAt: 1 })
        .limit(BATCH_SIZE);

      if (!emails.length) return;
      info(`⚙️ Found ${emails.length} pending emails.`);

      for (const email of emails) {
        // Lock email to avoid double sending
        const claimed = await Email.findOneAndUpdate(
          { _id: email._id, status: "pending" },
          { $set: { status: "sending" } },
          { new: true }
        );
        if (!claimed) continue;

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
            continue;
          }

          // Step 2: Determine email type
          const isPublicType = PUBLIC_TYPES.includes(claimed.type);

          let transporterConfig;
          let senderEmail;

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
            };
            senderEmail = env.SMTP_RELAY_USER;

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
            };
            senderEmail = appCredential.appUserEmail;

            info(`📧 Using USER SMTP for ${claimed.to}`);
          }

          // Step 3: Create transporter
          const transporter = nodemailer.createTransport(transporterConfig);

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

          await Email.updateOne(
            { _id: claimed._id },
            {
              $set: {
                status: "failed",
                lastError: errorMsg,
                nextAttemptAt: new Date(Date.now() + 30 * 1000), // retry later
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
    } catch (err) {
      error(`Worker batch error: ${err.message}`);
    }
  }

  info(
    `🚀 Email Worker started (poll every ${POLL_INTERVAL}ms, batch size ${BATCH_SIZE})`
  );
  setInterval(processQueue, POLL_INTERVAL);
}
