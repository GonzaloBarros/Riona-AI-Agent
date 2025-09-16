import app from './app';
// import { setupHealthCheck } from './health';

const PORT = parseInt(process.env.PORT || '5001', 10);

// Configurar health check para Railway
// setupHealthCheck();

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});