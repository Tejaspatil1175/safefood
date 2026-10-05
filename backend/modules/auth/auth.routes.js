import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.js';
import { googleLogin, refreshToken, getMe } from './auth.controller.js';

export const authRouter = Router();

authRouter.post('/google', googleLogin);
authRouter.post('/refresh', refreshToken);
authRouter.get('/me', requireAuth, getMe);

export default authRouter;
