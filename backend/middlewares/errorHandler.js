import { ZodError } from 'zod';
import { AppError } from '../lib/errors.js';
import { logger } from '../lib/logger.js';
import { env } from '../config/env.js';

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const requestId = req.id || req.headers['x-request-id'] || 'unknown';

  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'Internal server error';
  let details = [];

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    details = err.details || [];
  } else if (err instanceof ZodError) {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Validation error';
    details = err.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));
  } else if (err.status || err.statusCode) {
    statusCode = err.status || err.statusCode;
    message = err.message;
  } else {
    // Unhandled exception
    if (env.NODE_ENV !== 'production') {
      message = err.message;
    }
  }

  // Log error
  const logMethod = statusCode >= 500 ? logger.error.bind(logger) : logger.warn.bind(logger);
  logMethod({
    requestId,
    statusCode,
    code,
    message: err.message,
    stack: statusCode >= 500 ? err.stack : undefined,
  }, `HTTP ${statusCode} - ${message}`);

  res.status(statusCode).json({
    error: {
      code,
      message,
      details,
      requestId,
    },
  });
}

export default errorHandler;
