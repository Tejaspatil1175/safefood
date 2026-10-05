import { Router } from 'express';
import { healthRouter } from './modules/health/health.routes.js';

export function createRouter() {
  const router = Router();

  router.use('/health', healthRouter);

  return router;
}

export default createRouter;
