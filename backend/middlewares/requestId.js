import { randomUUID } from 'crypto';

export function requestIdMiddleware(req, res, next) {
  const existingId = req.header('x-request-id');
  const id = existingId || randomUUID();

  req.id = id;
  res.setHeader('x-request-id', id);

  next();
}

export default requestIdMiddleware;
