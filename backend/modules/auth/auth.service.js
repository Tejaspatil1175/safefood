import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { User } from './user.model.js';
import { verifyGoogleIdToken } from './googleAuth.js';
import { UnauthorizedError } from '../../lib/errors.js';

const ACCESS_TOKEN_EXPIRES_IN = '1h';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

export function issueTokens(user) {
  const userId = user.id || user._id.toString();

  const accessPayload = {
    sub: userId,
    email: user.email,
    name: user.name,
    role: user.role || 'user',
  };

  const refreshPayload = {
    sub: userId,
    type: 'refresh',
  };

  const accessToken = jwt.sign(accessPayload, env.JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });

  const refreshToken = jwt.sign(refreshPayload, env.JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: 3600,
  };
}

export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET);
  } catch (err) {
    throw new UnauthorizedError(`Invalid access token: ${err.message}`);
  }
}

export function verifyRefreshToken(token) {
  try {
    const payload = jwt.verify(token, env.JWT_REFRESH_SECRET);
    if (payload.type !== 'refresh') {
      throw new UnauthorizedError('Token is not a valid refresh token');
    }
    return payload;
  } catch (err) {
    throw new UnauthorizedError(`Invalid refresh token: ${err.message}`);
  }
}

export async function loginWithGoogle(idToken) {
  const googleData = await verifyGoogleIdToken(idToken);

  let user = await User.findOne({
    $or: [{ googleId: googleData.googleId }, { email: googleData.email }],
  });

  if (!user) {
    user = await User.create({
      googleId: googleData.googleId,
      email: googleData.email,
      name: googleData.name,
      avatar: googleData.avatar,
      role: 'user',
    });
  } else if (!user.googleId) {
    user.googleId = googleData.googleId;
    if (googleData.avatar && !user.avatar) {
      user.avatar = googleData.avatar;
    }
    await user.save();
  }

  const tokens = issueTokens(user);

  return {
    user,
    ...tokens,
  };
}

export async function refreshUserTokens(refreshToken) {
  if (!refreshToken) {
    throw new UnauthorizedError('Refresh token is required');
  }

  const decoded = verifyRefreshToken(refreshToken);
  const user = await User.findById(decoded.sub);

  if (!user) {
    throw new UnauthorizedError('User not found or account deactivated');
  }

  const tokens = issueTokens(user);

  return {
    user,
    ...tokens,
  };
}

export default {
  issueTokens,
  verifyAccessToken,
  verifyRefreshToken,
  loginWithGoogle,
  refreshUserTokens,
};
