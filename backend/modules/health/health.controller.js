import { getHealthStatus } from './health.service.js';

export function getHealth(req, res) {
  const health = getHealthStatus();
  return res.status(200).json(health);
}

export default {
  getHealth,
};
