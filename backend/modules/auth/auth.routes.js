import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.js';
import { authLimiter } from '../../middlewares/rateLimit.js';
import {
  googleLogin,
  register,
  login,
  updateProfile,
  refreshToken,
  getMe,
} from './auth.controller.js';

export const authRouter = Router();

authRouter.use(authLimiter);

authRouter.post('/google', googleLogin);
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/refresh', refreshToken);
authRouter.get('/me', requireAuth, getMe);
authRouter.patch('/profile', requireAuth, updateProfile);
authRouter.post('/logout', (req, res) => {
  return res.status(200).json({ status: 'ok', message: 'Logged out successfully' });
});

export default authRouter;
