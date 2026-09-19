import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import geminiRouter from "./routes/geminiRoutes.js";
import cookieParser from "cookie-parser";
import { authLimiter, emailLimiter, apiLimiter, generalLimiter } from "./middleware/rateLimiter.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://smtplite.vercel.app"],
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "x-api-key", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

app.use("/api/users", generalLimiter);
app.use("/api/users/register", authLimiter);
app.use("/api/users/login", authLimiter);
app.use("/api/users/forgot-password", authLimiter);
app.use("/api/users/reset-password", authLimiter);
app.use("/api/users/create-api-key", apiLimiter);
app.use("/api/users/app/create-credentials", apiLimiter);
app.use("/api/users/create-email-template", apiLimiter);
app.use("/api/gemini", apiLimiter);

app.use("/api/users", userRouter);
app.use("/api/gemini", geminiRouter);

// start server
(async function bootstrap() {
  await connectDB(process.env.MONGO_URI);

  app.listen(PORT, () => {
    console.log(`User API server listening on port ${PORT}`);
  });
})();
