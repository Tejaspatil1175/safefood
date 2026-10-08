import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../app.js';
import { Scan } from '../../modules/scans/scans.model.js';
import { Complaint } from '../../modules/complaints/complaints.model.js';

describe('Officer API Integration Tests', () => {
  const app = createApp();

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('GET /api/v1/officer/stats returns dashboard metrics', async () => {
    vi.spyOn(Scan, 'countDocuments')
      .mockResolvedValueOnce(50)  // totalScans
      .mockResolvedValueOnce(35)  // compliant
      .mockResolvedValueOnce(15); // non-compliant

    vi.spyOn(Complaint, 'countDocuments')
      .mockResolvedValueOnce(6);  // pendingInvestigations

    const res = await request(app).get('/api/v1/officer/stats');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('totalScans');
    expect(res.body).toHaveProperty('compliantProducts');
    expect(res.body).toHaveProperty('productsWithIssues');
    expect(res.body).toHaveProperty('pendingInvestigations');
  });

  it('GET /api/officer/stats route alias works equivalently', async () => {
    const res = await request(app).get('/api/officer/stats');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('totalScans');
  });
});
