import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import session from 'express-session';
import { GoogleGenerativeAI } from '@google/generative-ai';
import logger, { setupErrorHandlers } from "./config/logger";
import apiRoutes from "./routes/api";

// Initialize environment variables
dotenv.config();

const app: Application = express();
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    throw new Error("GEMINI_API_KEY not found in .env file");
}
// Adicione esta linha depois das outras rotas
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


// Middleware setup
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": ["'self'", "'unsafe-inline'"],
        },
    },
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "1kb" }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 2 * 60 * 60 * 1000, sameSite: 'lax' },
}));


// Rotas da API
app.use('/api', apiRoutes);

// Rota para a nossa funcionalidade de IA
app.post('/api/generate-post', async (req: Request, res: Response) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message (topic) is required.' });
        }

        const prompt = `Create a social media post (for Instagram) about the following topic: "${message}". The response should be professional, optimistic and include relevant hashtags. Format the response as a simple text, without JSON.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        return res.json({ response: text });

    } catch (error) {
        console.error('Error generating AI post:', error);
        return res.status(500).json({ error: 'An internal error occurred while communicating with the AI.' });
    }
});

// Outras rotas e tratamento de erros
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logger.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

export default app;