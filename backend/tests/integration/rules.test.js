import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../app.js';
import { clearRuleSetCache } from '../../modules/rules/rules.service.js';

describe('Rules Integration', () => {
  const app = createApp();

  it('GET /api/v1/rules/active should return 200 with the active rule set', async () => {
    clearRuleSetCache();
    const res = await request(app).get('/api/v1/rules/active');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('version', 'pcr-2011.v1');
    expect(res.body).toHaveProperty('rules');
    expect(Array.isArray(res.body.rules)).toBe(true);
    expect(res.body.rules.length).toBeGreaterThan(0);
  });
});
