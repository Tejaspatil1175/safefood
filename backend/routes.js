import { Router } from 'express';
import { healthRouter } from './modules/health/health.routes.js';
import { rulesRouter } from './modules/rules/rules.routes.js';
import { productsRouter } from './modules/products/products.routes.js';
import { scansRouter } from './modules/scans/scans.routes.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { complaintsRouter } from './modules/complaints/complaints.routes.js';
import { districtsRouter } from './modules/districts/districts.routes.js';

export function createRouter() {
  const router = Router();

  router.use('/health', healthRouter);
  router.use('/rules', rulesRouter);
  router.use('/products', productsRouter);
  router.use('/scans', scansRouter);
  router.use('/auth', authRouter);
  router.use('/complaints', complaintsRouter);
  router.use('/districts', districtsRouter);

  return router;
}

export default createRouter;
