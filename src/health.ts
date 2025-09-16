import express from 'express';

export function setupHealthCheck(): void {
    const app = express();
    const PORT = process.env.PORT || 5001;

    app.get('/health', (req, res) => {
        res.status(200).json({ 
            status: 'online', 
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            service: 'Riona-AI-Agent'
        });
    });

    app.listen(PORT, () => {
        console.log(`Health server running on port ${PORT}`);
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