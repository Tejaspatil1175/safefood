import fs from 'fs';
import path from 'path';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { logger } from './lib/logger.js';
import { requestIdMiddleware } from './middlewares/requestId.js';
import { notFoundMiddleware } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { apiLimiter } from './middlewares/rateLimit.js';
import { createRouter } from './routes.js';

export function createApp() {
  const app = express();

  // Security & Cross-Origin
  app.use(helmet({ contentSecurityPolicy: false }));
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

  // Root & Static Test UI
  app.use(express.static(path.resolve(process.cwd(), '..')));
  app.use(express.static(process.cwd()));
  app.get('/', (req, res) => {
    const rootIndex = path.resolve(process.cwd(), '..', 'index.html');
    const localIndex = path.resolve(process.cwd(), 'index.html');
    if (fs.existsSync(rootIndex)) {
      return res.sendFile(rootIndex);
    }
    if (fs.existsSync(localIndex)) {
      return res.sendFile(localIndex);
    }
    return res.json({ status: 'ok', message: 'SafeFood API is operational. Upload scans at /api/v1/scans' });
  });

  // API router
  const apiRouter = createRouter();
  app.use('/api/v1', apiLimiter, apiRouter);

  // 404 handler
  app.use(notFoundMiddleware);

  // Central error handler
  app.use(errorHandler);

  return app;
}

export default createApp;
