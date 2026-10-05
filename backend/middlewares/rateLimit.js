import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

const isTest = env.NODE_ENV === 'test';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isTest ? 0 : 300,
  skip: () => isTest,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests from this IP, please try again later.',
    },
  },
});

// Stricter rate limiter for scan upload and OCR processing
export const scanLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isTest ? 0 : 40,
  skip: () => isTest,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Scan processing rate limit reached. Please wait a few minutes before submitting new scans.',
    },
  },
});

// Stricter rate limiter for auth requests
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isTest ? 0 : 25,
  skip: () => isTest,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      message: 'Too many authentication attempts. Please try again after 15 minutes.',
    },
  },
});

export default {
  apiLimiter,
  scanLimiter,
  authLimiter,
};
