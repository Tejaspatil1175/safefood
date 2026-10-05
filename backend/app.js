import express from 'express';
import pinoHttp from 'pino-http';
import { logger } from './lib/logger.js';
import { requestIdMiddleware } from './middlewares/requestId.js';
import { createRouter } from './routes.js';

export function createApp() {
  const app = express();

  app.use(requestIdMiddleware);
  app.use(
    pinoHttp({
      logger,
      customProps: (req) => ({ requestId: req.id }),
    }),
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const apiRouter = createRouter();
  app.use('/api/v1', apiRouter);

  return app;
}

export default createApp;
