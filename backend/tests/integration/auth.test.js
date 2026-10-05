import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../app.js';
import { User } from '../../modules/auth/user.model.js';
import { issueTokens } from '../../modules/auth/auth.service.js';

describe('Auth API Integration Tests', () => {
  const app = createApp();

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('POST /api/v1/auth/google should reject requests without idToken (400)', async () => {
    const res = await request(app).post('/api/v1/auth/google').send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    expect(res.body.error.message).toContain('idToken is required');
  });

  it('POST /api/v1/auth/google should login/register with valid Google token (200)', async () => {
    const mockUser = {
      _id: '507f1f77bcf86cd799439011',
      id: '507f1f77bcf86cd799439011',
      googleId: 'google-sub-123',
      email: 'consumer@example.com',
      name: 'SafeFood Consumer',
      role: 'user',
    };

    vi.spyOn(User, 'findOne').mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/api/v1/auth/google')
      .send({ idToken: 'mock-google-token:consumer@example.com' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe('consumer@example.com');
  });

  it('POST /api/v1/auth/refresh should reject missing refresh token (400)', async () => {
    const res = await request(app).post('/api/v1/auth/refresh').send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    expect(res.body.error.message).toContain('refreshToken is required');
  });

  it('POST /api/v1/auth/refresh should reject malformed refresh token (401)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: 'invalid.jwt.token' });

    expect(res.status).toBe(401);
    expect(res.body.error).toHaveProperty('code', 'UNAUTHORIZED');
  });

  it('POST /api/v1/auth/refresh should issue new tokens with valid refresh token (200)', async () => {
    const mockUser = {
      _id: '507f1f77bcf86cd799439011',
      id: '507f1f77bcf86cd799439011',
      email: 'consumer@example.com',
      name: 'SafeFood Consumer',
      role: 'user',
    };

    const tokens = issueTokens(mockUser);

    vi.spyOn(User, 'findById').mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: tokens.refreshToken });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    expect(res.body.user.email).toBe('consumer@example.com');
  });

  it('GET /api/v1/auth/me should reject unauthenticated requests (401)', async () => {
    const res = await request(app).get('/api/v1/auth/me');

    expect(res.status).toBe(401);
    expect(res.body.error).toHaveProperty('code', 'UNAUTHORIZED');
    expect(res.body.error.message).toContain('Missing or invalid Bearer token');
  });

  it('GET /api/v1/auth/me should return authenticated user profile (200)', async () => {
    const mockUser = {
      _id: '507f1f77bcf86cd799439011',
      id: '507f1f77bcf86cd799439011',
      email: 'consumer@example.com',
      name: 'SafeFood Consumer',
      role: 'user',
    };

    const { accessToken } = issueTokens(mockUser);

    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: '507f1f77bcf86cd799439011',
      email: 'consumer@example.com',
      name: 'SafeFood Consumer',
      role: 'user',
    });
  });
});
