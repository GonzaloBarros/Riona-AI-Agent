import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import session from "express-session";

// Carrega variáveis de ambiente
dotenv.config();

const app: Application = express();

// ---- Segurança e middlewares ----
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "'unsafe-inline'"],
      },
    },
  })
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "1kb" }));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 2 * 60 * 60 * 1000, sameSite: "lax" },
  })
);

// ---- Health route ----
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "online",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: "AI-Community-Manager",
  });
});

// Aqui você pode adicionar outras rotas da aplicação, por exemplo:
// app.use("/api", apiRoutes);

export default app;
