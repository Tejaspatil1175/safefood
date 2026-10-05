import { describe, it, expect } from 'vitest';
import { getHealthStatus } from './health.service.js';

describe('Health Service', () => {
  it('should return health status ok with uptime and timestamp', () => {
    const health = getHealthStatus();

    expect(health).toHaveProperty('status', 'ok');
    expect(health).toHaveProperty('uptime');
    expect(typeof health.uptime).toBe('number');
    expect(health).toHaveProperty('timestamp');
  });
});
