import express, { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from 'dotenv';
import { scrapeFollowersHandler } from '../client/Instagram';
import logger from '../config/logger';

config();

const router = express.Router();
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    throw new Error("GEMINI_API_KEY not found in .env file");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Rota para gerar conteúdo com a IA
router.post('/generate-post', async (req: Request, res: Response) => {
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
        logger.error('Error generating AI post:', error);
        return res.status(500).json({ error: 'An internal error occurred while communicating with the AI.' });
    }
});

// Rota para obter seguidores
router.get('/scrape-followers', async (req: Request, res: Response) => {
    try {
        const { targetAccount, maxFollowers } = req.query;

        if (!targetAccount) {
            return res.status(400).json({ error: 'targetAccount is required.' });
        }

        const result = await scrapeFollowersHandler(String(targetAccount), Number(maxFollowers));
        
        if (Array.isArray(result)) {
            return res.json({ success: true, followers: result });
        } else {
            return res.status(400).json({ error: 'No followers found or unexpected result.' });
        }

    } catch (error) {
        logger.error('Error scraping followers:', error);
        return res.status(500).json({ error: (error as Error).message });
    }
});

// Rota para enviar DM
router.post('/dm', async (req: Request, res: Response) => {
    try {
        const { username, message } = req.body;

        if (!username || !message) {
            return res.status(400).json({ error: 'Username and message are required' });
        }
        
        return res.json({ success: true, message: 'DM sent successfully' });

    } catch (error) {
        logger.error('Error sending DM:', error);
        return res.status(500).json({ error: (error as Error).message });
    }
});

export default router;