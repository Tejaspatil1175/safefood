import { getHealthStatus, getReadinessStatus } from './health.service.js';

export function getHealth(req, res) {
  const health = getHealthStatus();
  return res.status(200).json(health);
}

export function getReadiness(req, res) {
  const readiness = getReadinessStatus();
  const statusCode = readiness.status === 'ok' ? 200 : 503;
  return res.status(statusCode).json(readiness);
}

export default {
  getHealth,
  getReadiness,
};
