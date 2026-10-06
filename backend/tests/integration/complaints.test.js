import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../../app.js';
import { Scan } from '../../modules/scans/scans.model.js';
import { Complaint } from '../../modules/complaints/complaints.model.js';
import { issueTokens } from '../../modules/auth/auth.service.js';

describe('Complaints API Integration Tests', () => {
  const app = createApp();

  const userA = {
    _id: '507f1f77bcf86cd799439011',
    id: '507f1f77bcf86cd799439011',
    email: 'usera@example.com',
    name: 'User Alpha',
    role: 'user',
  };

  const userB = {
    _id: '507f1f77bcf86cd799439022',
    id: '507f1f77bcf86cd799439022',
    email: 'userb@example.com',
    name: 'User Beta',
    role: 'user',
  };

  const tokenA = issueTokens(userA).accessToken;
  const tokenB = issueTokens(userB).accessToken;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('POST /api/v1/complaints requires authentication (401)', async () => {
    const res = await request(app).post('/api/v1/complaints').send({});
    expect(res.status).toBe(401);
    expect(res.body.error).toHaveProperty('code', 'UNAUTHORIZED');
  });

  it('POST /api/v1/complaints requires explicit user confirmation (400)', async () => {
    const fakeScanId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .post('/api/v1/complaints')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ scanId: fakeScanId, confirmed: false });

    expect(res.status).toBe(400);
    expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    expect(res.body.error.message).toContain('confirmation is required');
  });

  it('POST /api/v1/complaints rejects compliant PASS scans (FAIL-only guard)', async () => {
    const passScanId = new mongoose.Types.ObjectId().toString();
    vi.spyOn(Scan, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue({
        _id: passScanId,
        id: passScanId,
        verdict: 'PASS',
        report: { verdict: 'PASS', checks: [] },
      }),
    });

    const res = await request(app)
      .post('/api/v1/complaints')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ scanId: passScanId, confirmed: true });

    expect(res.status).toBe(400);
    expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    expect(res.body.error.message).toContain('FAIL verdict');
  });

  it('POST /api/v1/complaints accepts non-compliant FAIL scans and copies violations', async () => {
    const failScanId = new mongoose.Types.ObjectId().toString();
    const mockViolations = [
      {
        ruleId: 'customer_care.presence',
        field: 'customerCare',
        status: 'FAIL',
        mandatory: true,
        message: 'Missing customer care contact details',
        sourceRef: 'Rule 6(1)(f)',
      },
    ];

    vi.spyOn(Scan, 'findById').mockReturnValue({
      lean: vi.fn().mockResolvedValue({
        _id: failScanId,
        id: failScanId,
        verdict: 'FAIL',
        report: { verdict: 'FAIL', checks: mockViolations },
      }),
    });

    const res = await request(app)
      .post('/api/v1/complaints')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        scanId: failScanId,
        confirmed: true,
        userNote: 'Purchased at local store, no customer care information on back label.',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.status).toBe('IN_REVIEW');
    expect(res.body.violations).toHaveLength(1);
    expect(res.body.violations[0].ruleId).toBe('customer_care.presence');
  });

  it('GET /api/v1/complaints/:id enforces ownership checks (403 for unauthorized user)', async () => {
    const complaintId = new mongoose.Types.ObjectId().toString();

    vi.spyOn(Complaint, 'findById').mockReturnValue({
      populate: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue({
          _id: complaintId,
          id: complaintId,
          user: userA.id, // Owned by userA
          violations: [],
          status: 'SUBMITTED',
        }),
      }),
    });

    // Requested by userB
    const res = await request(app)
      .get(`/api/v1/complaints/${complaintId}`)
      .set('Authorization', `Bearer ${tokenB}`);

    expect(res.status).toBe(403);
    expect(res.body.error).toHaveProperty('code', 'FORBIDDEN');
  });

  it('GET /api/v1/complaints/:id returns complaint to owner (200)', async () => {
    const complaintId = new mongoose.Types.ObjectId().toString();

    vi.spyOn(Complaint, 'findById').mockReturnValue({
      populate: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue({
          _id: complaintId,
          id: complaintId,
          user: userA.id,
          violations: [{ ruleId: 'customer_care.presence', message: 'Missing care info' }],
          status: 'SUBMITTED',
        }),
      }),
    });

    const res = await request(app)
      .get(`/api/v1/complaints/${complaintId}`)
      .set('Authorization', `Bearer ${tokenA}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(complaintId);
  });

  it('GET /api/v1/complaints/:id/export generates valid PDF report', async () => {
    const complaintId = new mongoose.Types.ObjectId().toString();

    vi.spyOn(Complaint, 'findById').mockReturnValue({
      populate: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue({
          _id: complaintId,
          id: complaintId,
          user: userA.id,
          createdAt: new Date().toISOString(),
          status: 'SUBMITTED',
          userNote: 'Customer grievance details',
          violations: [{ ruleId: 'customer_care.presence', message: 'Missing care info', sourceRef: 'Rule 6(1)(f)' }],
          scan: { barcode: '8901234567890' },
        }),
      }),
    });

    const res = await request(app)
      .get(`/api/v1/complaints/${complaintId}/export`)
      .set('Authorization', `Bearer ${tokenA}`);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('application/pdf');
    // PDF files always begin with magic bytes %PDF-
    expect(res.body.toString('utf-8', 0, 5)).toBe('%PDF-');
  });
});
