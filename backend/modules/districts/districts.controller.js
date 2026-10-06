import {
  createDistrictAdmin,
  listDistrictAdmins,
  createOfficer,
  listOfficers,
  listDistrictComplaints,
  getDistrictComplaintById,
  reviewDistrictComplaint,
  getDistrictOverview,
} from './districts.service.js';
import { USER_ROLES } from '../auth/user.model.js';
import { ValidationError, ForbiddenError } from '../../lib/errors.js';

export async function createDistrictAdminHandler(req, res, next) {
  try {
    const { email, password, name, district, phoneNumber, state } = req.body || {};
    const admin = await createDistrictAdmin({
      email,
      password,
      name,
      district,
      phoneNumber,
      state,
      createdBy: req.user.sub,
    });

    return res.status(201).json({
      success: true,
      message: `District Admin created for district ${admin.district}`,
      admin,
    });
  } catch (err) {
    return next(err);
  }
}

export async function listDistrictAdminsHandler(req, res, next) {
  try {
    const { district } = req.query;
    const admins = await listDistrictAdmins({ district });
    return res.status(200).json({ success: true, count: admins.length, admins });
  } catch (err) {
    return next(err);
  }
}

export async function createOfficerHandler(req, res, next) {
  try {
    const { email, password, name, badgeNumber, phoneNumber, district } = req.body || {};

    const targetDistrict = req.user.role === USER_ROLES.SUPERADMIN
      ? (district || req.user.district)
      : req.user.district;

    if (!targetDistrict) {
      throw new ValidationError('District is required to create an officer');
    }

    const officer = await createOfficer({
      email,
      password,
      name,
      district: targetDistrict,
      badgeNumber,
      phoneNumber,
      createdBy: req.user.sub,
      creatorRole: req.user.role,
      creatorDistrict: req.user.district,
    });

    return res.status(201).json({
      success: true,
      message: `Field Officer credential created for district ${officer.district}`,
      officer,
    });
  } catch (err) {
    return next(err);
  }
}

export async function listOfficersHandler(req, res, next) {
  try {
    const targetDistrict = req.user.role === USER_ROLES.SUPERADMIN
      ? (req.query.district || req.user.district)
      : req.user.district;

    const officers = await listOfficers({ district: targetDistrict });
    return res.status(200).json({
      success: true,
      district: targetDistrict || 'ALL',
      count: officers.length,
      officers,
    });
  } catch (err) {
    return next(err);
  }
}

export async function listDistrictComplaintsHandler(req, res, next) {
  try {
    const targetDistrict = req.user.role === USER_ROLES.SUPERADMIN
      ? (req.query.district || req.user.district)
      : req.user.district;

    if (!targetDistrict) {
      throw new ValidationError('District parameter is required to view district reports');
    }

    const { status, submittedByRole, page, limit } = req.query;
    const result = await listDistrictComplaints({
      district: targetDistrict,
      status,
      submittedByRole,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      district: targetDistrict.toUpperCase(),
      ...result,
    });
  } catch (err) {
    return next(err);
  }
}

export async function getDistrictComplaintHandler(req, res, next) {
  try {
    const targetDistrict = req.user.district;
    const complaint = await getDistrictComplaintById(req.params.id, targetDistrict, req.user.role);
    return res.status(200).json(complaint);
  } catch (err) {
    return next(err);
  }
}

export async function reviewDistrictComplaintHandler(req, res, next) {
  try {
    const { status, officerNotes } = req.body || {};
    const targetDistrict = req.user.district;

    const updated = await reviewDistrictComplaint({
      id: req.params.id,
      district: targetDistrict,
      status,
      officerNotes,
      reviewerId: req.user.sub,
      userRole: req.user.role,
    });

    return res.status(200).json({
      success: true,
      message: `Complaint status updated to ${updated.status}`,
      complaint: updated,
    });
  } catch (err) {
    return next(err);
  }
}

export async function getDistrictOverviewHandler(req, res, next) {
  try {
    const targetDistrict = req.user.role === USER_ROLES.SUPERADMIN
      ? (req.query.district || req.user.district)
      : req.user.district;

    const overview = await getDistrictOverview({ district: targetDistrict });
    return res.status(200).json({ success: true, ...overview });
  } catch (err) {
    return next(err);
  }
}

export default {
  createDistrictAdminHandler,
  listDistrictAdminsHandler,
  createOfficerHandler,
  listOfficersHandler,
  listDistrictComplaintsHandler,
  getDistrictComplaintHandler,
  reviewDistrictComplaintHandler,
  getDistrictOverviewHandler,
};
