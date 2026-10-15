import { Router } from 'express';
import { requireAuth, optionalAuth, requireRole } from '../../middlewares/auth.js';
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
  listDistrictUsersHandler,
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
  optionalAuth,
  listDistrictAdminsHandler,
);

// District Admin & Superadmin Endpoints: Manage Field Officers
districtsRouter.post(
  '/officers',
  optionalAuth,
  createOfficerHandler,
);

districtsRouter.get(
  '/officers',
  optionalAuth,
  listOfficersHandler,
);

// District Complaints / Reports
districtsRouter.get(
  '/reports',
  optionalAuth,
  listDistrictComplaintsHandler,
);

districtsRouter.get(
  '/reports/:id',
  optionalAuth,
  getDistrictComplaintHandler,
);

// District Admin Review / Action
districtsRouter.patch(
  '/reports/:id',
  optionalAuth,
  reviewDistrictComplaintHandler,
);

// Overview / Statistics
districtsRouter.get(
  '/overview',
  optionalAuth,
  getDistrictOverviewHandler,
);

// Admin Directory of Users / Citizens
districtsRouter.get(
  '/users',
  optionalAuth,
  listDistrictUsersHandler,
);

export default districtsRouter;
