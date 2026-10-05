import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../app.js';

describe('Health and Error Handler Integration', () => {
  const app = createApp();

  it('GET /api/v1/health should return 200 and health payload', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('uptime');
    expect(res.headers).toHaveProperty('x-request-id');
  });

  it('GET /unknown-route should return standard 404 error shape', async () => {
    const res = await request(app).get('/unknown-route');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toEqual({
      code: 'NOT_FOUND',
      message: 'Route GET /unknown-route not found',
      details: [],
      requestId: expect.any(String),
    });
    expect(res.headers['x-request-id']).toBe(res.body.error.requestId);
  });

  it('should preserve provided x-request-id header', async () => {
    const customId = 'test-request-id-12345';
    const res = await request(app)
      .get('/api/v1/health')
      .set('x-request-id', customId);

    expect(res.status).toBe(200);
    expect(res.headers['x-request-id']).toBe(customId);
  });
});
