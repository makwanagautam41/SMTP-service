// import nodemailer from "nodemailer";
// import Email from "../models/Email.js";
// import { info, error } from "../utils/logger.js";
// import { emitEmailEvent } from "../routes/emailEventsRoutes.js";

// export function startWorker(env) {
//   const POLL_INTERVAL = Number(env.WORKER_INTERVAL_MS || 3000);
//   const BATCH_SIZE = Number(env.WORKER_BATCH_SIZE || 5);

//   async function processQueue() {
//     try {
//       const emails = await Email.find({
//         status: "pending",
//         nextAttemptAt: { $lte: new Date() },
//       })
//         .sort({ createdAt: 1 })
//         .limit(BATCH_SIZE);

//       if (!emails.length) return;

//       info(`⚙️ Found ${emails.length} pending emails.`);

//       for (const email of emails) {
//         const claimed = await Email.findOneAndUpdate(
//           { _id: email._id, status: "pending" },
//           { $set: { status: "sending" } },
//           { new: true }
//         );

//         if (!claimed) continue;

//         emitEmailEvent(claimed._id.toString(), "sending"); // 👈 notify client

//         try {
//           const transporter = nodemailer.createTransport({
//             host: env.SMTP_RELAY_HOST || "smtp.gmail.com",
//             port: env.SMTP_RELAY_PORT ? Number(env.SMTP_RELAY_PORT) : 587,
//             secure: false,
//             requireTLS: true,
//             auth: {
//               user: env.SMTP_RELAY_USER,
//               pass: env.SMTP_RELAY_PASS,
//             },
//             tls: { rejectUnauthorized: false },
//           });

//           await transporter.sendMail({
//             from: claimed.from,
//             to: claimed.to,
//             subject: claimed.subject,
//             text: claimed.text,
//             html: claimed.html,
//           });

//           await Email.updateOne(
//             { _id: claimed._id },
//             {
//               $set: { status: "sent", lastError: "", nextAttemptAt: null },
//               $inc: { attempts: 1 },
//             }
//           );

//           emitEmailEvent(claimed._id.toString(), "sent"); // 👈 notify success
//           info(`✅ Email sent successfully: ${claimed._id}`);
//         } catch (err) {
//           await Email.updateOne(
//             { _id: claimed._id },
//             {
//               $set: {
//                 status: "failed",
//                 lastError: err.message,
//                 nextAttemptAt: new Date(Date.now() + 30 * 1000),
//               },
//               $inc: { attempts: 1 },
//             }
//           );

//           emitEmailEvent(claimed._id.toString(), "failed"); // 👈 notify failure
//           error(`❌ Failed to send email ${claimed._id}: ${err.message}`);
//         }
//       }
//     } catch (err) {
//       error(`Worker batch error: ${err.message}`);
//     }
//   }

//   info(
//     `🚀 Worker started (poll every ${POLL_INTERVAL}ms, batch size ${BATCH_SIZE})`
//   );
//   setInterval(processQueue, POLL_INTERVAL);
// }

// workers/emailWorker.js
import nodemailer from "nodemailer";
import dns from "dns/promises";
import Email from "../models/Email.js";
import { info, error } from "../utils/logger.js";
import { emitEmailEvent } from "../routes/emailEventsRoutes.js";

export function startWorker(env) {
  const POLL_INTERVAL = Number(env.WORKER_INTERVAL_MS || 3000);
  const BATCH_SIZE = Number(env.WORKER_BATCH_SIZE || 5);

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
        const claimed = await Email.findOneAndUpdate(
          { _id: email._id, status: "pending" },
          { $set: { status: "sending" } },
          { new: true }
        );

        if (!claimed) continue;

        emitEmailEvent(claimed._id.toString(), "sending");

        try {
          // 🧠 1️⃣ Validate email domain before sending
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
            continue; // Skip sending
          }

          // 2️⃣ Proceed with normal sending
          const transporter = nodemailer.createTransport({
            host: env.SMTP_RELAY_HOST || "smtp.gmail.com",
            port: env.SMTP_RELAY_PORT ? Number(env.SMTP_RELAY_PORT) : 587,
            secure: false,
            requireTLS: true,
            auth: {
              user: env.SMTP_RELAY_USER,
              pass: env.SMTP_RELAY_PASS,
            },
            tls: { rejectUnauthorized: false },
          });

          await transporter.sendMail({
            from: claimed.from,
            to: claimed.to,
            subject: claimed.subject,
            text: claimed.text,
            html: claimed.html,
          });

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
                nextAttemptAt: new Date(Date.now() + 30 * 1000),
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
    `🚀 Worker started (poll every ${POLL_INTERVAL}ms, batch size ${BATCH_SIZE})`
  );
  setInterval(processQueue, POLL_INTERVAL);
}
