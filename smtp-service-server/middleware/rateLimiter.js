import rateLimit from "express-rate-limit";
import { ipKeyGenerator } from "express-rate-limit";

export const emailSendLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: {
    success: false,
    error: "Too many email send requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: ipKeyGenerator,
});

export const emailStatusLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: "Too many status requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: ipKeyGenerator,
});

export const generalApiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  message: {
    success: false,
    error: "Too many API requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: ipKeyGenerator,
});