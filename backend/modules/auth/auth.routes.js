import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.js';
import { authLimiter } from '../../middlewares/rateLimit.js';
import { googleLogin, refreshToken, getMe } from './auth.controller.js';

export const authRouter = Router();

authRouter.use(authLimiter);

authRouter.post('/google', googleLogin);
authRouter.post('/refresh', refreshToken);
authRouter.get('/me', requireAuth, getMe);

export default authRouter;
