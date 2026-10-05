import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../app.js';

describe('Products API Integration', () => {
  const app = createApp();

  it('GET /api/v1/products/:barcode should return 200 for known valid barcode', async () => {
    // Parle-G 800g
    const res = await request(app).get('/api/v1/products/8901719101038');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('barcode', '8901719101038');
    expect(res.body).toHaveProperty('name', 'Parle-G Original Gluco Biscuits');
    expect(res.body.netQuantity).toEqual({ value: 800, unit: 'g' });
    expect(res.body.frontPanelMm).toEqual({ width: 140, height: 95 });
  });

  it('GET /api/v1/products/:barcode should return 404 for valid but unknown barcode', async () => {
    // EAN-8 valid barcode not in database: 96385074
    const res = await request(app).get('/api/v1/products/96385074');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toMatchObject({
      code: 'NOT_FOUND',
      message: 'Product with barcode 96385074 not found',
    });
  });

  it('GET /api/v1/products/:barcode should return 400 for invalid checksum barcode', async () => {
    // Checksum mismatch
    const res = await request(app).get('/api/v1/products/8901719101030');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toMatchObject({
      code: 'VALIDATION_ERROR',
    });
    expect(res.body.error.message).toContain('Invalid EAN-13 checksum');
  });

  it('GET /api/v1/products/:barcode should return 400 for malformed barcode', async () => {
    const res = await request(app).get('/api/v1/products/invalid-barcode-123');

    expect(res.status).toBe(400);
    expect(res.body.error).toMatchObject({
      code: 'VALIDATION_ERROR',
    });
  });
});
