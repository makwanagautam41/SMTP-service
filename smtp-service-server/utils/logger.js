import Log from "../models/Log.js";
import { logEmitter } from "../routes/logStreamRoutes.js";

export async function info(...args) {
  const message = args.join(" ");
  console.log("[INFO]", message);

  const logEntry = await Log.create({
    level: "info",
    message,
  });

  logEmitter.emit("system", logEntry);
}

export async function error(...args) {
  const message = args.join(" ");
  console.error("[ERROR]", message);

  const logEntry = await Log.create({
    level: "error",
    message,
  });

  logEmitter.emit("system", logEntry);
}
