// smtp/smtpServer.js
import { SMTPServer } from "smtp-server";
import { simpleParser } from "mailparser";
import Email from "../models/Email.js";
import { info, error } from "../utils/logger.js";

export default function startSmtpServer(port = 2525) {
  const server = new SMTPServer({
    authOptional: true,
    onData(stream, session, callback) {
      simpleParser(stream)
        .then(async (parsed) => {
          const from =
            (parsed.from && parsed.from.text) ||
            (session.envelope && session.envelope.mailFrom) ||
            "unknown@local";
          const to =
            (parsed.to && parsed.to.text) ||
            (session.envelope &&
              session.envelope.rcptTo &&
              session.envelope.rcptTo.join(",")) ||
            "";
          await Email.create({
            from,
            to,
            subject: parsed.subject || "",
            text: parsed.text || "",
            html: parsed.html || "",
          });
          info("Queued email from SMTP server:", from, "->", to);
          callback();
        })
        .catch((err) => {
          error("Failed to parse incoming SMTP message:", err);
          callback(err);
        });
    },
  });

  server.listen(port, () => {
    info(`SMTP server listening on port ${port}`);
  });

  return server;
}
