import mongoose from 'mongoose';
import { User, USER_ROLES } from '../auth/user.model.js';
import { Complaint, COMPLAINT_STATUS } from '../complaints/complaints.model.js';
import { hashPassword } from '../../lib/password.js';
import { ValidationError, NotFoundError, ForbiddenError } from '../../lib/errors.js';
import { isDbConnected } from '../../infra/db.js';

export async function createDistrictAdmin({
  email,
  password,
  name,
  district,
  phoneNumber = '',
  state = 'Maharashtra',
  createdBy = null,
}) {
  if (!email || !password || !name || !district) {
    throw new ValidationError('Email, password, name, and district are required to create a District Admin');
  }

  const cleanEmail = email.toLowerCase().trim();
  const existing = await User.findOne({ email: cleanEmail });
  if (existing) {
    throw new ValidationError(`An account with email ${cleanEmail} already exists`);
  }

  const normDistrict = district.trim().toUpperCase();
  const passwordHash = hashPassword(password);

  const adminUser = await User.create({
    email: cleanEmail,
    passwordHash,
    name: name.trim(),
    role: USER_ROLES.DISTRICT_ADMIN,
    district: normDistrict,
    state: state.trim(),
    phoneNumber: phoneNumber.trim(),
    createdBy: createdBy ? new mongoose.Types.ObjectId(createdBy) : null,
  });

  const obj = adminUser.toJSON();
  delete obj.passwordHash;
  return obj;
}

export async function listDistrictAdmins({ district } = {}) {
  const query = { role: USER_ROLES.DISTRICT_ADMIN };
  if (district) {
    query.district = district.trim().toUpperCase();
  }

  return User.find(query)
    .select('-passwordHash')
    .sort({ createdAt: -1 })
    .lean();
}

export async function createOfficer({
  email,
  password,
  name,
  district,
  badgeNumber = '',
  phoneNumber = '',
  createdBy,
  creatorRole,
  creatorDistrict,
}) {
  if (!email || !password || !name) {
    throw new ValidationError('Email, password, and name are required to create an Officer');
  }

  // If created by District Admin, lock officer's district to the creator's district
  let assignedDistrict = district;
  if (creatorRole === USER_ROLES.DISTRICT_ADMIN) {
    if (!creatorDistrict) {
      throw new ForbiddenError('District Admin account lacks an assigned district');
    }
    assignedDistrict = creatorDistrict;
  } else if (!assignedDistrict) {
    throw new ValidationError('District assignment is required for field officers');
  }

  const cleanEmail = email.toLowerCase().trim();
  const existing = await User.findOne({ email: cleanEmail });
  if (existing) {
    throw new ValidationError(`An account with email ${cleanEmail} already exists`);
  }

  const normDistrict = assignedDistrict.trim().toUpperCase();
  const passwordHash = hashPassword(password);
  const genBadge = badgeNumber?.trim() || `OFF-${normDistrict.slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`;

  const officer = await User.create({
    email: cleanEmail,
    passwordHash,
    name: name.trim(),
    role: USER_ROLES.OFFICER,
    district: normDistrict,
    badgeNumber: genBadge,
    phoneNumber: phoneNumber.trim(),
    createdBy: createdBy ? new mongoose.Types.ObjectId(createdBy) : null,
  });

  const obj = officer.toJSON();
  delete obj.passwordHash;
  return obj;
}

export async function listOfficers({ district } = {}) {
  const query = { role: USER_ROLES.OFFICER };
  if (district) {
    query.district = district.trim().toUpperCase();
  }

  return User.find(query)
    .select('-passwordHash')
    .sort({ createdAt: -1 })
    .lean();
}

export async function listDistrictComplaints({
  district,
  status = null,
  submittedByRole = null,
  page = 1,
  limit = 20,
}) {
  if (!district) {
    throw new ValidationError('District is required to query district complaints');
  }

  const normDistrict = district.trim().toUpperCase();
  const query = { district: normDistrict };

  if (status) {
    query.status = status;
  }

  if (submittedByRole) {
    query.submittedByRole = submittedByRole;
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    Complaint.find(query)
      .populate('scan')
      .populate('user', 'name email phoneNumber role district')
      .populate('reviewedBy', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Complaint.countDocuments(query),
  ]);

  return {
    items: items || [],
    pagination: {
      total: total || 0,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil((total || 0) / limitNum),
    },
  };
}

export async function getDistrictComplaintById(id, district, userRole = null) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError('Invalid complaint ID format');
  }

  const complaint = await Complaint.findById(id)
    .populate('scan')
    .populate('user', 'name email phoneNumber role district')
    .populate('reviewedBy', 'name email role')
    .lean();

  if (!complaint) {
    throw new NotFoundError(`Complaint with id ${id} not found`);
  }

  if (userRole !== USER_ROLES.SUPERADMIN && district) {
    const compDistrict = complaint.district ? complaint.district.trim().toUpperCase() : null;
    const normDistrict = district.trim().toUpperCase();
    if (compDistrict !== normDistrict) {
      throw new ForbiddenError(`Complaint belongs to district ${compDistrict}, not ${normDistrict}`);
    }
  }

  return complaint;
}

export async function reviewDistrictComplaint({
  id,
  district,
  status,
  officerNotes = '',
  reviewerId,
  userRole = null,
}) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError('Invalid complaint ID format');
  }

  const complaint = await Complaint.findById(id);
  if (!complaint) {
    throw new NotFoundError(`Complaint with id ${id} not found`);
  }

  if (userRole !== USER_ROLES.SUPERADMIN && district) {
    const compDistrict = complaint.district ? complaint.district.trim().toUpperCase() : null;
    const normDistrict = district.trim().toUpperCase();
    if (compDistrict !== normDistrict) {
      throw new ForbiddenError(`Complaint belongs to district ${compDistrict}, not ${normDistrict}`);
    }
  }

  if (status && !Object.values(COMPLAINT_STATUS).includes(status)) {
    throw new ValidationError(`Invalid status: ${status}. Allowed: ${Object.values(COMPLAINT_STATUS).join(', ')}`);
  }

  if (status) {
    complaint.status = status;
  }

  if (officerNotes) {
    complaint.officerNotes = officerNotes.trim();
  }

  complaint.reviewedBy = reviewerId ? new mongoose.Types.ObjectId(reviewerId) : null;
  complaint.reviewedAt = new Date();

  await complaint.save();
  return complaint;
}

export async function getDistrictOverview({ district } = {}) {
  const normDistrict = district ? district.trim().toUpperCase() : null;
  const matchFilter = normDistrict ? { district: normDistrict } : {};

  const [
    totalReports,
    inReviewReports,
    verifiedReports,
    actionTakenReports,
    rejectedReports,
    officersCount,
  ] = await Promise.all([
    Complaint.countDocuments(matchFilter),
    Complaint.countDocuments({ ...matchFilter, status: COMPLAINT_STATUS.IN_REVIEW }),
    Complaint.countDocuments({ ...matchFilter, status: { $in: [COMPLAINT_STATUS.VERIFIED, COMPLAINT_STATUS.VALID] } }),
    Complaint.countDocuments({ ...matchFilter, status: COMPLAINT_STATUS.ACTION_TAKEN }),
    Complaint.countDocuments({ ...matchFilter, status: COMPLAINT_STATUS.REJECTED }),
    User.countDocuments({
      role: USER_ROLES.OFFICER,
      ...(normDistrict ? { district: normDistrict } : {}),
    }),
  ]);

  return {
    district: normDistrict || 'ALL_DISTRICTS',
    stats: {
      totalReports,
      inReviewReports,
      verifiedReports,
      actionTakenReports,
      rejectedReports,
      officersCount,
    },
  };
}

export default {
  createDistrictAdmin,
  listDistrictAdmins,
  createOfficer,
  listOfficers,
  listDistrictComplaints,
  getDistrictComplaintById,
  reviewDistrictComplaint,
  getDistrictOverview,
};
