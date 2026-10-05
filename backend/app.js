import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { logger } from './lib/logger.js';
import { requestIdMiddleware } from './middlewares/requestId.js';
import { notFoundMiddleware } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { createRouter } from './routes.js';

export function createApp() {
  const app = express();

  // Security & Cross-Origin
  app.use(helmet());
  app.use(cors());

  // Request tracing & logging
  app.use(requestIdMiddleware);
  app.use(
    pinoHttp({
      logger,
      customProps: (req) => ({ requestId: req.id }),
    }),
  );

  // Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API router
  const apiRouter = createRouter();
  app.use('/api/v1', apiRouter);

  // 404 handler
  app.use(notFoundMiddleware);

  // Central error handler
  app.use(errorHandler);

  return app;
}

export default createApp;
