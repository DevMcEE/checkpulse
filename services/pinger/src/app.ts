import { httpLogger, logger } from '@checkpulse/logger';
import cors from 'cors';
import express, { json } from 'express';
import { errorHandlerMiddleware } from './middlewares/error-handler.middleware';
import { pingRouter } from './routes/ping.routes';
import { pingSetupsRouter } from './routes/ping-setups.routes';

const app = express();

app.use(cors());
app.use(json());

app.use(httpLogger);

app.use('/ping', pingRouter);

app.use('/ping-setups', pingSetupsRouter);
app.use(errorHandlerMiddleware);

export const startServer = () => {
  const server = app.listen(0, () => {
    logger.info(`Pinger server running`);
  });
  server.addListener('error', (err) => {
    logger.error(err, 'FUCKUP');
  });

  // gracefull shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server!');
    server.close(() => {
      logger.info('HTTP server closed');
    });
  });
  return server;
};

export default app;
