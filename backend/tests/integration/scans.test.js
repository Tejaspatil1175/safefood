import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../../app.js';
import * as visionClient from '../../infra/visionClient.js';
import { Scan } from '../../modules/scans/scans.model.js';

describe('Scans API Integration Tests', () => {
  const app = createApp();

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('POST /api/v1/scans should reject requests without files (400)', async () => {
    const res = await request(app)
      .post('/api/v1/scans')
      .field('barcode', '8901719101038');

    expect(res.status).toBe(400);
    expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    expect(res.body.error.message).toContain('image is required');
  });

  it('POST /api/v1/scans should reject unsupported file types (400)', async () => {
    const res = await request(app)
      .post('/api/v1/scans')
      .attach('images', Buffer.from('not an image'), 'test.txt');

    expect(res.status).toBe(400);
    expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    expect(res.body.error.message).toContain('Unsupported file type');
  });

  it('POST /api/v1/scans should reject poor quality images with 422 retake guidance', async () => {
    vi.spyOn(visionClient, 'analyzeImage').mockResolvedValue({
      quality: {
        pass: false,
        issues: ['Image is excessively blurry', 'Severe glare over net quantity area'],
      },
      words: [],
    });

    const fakeImage = Buffer.from('fake-jpeg-data');
    const res = await request(app)
      .post('/api/v1/scans')
      .attach('images', fakeImage, 'front.jpg');

    expect(res.status).toBe(422);
    expect(res.body.error).toHaveProperty('code', 'QUALITY_GATE_FAILED');
    expect(res.body.error.message).toContain('retake');
    expect(res.body.error.details).toContain('Image is excessively blurry');
  });

  it('POST /api/v1/scans should successfully orchestrate end-to-end scan', async () => {
    const sampleWords = [
      { text: 'Parle-G', bbox: [10, 10, 100, 40], confidence: 0.95, lineId: 1 },
      { text: 'NET', bbox: [10, 50, 40, 70], confidence: 0.95, lineId: 2 },
      { text: 'QTY:', bbox: [45, 50, 80, 70], confidence: 0.95, lineId: 2 },
      { text: '800g', bbox: [85, 50, 130, 70], confidence: 0.98, lineId: 2 },
      { text: 'MRP', bbox: [10, 80, 40, 100], confidence: 0.95, lineId: 3 },
      { text: 'Rs.', bbox: [45, 80, 70, 100], confidence: 0.95, lineId: 3 },
      { text: '85.00', bbox: [75, 80, 120, 100], confidence: 0.98, lineId: 3 },
      { text: 'INCL.', bbox: [125, 80, 160, 100], confidence: 0.92, lineId: 3 },
      { text: 'OF', bbox: [165, 80, 185, 100], confidence: 0.92, lineId: 3 },
      { text: 'ALL', bbox: [190, 80, 215, 100], confidence: 0.92, lineId: 3 },
      { text: 'TAXES', bbox: [220, 80, 260, 100], confidence: 0.92, lineId: 3 },
      { text: 'MFD:', bbox: [10, 110, 50, 130], confidence: 0.95, lineId: 4 },
      { text: '01/2026', bbox: [55, 110, 120, 130], confidence: 0.95, lineId: 4 },
      { text: 'EXPIRY:', bbox: [10, 140, 70, 160], confidence: 0.95, lineId: 5 },
      { text: '07/2026', bbox: [75, 140, 140, 160], confidence: 0.95, lineId: 5 },
      { text: 'Mfg', bbox: [10, 170, 40, 190], confidence: 0.95, lineId: 6 },
      { text: 'by:', bbox: [45, 170, 70, 190], confidence: 0.95, lineId: 6 },
      { text: 'Parle', bbox: [75, 170, 115, 190], confidence: 0.95, lineId: 6 },
      { text: 'Products', bbox: [120, 170, 180, 190], confidence: 0.95, lineId: 6 },
      { text: 'Pvt', bbox: [185, 170, 210, 190], confidence: 0.95, lineId: 6 },
      { text: 'Ltd,', bbox: [215, 170, 245, 190], confidence: 0.95, lineId: 6 },
      { text: 'Mumbai', bbox: [250, 170, 310, 190], confidence: 0.95, lineId: 6 },
      { text: 'Customer', bbox: [10, 200, 75, 220], confidence: 0.95, lineId: 7 },
      { text: 'care:', bbox: [80, 200, 120, 220], confidence: 0.95, lineId: 7 },
      { text: 'care@parle.biz', bbox: [125, 200, 230, 220], confidence: 0.95, lineId: 7 },
      { text: 'Country', bbox: [10, 230, 65, 250], confidence: 0.95, lineId: 8 },
      { text: 'of', bbox: [70, 230, 85, 250], confidence: 0.95, lineId: 8 },
      { text: 'Origin:', bbox: [90, 230, 140, 250], confidence: 0.95, lineId: 8 },
      { text: 'India', bbox: [145, 230, 185, 250], confidence: 0.95, lineId: 8 },
      { text: 'FSSAI', bbox: [10, 260, 55, 280], confidence: 0.95, lineId: 9 },
      { text: 'Lic', bbox: [60, 260, 85, 280], confidence: 0.95, lineId: 9 },
      { text: 'No.', bbox: [90, 260, 115, 280], confidence: 0.95, lineId: 9 },
      { text: '10012022000123', bbox: [120, 260, 240, 280], confidence: 0.95, lineId: 9 },
    ];

    vi.spyOn(visionClient, 'analyzeImage').mockResolvedValue({
      quality: { pass: true, issues: [] },
      scale: { pxPerMm: 4.0 },
      barcode: { format: 'EAN_13', value: '8901719101038' },
      words: sampleWords,
    });

    const fakeImage = Buffer.from('fake-jpeg-data');
    const createRes = await request(app)
      .post('/api/v1/scans')
      .attach('images', fakeImage, 'label.jpg');

    expect(createRes.status).toBe(201);
    expect(createRes.body).toHaveProperty('id');
    expect(createRes.body).toHaveProperty('verdict');
    expect(createRes.body).toHaveProperty('report');
    expect(createRes.body.barcode).toBe('8901719101038');
    expect(createRes.body.fields.netQuantity.value).toEqual({
      value: 800,
      unit: 'g',
    });

    const scanId = createRes.body.id;

    // Mock Scan.findById for GET /api/v1/scans/:id
    vi.spyOn(Scan, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue({
        id: scanId,
        verdict: createRes.body.verdict,
        report: createRes.body.report,
        fields: createRes.body.fields,
        barcode: '8901719101038',
      }),
    });

    const getRes = await request(app).get(`/api/v1/scans/${scanId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.id).toBe(scanId);
    expect(getRes.body.verdict).toBe(createRes.body.verdict);

    // Mock Scan.find & countDocuments for GET /api/v1/scans
    vi.spyOn(Scan, 'find').mockReturnValue({
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            lean: vi.fn().mockResolvedValue([{ id: scanId, verdict: 'PASS' }]),
          }),
        }),
      }),
    });
    vi.spyOn(Scan, 'countDocuments').mockResolvedValue(1);

    // Also simulate DB connected for list
    const originalReadyState = mongoose.connection.readyState;
    Object.defineProperty(mongoose.connection, 'readyState', {
      value: 1,
      writable: true,
      configurable: true,
    });

    try {
      const listRes = await request(app).get('/api/v1/scans?page=1&limit=10');
      expect(listRes.status).toBe(200);
      expect(listRes.body).toHaveProperty('items');
      expect(listRes.body).toHaveProperty('pagination');
      expect(listRes.body.pagination.total).toBe(1);
      expect(listRes.body.items[0].id).toBe(scanId);
    } finally {
      Object.defineProperty(mongoose.connection, 'readyState', {
        value: originalReadyState,
        writable: true,
        configurable: true,
      });
    }
  });

  it('GET /api/v1/scans/:id should return 400 for invalid ID format', async () => {
    const res = await request(app).get('/api/v1/scans/invalid-mongo-id');
    expect(res.status).toBe(400);
    expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
  });

  it('GET /api/v1/scans/:id should return 404 for non-existent ID', async () => {
    const fakeValidId = new mongoose.Types.ObjectId().toString();
    vi.spyOn(Scan, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue(null),
    });

    const res = await request(app).get(`/api/v1/scans/${fakeValidId}`);
    expect(res.status).toBe(404);
    expect(res.body.error).toHaveProperty('code', 'NOT_FOUND');
  });
});
