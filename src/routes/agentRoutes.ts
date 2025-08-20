import express, { Request, Response } from 'express';
import logger from '../config/logger';

const router = express.Router();

// Rota para gerar conteúdo com a IA
router.post('/generate-post', async (req: Request, res: Response) => {
    try {
        const { message } = req.body;
        logger.info(`Recebido pedido para gerar post com o tema: "${message}"`);

        if (!message) {
            return res.status(400).json({ error: 'A mensagem (tema) é obrigatória.' });
        }

        // Resposta simulada da IA
        const aiResponse = `✅ Post gerado com sucesso sobre "${message}":\n\nEste é o espaço onde a IA irá desenvolver o texto, criar hashtags relevantes e sugerir uma imagem para a sua publicação.\n\n#medanalitics #esteticaavancada #dicasdepele`;

        return res.json({ response: aiResponse });

    } catch (error) {
        logger.error('Erro ao gerar post com IA:', error);
        return res.status(500).json({ error: 'Ocorreu um erro interno no servidor de IA.' });
    }
});

export default router;