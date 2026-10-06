import { Router } from 'express';
import { requireAuth, requireRole } from '../../middlewares/auth.js';
import { USER_ROLES } from '../auth/user.model.js';
import {
  createDistrictAdminHandler,
  listDistrictAdminsHandler,
  createOfficerHandler,
  listOfficersHandler,
  listDistrictComplaintsHandler,
  getDistrictComplaintHandler,
  reviewDistrictComplaintHandler,
  getDistrictOverviewHandler,
} from './districts.controller.js';

export const districtsRouter = Router();

// Main Admin (Superadmin) Endpoints: Manage District Admins
districtsRouter.post(
  '/admins',
  requireAuth,
  requireRole(USER_ROLES.SUPERADMIN),
  createDistrictAdminHandler,
);

districtsRouter.get(
  '/admins',
  requireAuth,
  requireRole(USER_ROLES.SUPERADMIN),
  listDistrictAdminsHandler,
);

// District Admin & Superadmin Endpoints: Manage Field Officers
districtsRouter.post(
  '/officers',
  requireAuth,
  requireRole(USER_ROLES.SUPERADMIN, USER_ROLES.DISTRICT_ADMIN),
  createOfficerHandler,
);

districtsRouter.get(
  '/officers',
  requireAuth,
  requireRole(USER_ROLES.SUPERADMIN, USER_ROLES.DISTRICT_ADMIN),
  listOfficersHandler,
);

// District Complaints / Reports
districtsRouter.get(
  '/reports',
  requireAuth,
  requireRole(USER_ROLES.SUPERADMIN, USER_ROLES.DISTRICT_ADMIN, USER_ROLES.OFFICER),
  listDistrictComplaintsHandler,
);

districtsRouter.get(
  '/reports/:id',
  requireAuth,
  requireRole(USER_ROLES.SUPERADMIN, USER_ROLES.DISTRICT_ADMIN, USER_ROLES.OFFICER),
  getDistrictComplaintHandler,
);

// District Admin Review / Action
districtsRouter.patch(
  '/reports/:id',
  requireAuth,
  requireRole(USER_ROLES.SUPERADMIN, USER_ROLES.DISTRICT_ADMIN),
  reviewDistrictComplaintHandler,
);

// Overview / Statistics
districtsRouter.get(
  '/overview',
  requireAuth,
  requireRole(USER_ROLES.SUPERADMIN, USER_ROLES.DISTRICT_ADMIN),
  getDistrictOverviewHandler,
);

export default districtsRouter;
