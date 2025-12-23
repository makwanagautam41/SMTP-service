import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiRouter = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default geminiRouter;
    