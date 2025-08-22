import cors from 'cors';
import express from 'express';
import { errorHandlerMiddleware } from './middlewares/errorHandler.middleware';
import { pingRouter } from './routes/ping.routes';

const app = express();

app.use(cors());

app.use('/ping', pingRouter);

app.use(errorHandlerMiddleware);

export const startServer = (port: number = 3000) => {
  const server = app.listen(port, () => {
    console.log(`Svc-pinger running at http://localhost:${port}`);
  });

  // gracefull shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
    });
  });

  return server;
};

export default app;
