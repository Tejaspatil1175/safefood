import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { User, USER_ROLES } from './user.model.js';
import { verifyGoogleIdToken } from './googleAuth.js';
import { hashPassword, verifyPassword } from '../../lib/password.js';
import { UnauthorizedError, ValidationError, NotFoundError } from '../../lib/errors.js';

const ACCESS_TOKEN_EXPIRES_IN = '1h';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

export function issueTokens(user) {
  const userId = user.id || user._id.toString();

  const accessPayload = {
    sub: userId,
    email: user.email,
    name: user.name,
    role: user.role || USER_ROLES.CITIZEN,
    district: user.district ? user.district.trim().toUpperCase() : null,
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
      role: USER_ROLES.CITIZEN,
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

export async function registerCitizen({
  email,
  password,
  name,
  district = '',
  address = '',
  state = 'Maharashtra',
  pincode = '',
  phoneNumber = '',
}) {
  if (!email || !password || !name) {
    throw new ValidationError('Name, email, and password are required');
  }

  const cleanEmail = email.toLowerCase().trim();
  const existing = await User.findOne({ email: cleanEmail });
  if (existing) {
    throw new ValidationError('An account with this email address already exists');
  }

  const passwordHash = hashPassword(password);
  const user = await User.create({
    email: cleanEmail,
    passwordHash,
    name: name.trim(),
    role: USER_ROLES.CITIZEN,
    district: district ? district.trim().toUpperCase() : null,
    address: address.trim(),
    state: state.trim(),
    pincode: pincode.trim(),
    phoneNumber: phoneNumber.trim(),
  });

  const tokens = issueTokens(user);
  return {
    user,
    ...tokens,
  };
}

export async function loginWithPassword({ email, password }) {
  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  const cleanEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: cleanEmail });
  if (!user || !user.passwordHash) {
    throw new UnauthorizedError('Invalid email or password');
  }

  if (!user.isActive) {
    throw new UnauthorizedError('Account is deactivated. Please contact your administrator.');
  }

  const isMatch = verifyPassword(password, user.passwordHash);
  if (!isMatch) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const tokens = issueTokens(user);
  return {
    user,
    ...tokens,
  };
}

export async function updateUserProfile(userId, { district, address, state, pincode, phoneNumber, name }) {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (name !== undefined) user.name = name.trim();
  if (district !== undefined) user.district = district ? district.trim().toUpperCase() : null;
  if (address !== undefined) user.address = address.trim();
  if (state !== undefined) user.state = state.trim();
  if (pincode !== undefined) user.pincode = pincode.trim();
  if (phoneNumber !== undefined) user.phoneNumber = phoneNumber.trim();

  await user.save();
  return user;
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
  registerCitizen,
  loginWithPassword,
  updateUserProfile,
  refreshUserTokens,
};
