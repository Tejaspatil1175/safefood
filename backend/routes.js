import { Router } from 'express';
import { healthRouter } from './modules/health/health.routes.js';
import { rulesRouter } from './modules/rules/rules.routes.js';

export function createRouter() {
  const router = Router();

  router.use('/health', healthRouter);
  router.use('/rules', rulesRouter);

  return router;
}

export default createRouter;
