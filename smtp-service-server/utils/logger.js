// utils/logger.js
import { logEmitter } from "../routes/logStreamRoutes.js";

export function info(...args) {
  const message = args.join(" ");
  console.log("[INFO]", message);
  logEmitter.emit("log", {
    level: "info",
    message,
    time: new Date().toISOString(),
  });
}

export function error(...args) {
  const message = args.join(" ");
  console.error("[ERROR]", message);
  logEmitter.emit("log", {
    level: "error",
    message,
    time: new Date().toISOString(),
  });
}
