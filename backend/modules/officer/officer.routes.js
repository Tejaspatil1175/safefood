import { Router } from 'express';
import { optionalAuth } from '../../middlewares/auth.js';
import { getOfficerStatsHandler } from './officer.controller.js';

export const officerRouter = Router();

officerRouter.get('/stats', optionalAuth, getOfficerStatsHandler);

export default officerRouter;
