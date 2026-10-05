import { Router } from 'express';
import { getActiveRules } from './rules.controller.js';

export const rulesRouter = Router();

rulesRouter.get('/active', getActiveRules);

export default rulesRouter;
