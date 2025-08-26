import cors from 'cors';
import express, { json } from 'express';
import { errorHandlerMiddleware } from './middlewares/errorHandler.middleware';
import { pingRouter } from './routes/ping.routes';
import { pingSetupsRouter } from './routes/ping-setups.routes';
import { httpLogger, logger } from '@checkpulse/logger';
const app = express();

app.use(cors());
app.use(json());
app.use(httpLogger);
app.use('/ping', pingRouter);

app.use('/ping-setups', pingSetupsRouter)

app.use(errorHandlerMiddleware);

export const startServer = (port: number = 3000) => {
  const server = app.listen(port, () => {
    console.log(`Pinger server running at http://localhost:${port}`)
    logger.info(`Pinger server running at http://localhost:${port}`);
  });

  // gracefull shutdown
  process.on('SIGTERM', () => {
    logger.warn('SIGTERM signal received: closing HTTP server!');
    server.close(() => {
      console.log(`HTTP server closed`)
      logger.info('HTTP server closed');
    });
  });

  return server;
};

export default app;
