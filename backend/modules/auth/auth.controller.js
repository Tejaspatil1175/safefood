import {
  loginWithGoogle,
  registerCitizen,
  loginWithPassword,
  updateUserProfile,
  refreshUserTokens,
} from './auth.service.js';
import { User } from './user.model.js';
import { ValidationError, NotFoundError } from '../../lib/errors.js';
import { isDbConnected } from '../../infra/db.js';

export async function googleLogin(req, res, next) {
  try {
    const { idToken } = req.body || {};
    if (!idToken) {
      throw new ValidationError('idToken is required for Google authentication');
    }

    const result = await loginWithGoogle(idToken);
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
}

export async function register(req, res, next) {
  try {
    const { email, password, name, district, address, state, pincode, phoneNumber } = req.body || {};
    const result = await registerCitizen({
      email,
      password,
      name,
      district,
      address,
      state,
      pincode,
      phoneNumber,
    });
    return res.status(201).json(result);
  } catch (err) {
    return next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    const result = await loginWithPassword({ email, password });
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const userId = req.user?.sub;
    const { district, address, state, pincode, phoneNumber, name } = req.body || {};
    const user = await updateUserProfile(userId, { district, address, state, pincode, phoneNumber, name });
    return res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
}

export async function refreshToken(req, res, next) {
  try {
    const { refreshToken: token } = req.body || {};
    if (!token) {
      throw new ValidationError('refreshToken is required');
    }

    const result = await refreshUserTokens(token);
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    const userId = req.user?.sub;

    if (isDbConnected()) {
      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError('User profile not found');
      }
      return res.status(200).json(user);
    }

    return res.status(200).json({
      id: userId,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      district: req.user.district,
    });
  } catch (err) {
    return next(err);
  }
}

export default {
  googleLogin,
  register,
  login,
  updateProfile,
  refreshToken,
  getMe,
};
