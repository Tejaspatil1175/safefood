import { isDbConnected, getDbState } from '../../infra/db.js';

export function getHealthStatus() {
  return {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };
}

export function getReadinessStatus() {
  const dbConnected = isDbConnected();
  const dbState = getDbState();

  return {
    status: dbConnected ? 'ok' : 'degraded',
    db: dbConnected ? 'up' : 'down',
    dbState,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };
}

export default {
  getHealthStatus,
  getReadinessStatus,
};
