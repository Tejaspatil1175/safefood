import express from 'express';
import { createRouter } from './routes.js';

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const apiRouter = createRouter();
  app.use('/api/v1', apiRouter);

  return app;
}

export default createApp;
