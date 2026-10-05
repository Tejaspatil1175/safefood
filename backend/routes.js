import { Router } from 'express';
import { healthRouter } from './modules/health/health.routes.js';
import { rulesRouter } from './modules/rules/rules.routes.js';
import { productsRouter } from './modules/products/products.routes.js';

export function createRouter() {
  const router = Router();

  router.use('/health', healthRouter);
  router.use('/rules', rulesRouter);
  router.use('/products', productsRouter);

  return router;
}

export default createRouter;
