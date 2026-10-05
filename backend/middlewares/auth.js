import { verifyAccessToken } from '../modules/auth/auth.service.js';
import { UnauthorizedError, ForbiddenError } from '../lib/errors.js';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Authentication required: Missing or invalid Bearer token'));
  }

  const token = authHeader.slice(7).trim();
  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    return next();
  } catch (err) {
    return next(err);
  }
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    try {
      const payload = verifyAccessToken(token);
      req.user = payload;
    } catch {
      // Optional auth: ignore token errors and proceed as guest
      req.user = null;
    }
  } else {
    req.user = null;
  }

  return next();
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError(`Access denied: Requires role ${allowedRoles.join(' or ')}`));
    }

    return next();
  };
}

export default {
  requireAuth,
  optionalAuth,
  requireRole,
};
