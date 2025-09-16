// src/index.ts
import app from './app';
import * as net from 'net';

const findAvailablePort = (startPort: number): Promise<number> => {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(startPort, () => {
      const port = (server.address() as net.AddressInfo).port;
      server.close(() => resolve(port));
    });
    server.on('error', () => resolve(findAvailablePort(startPort + 1)));
  });
};

const startServer = async () => {
  const PORT = await findAvailablePort(parseInt(process.env.PORT || '5001', 10));
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Community Manager running on port ${PORT}`);
  });
};

startServer();