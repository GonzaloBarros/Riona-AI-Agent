import express from 'express';

export function setupHealthCheck(): void {
    const app = express();
    const HEALTH_PORT = 8081; // Porta fixa diferente da principal
    
    app.get('/health', (req, res) => {
        res.status(200).json({
            status: 'online',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            service: 'AI-Community-Manager'
        });
    });
    
    app.listen(HEALTH_PORT, () => {
        console.log(`Health server running on port ${HEALTH_PORT}`);
        console.log(`Railway Environment: ${process.env.RAILWAY_ENVIRONMENT || 'local'}`);
    });
    
    // Error handling para Railway
    process.on('unhandledRejection', (error) => {
        console.error('Unhandled Rejection:', error);
    });
    
    process.on('uncaughtException', (error) => {
        console.error('Uncaught Exception:', error);
        process.exit(1);
    });
}