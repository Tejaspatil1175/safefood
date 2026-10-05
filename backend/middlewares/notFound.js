import { NotFoundError } from '../lib/errors.js';

export function notFoundMiddleware(req, res, next) {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
}

export default notFoundMiddleware;
