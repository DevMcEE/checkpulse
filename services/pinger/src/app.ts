import cors from 'cors';
import express from 'express';
import { errorHandlerMiddleware } from './middlewares/errorHandler.middleware';
import { pingRouter } from './routes/ping.routes';
import { httpLogger, logger } from '@checkpulse/logger';
const app = express();

app.use(cors());
app.use(httpLogger);
app.use('/ping', pingRouter);

app.use(errorHandlerMiddleware);

export const startServer = (port: number = 3000) => {
  const server = app.listen(port, () => {
    logger.info(`Pinger server running at http://localhost:${port}`);
  });

  // gracefull shutdown
  process.on('SIGTERM', () => {
    logger.warn('SIGTERM signal received: closing HTTP server!');
    server.close(() => {
      logger.info('HTTP server closed');
    });
  });

  return server;
};

export default app;
