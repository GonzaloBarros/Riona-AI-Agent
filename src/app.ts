import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import session from "express-session";
import { GoogleGenerativeAI } from "@google/generative-ai";
import logger from "./config/logger";
import apiRoutes from "./routes/api";

// Carrega variáveis de ambiente
dotenv.config();

const app: Application = express();

// ==== Gemini (obrigatório) ====
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error("GEMINI_API_KEY not found in .env file");
}
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// ==== Middlewares ====
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        // compatível com versões diferentes do helmet
        ...(helmet.contentSecurityPolicy?.getDefaultDirectives
          ? helmet.contentSecurityPolicy.getDefaultDirectives()
          : {}),
        "script-src": ["'self'", "'unsafe-inline'"],
      },
    },
  })
);

app.use(
  cors({
    origin: "*", // ajuste se quiser restringir a domínios específicos
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "1kb" }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 2 * 60 * 60 * 1000, sameSite: "lax" },
    // Em produção, considere usar um store (ex.: connect-mongo) para remover o warning do MemoryStore
  })
);

// ==== Health dentro do MESMO servidor (sem porta separada) ====
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "online",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: "AI-Community-Manager",
  });
});

// ==== Rotas da API existentes ====
app.use("/api", apiRoutes);

// ==== Endpoint de IA (exemplo) ====
app.post("/api/generate-post", async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message (topic) is required." });
    }

    const prompt = `Create a social media post (for Instagram) about the following topic: "${message}". The response should be professional, optimistic and include relevant hashtags. Format the response as a simple text, without JSON.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return res.json({ response: text });
  } catch (error) {
    console.error("Error generating AI post:", error);
    return res
      .status(500)
      .json({ error: "An internal error occurred while communicating with the AI." });
  }
});

// ==== Handler de erros ====
app.use(
  (err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logger?.error?.("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
);

export default app;
