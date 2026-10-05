import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../../app.js';
import * as db from '../../infra/db.js';

describe('Readiness & Database Integration', () => {
  const app = createApp();
  let originalReadyState;

  beforeEach(() => {
    originalReadyState = mongoose.connection.readyState;
  });

  afterEach(() => {
    Object.defineProperty(mongoose.connection, 'readyState', {
      value: originalReadyState,
      writable: true,
      configurable: true,
    });
  });

  it('GET /api/v1/health/ready should report 503 db down when disconnected', async () => {
    Object.defineProperty(mongoose.connection, 'readyState', {
      value: 0, // disconnected
      writable: true,
      configurable: true,
    });

    const res = await request(app).get('/api/v1/health/ready');

    expect(res.status).toBe(503);
    expect(res.body).toMatchObject({
      status: 'degraded',
      db: 'down',
      dbState: 'disconnected',
    });
    expect(res.body).toHaveProperty('uptime');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('GET /api/v1/health/ready should report 200 db up when connected', async () => {
    Object.defineProperty(mongoose.connection, 'readyState', {
      value: 1, // connected
      writable: true,
      configurable: true,
    });

    const res = await request(app).get('/api/v1/health/ready');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      status: 'ok',
      db: 'up',
      dbState: 'connected',
    });
    expect(res.body).toHaveProperty('uptime');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('should test db helper functions correctly', () => {
    Object.defineProperty(mongoose.connection, 'readyState', {
      value: 1,
      writable: true,
      configurable: true,
    });
    expect(db.isDbConnected()).toBe(true);
    expect(db.getDbState()).toBe('connected');

    Object.defineProperty(mongoose.connection, 'readyState', {
      value: 0,
      writable: true,
      configurable: true,
    });
    expect(db.isDbConnected()).toBe(false);
    expect(db.getDbState()).toBe('disconnected');
  });
});
