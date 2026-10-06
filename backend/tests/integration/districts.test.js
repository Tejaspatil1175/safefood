import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../../app.js';
import { User, USER_ROLES } from '../../modules/auth/user.model.js';
import { Scan } from '../../modules/scans/scans.model.js';
import { Complaint, COMPLAINT_STATUS } from '../../modules/complaints/complaints.model.js';
import { issueTokens } from '../../modules/auth/auth.service.js';

describe('Districts RBAC & Reporting API Integration Tests', () => {
  const app = createApp();

  const superAdmin = {
    _id: '507f1f77bcf86cd799439001',
    id: '507f1f77bcf86cd799439001',
    email: 'mainadmin@safefood.gov.in',
    name: 'Main Super Admin',
    role: USER_ROLES.SUPERADMIN,
  };

  const districtAdminDhule = {
    _id: '507f1f77bcf86cd799439002',
    id: '507f1f77bcf86cd799439002',
    email: 'admin.dhule@safefood.gov.in',
    name: 'Dhule District Admin',
    role: USER_ROLES.DISTRICT_ADMIN,
    district: 'DHULE',
  };

  const officerDhule = {
    _id: '507f1f77bcf86cd799439003',
    id: '507f1f77bcf86cd799439003',
    email: 'officer.dhule@safefood.gov.in',
    name: 'Inspector Ramesh',
    role: USER_ROLES.OFFICER,
    district: 'DHULE',
  };

  const citizenDhule = {
    _id: '507f1f77bcf86cd799439004',
    id: '507f1f77bcf86cd799439004',
    email: 'citizen.dhule@gmail.com',
    name: 'Ajay Patil',
    role: USER_ROLES.CITIZEN,
    district: 'DHULE',
  };

  const superAdminToken = issueTokens(superAdmin).accessToken;
  const districtAdminToken = issueTokens(districtAdminDhule).accessToken;
  const officerToken = issueTokens(officerDhule).accessToken;
  const citizenToken = issueTokens(citizenDhule).accessToken;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('1. Main Admin (Superadmin) District Admin Management', () => {
    it('POST /api/v1/districts/admins rejects unauthenticated requests (401)', async () => {
      const res = await request(app).post('/api/v1/districts/admins').send({
        email: 'newadmin@dhule.gov.in',
        password: 'Password123!',
        name: 'Dhule Admin',
        district: 'Dhule',
      });
      expect(res.status).toBe(401);
    });

    it('POST /api/v1/districts/admins rejects non-superadmin callers (403)', async () => {
      const res = await request(app)
        .post('/api/v1/districts/admins')
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({
          email: 'newadmin@dhule.gov.in',
          password: 'Password123!',
          name: 'Dhule Admin',
          district: 'Dhule',
        });
      expect(res.status).toBe(403);
    });

    it('POST /api/v1/districts/admins allows superadmin to create District Admin (201)', async () => {
      const createdAdminId = new mongoose.Types.ObjectId().toString();
      vi.spyOn(User, 'findOne').mockResolvedValue(null);
      vi.spyOn(User, 'create').mockResolvedValue({
        id: createdAdminId,
        _id: createdAdminId,
        email: 'dhule.collector@safefood.gov.in',
        name: 'Collector Dhule',
        role: USER_ROLES.DISTRICT_ADMIN,
        district: 'DHULE',
        toJSON: () => ({
          id: createdAdminId,
          email: 'dhule.collector@safefood.gov.in',
          name: 'Collector Dhule',
          role: USER_ROLES.DISTRICT_ADMIN,
          district: 'DHULE',
        }),
      });

      const res = await request(app)
        .post('/api/v1/districts/admins')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          email: 'dhule.collector@safefood.gov.in',
          password: 'Password123!',
          name: 'Collector Dhule',
          district: 'Dhule',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.admin.role).toBe(USER_ROLES.DISTRICT_ADMIN);
      expect(res.body.admin.district).toBe('DHULE');
    });

    it('GET /api/v1/districts/admins allows superadmin to list district admins (200)', async () => {
      vi.spyOn(User, 'find').mockReturnValue({
        select: vi.fn().mockReturnValue({
          sort: vi.fn().mockReturnValue({
            lean: vi.fn().mockResolvedValue([
              {
                id: districtAdminDhule.id,
                email: districtAdminDhule.email,
                name: districtAdminDhule.name,
                role: USER_ROLES.DISTRICT_ADMIN,
                district: 'DHULE',
              },
            ]),
          }),
        }),
      });

      const res = await request(app)
        .get('/api/v1/districts/admins')
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.admins).toHaveLength(1);
      expect(res.body.admins[0].district).toBe('DHULE');
    });
  });

  describe('2. District Admin Officer Credential Provisioning', () => {
    it('POST /api/v1/districts/officers allows District Admin to create field officer in their district (201)', async () => {
      const createdOfficerId = new mongoose.Types.ObjectId().toString();
      vi.spyOn(User, 'findOne').mockResolvedValue(null);
      vi.spyOn(User, 'create').mockResolvedValue({
        id: createdOfficerId,
        _id: createdOfficerId,
        email: 'officer.patil@dhule.gov.in',
        name: 'Officer Patil',
        role: USER_ROLES.OFFICER,
        district: 'DHULE',
        badgeNumber: 'OFF-DHU-1001',
        toJSON: () => ({
          id: createdOfficerId,
          email: 'officer.patil@dhule.gov.in',
          name: 'Officer Patil',
          role: USER_ROLES.OFFICER,
          district: 'DHULE',
          badgeNumber: 'OFF-DHU-1001',
        }),
      });

      const res = await request(app)
        .post('/api/v1/districts/officers')
        .set('Authorization', `Bearer ${districtAdminToken}`)
        .send({
          email: 'officer.patil@dhule.gov.in',
          password: 'OfficerPass123!',
          name: 'Officer Patil',
          badgeNumber: 'OFF-DHU-1001',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.officer.role).toBe(USER_ROLES.OFFICER);
      expect(res.body.officer.district).toBe('DHULE');
    });

    it('GET /api/v1/districts/officers returns officers scoped to district (200)', async () => {
      vi.spyOn(User, 'find').mockReturnValue({
        select: vi.fn().mockReturnValue({
          sort: vi.fn().mockReturnValue({
            lean: vi.fn().mockResolvedValue([
              {
                id: officerDhule.id,
                email: officerDhule.email,
                name: officerDhule.name,
                role: USER_ROLES.OFFICER,
                district: 'DHULE',
              },
            ]),
          }),
        }),
      });

      const res = await request(app)
        .get('/api/v1/districts/officers')
        .set('Authorization', `Bearer ${districtAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.officers).toHaveLength(1);
      expect(res.body.officers[0].district).toBe('DHULE');
    });
  });

  describe('3. Role-Based Report Submission: Common Man vs Field Officer', () => {
    const failScanId = new mongoose.Types.ObjectId().toString();

    beforeEach(() => {
      vi.spyOn(Scan, 'findById').mockReturnValue({
        lean: vi.fn().mockResolvedValue({
          _id: failScanId,
          id: failScanId,
          verdict: 'FAIL',
          report: {
            verdict: 'FAIL',
            checks: [
              {
                ruleId: 'customer_care.presence',
                field: 'customerCare',
                status: 'FAIL',
                message: 'Customer care details missing',
              },
            ],
          },
        }),
      });
    });

    it('Common citizen report defaults to IN_REVIEW status with district assigned', async () => {
      const res = await request(app)
        .post('/api/v1/complaints')
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({
          scanId: failScanId,
          confirmed: true,
          userNote: 'Found packaged commodity without required care contacts at Dhule market',
          district: 'Dhule',
          address: 'Sakri Road, Dhule',
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe(COMPLAINT_STATUS.IN_REVIEW);
      expect(res.body.district).toBe('DHULE');
      expect(res.body.submittedByRole).toBe(USER_ROLES.CITIZEN);
    });

    it('Officer report is automatically set to VERIFIED status', async () => {
      const res = await request(app)
        .post('/api/v1/complaints')
        .set('Authorization', `Bearer ${officerToken}`)
        .send({
          scanId: failScanId,
          confirmed: true,
          userNote: 'Official on-site raid inspection verified absence of declaration',
          district: 'Dhule',
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe(COMPLAINT_STATUS.VERIFIED);
      expect(res.body.district).toBe('DHULE');
      expect(res.body.submittedByRole).toBe(USER_ROLES.OFFICER);
    });
  });

  describe('4. District Admin Review & Management of Reports', () => {
    it('GET /api/v1/districts/reports lists reports in district with status filters', async () => {
      const complaintId = new mongoose.Types.ObjectId().toString();
      vi.spyOn(Complaint, 'find').mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([
          {
            _id: complaintId,
            id: complaintId,
            district: 'DHULE',
            status: COMPLAINT_STATUS.IN_REVIEW,
            submittedByRole: 'user',
          },
        ]),
      });
      vi.spyOn(Complaint, 'countDocuments').mockResolvedValue(1);

      const res = await request(app)
        .get('/api/v1/districts/reports')
        .set('Authorization', `Bearer ${districtAdminToken}`)
        .query({ status: 'IN_REVIEW' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.items).toHaveLength(1);
      expect(res.body.items[0].status).toBe(COMPLAINT_STATUS.IN_REVIEW);
    });

    it('PATCH /api/v1/districts/reports/:id updates complaint status to ACTION_TAKEN', async () => {
      const complaintId = new mongoose.Types.ObjectId().toString();
      const mockDoc = {
        _id: complaintId,
        id: complaintId,
        district: 'DHULE',
        status: COMPLAINT_STATUS.IN_REVIEW,
        officerNotes: '',
        reviewedBy: null,
        reviewedAt: null,
        save: vi.fn().mockResolvedValue(true),
      };

      vi.spyOn(Complaint, 'findById').mockResolvedValue(mockDoc);

      const res = await request(app)
        .patch(`/api/v1/districts/reports/${complaintId}`)
        .set('Authorization', `Bearer ${districtAdminToken}`)
        .send({
          status: COMPLAINT_STATUS.ACTION_TAKEN,
          officerNotes: 'Show cause notice served to distributor under Rule 6(1)',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(mockDoc.status).toBe(COMPLAINT_STATUS.ACTION_TAKEN);
      expect(mockDoc.officerNotes).toContain('Show cause notice');
    });

    it('GET /api/v1/districts/overview returns aggregated district analytics', async () => {
      vi.spyOn(Complaint, 'countDocuments')
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(4)  // in review
        .mockResolvedValueOnce(4)  // verified
        .mockResolvedValueOnce(2)  // action taken
        .mockResolvedValueOnce(0); // rejected
      vi.spyOn(User, 'countDocuments').mockResolvedValue(3); // officers

      const res = await request(app)
        .get('/api/v1/districts/overview')
        .set('Authorization', `Bearer ${districtAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.district).toBe('DHULE');
      expect(res.body.stats.totalReports).toBe(10);
      expect(res.body.stats.inReviewReports).toBe(4);
      expect(res.body.stats.officersCount).toBe(3);
    });
  });
});
