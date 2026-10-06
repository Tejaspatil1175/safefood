import mongoose from 'mongoose';
import PDFDocument from 'pdfkit';
import { Complaint, COMPLAINT_STATUS } from './complaints.model.js';
import { User } from '../auth/user.model.js';
import { Scan } from '../scans/scans.model.js';
import { uploadEvidenceBuffer } from '../../infra/gridfs.js';
import { ValidationError, NotFoundError, ForbiddenError } from '../../lib/errors.js';
import { isDbConnected } from '../../infra/db.js';

export async function createComplaint({
  scanId,
  confirmed,
  userNote = '',
  userId,
  userRole = 'user',
  district = null,
  address = '',
  files = [],
}) {
  if (!confirmed) {
    throw new ValidationError('Explicit user confirmation is required to submit a complaint');
  }

  if (!scanId || !mongoose.Types.ObjectId.isValid(scanId)) {
    throw new ValidationError('Valid scanId is required');
  }

  if (!userId) {
    throw new ValidationError('Authenticated userId is required');
  }

  const scan = await Scan.findById(scanId).lean();
  if (!scan) {
    throw new NotFoundError(`Scan with id ${scanId} not found`);
  }

  // Guard: Only allowed when scan verdict is FAIL
  if (scan.verdict !== 'FAIL') {
    throw new ValidationError(
      `Complaints can only be filed for non-compliant products with a FAIL verdict (current verdict: ${scan.verdict})`,
    );
  }

  // Resolve district and address from params or user profile
  let resolvedDistrict = district ? district.trim().toUpperCase() : null;
  let resolvedAddress = address ? address.trim() : '';

  if ((!resolvedDistrict || !resolvedAddress) && isDbConnected()) {
    const userDoc = await User.findById(userId).lean();
    if (userDoc) {
      if (!resolvedDistrict && userDoc.district) {
        resolvedDistrict = userDoc.district.trim().toUpperCase();
      }
      if (!resolvedAddress && userDoc.address) {
        resolvedAddress = userDoc.address.trim();
      }
    }
  }

  // Common citizen submissions start IN_REVIEW. Officer and Admin submissions are marked VERIFIED automatically.
  const status = (userRole === 'officer' || userRole === 'admin')
    ? COMPLAINT_STATUS.VERIFIED
    : COMPLAINT_STATUS.IN_REVIEW;

  // Collect violations from failed checks
  const checks = scan.report?.checks || [];
  const failedChecks = checks.filter((c) => c.status === 'FAIL');
  const violations = failedChecks.map((c) => ({
    ruleId: c.ruleId,
    field: c.field,
    message: c.message,
    evidence: c.evidence,
    sourceRef: c.sourceRef,
  }));

  // Integrate Gemini AI statutory audit violations if available
  const geminiViolations = scan.geminiAudit?.violations || scan.report?.aiViolations || [];
  if (Array.isArray(geminiViolations)) {
    for (const gv of geminiViolations) {
      if (!violations.some((v) => v.ruleId === gv.rule || v.message?.includes(gv.title))) {
        violations.push({
          ruleId: gv.rule || 'PCR 2011 Rule 6',
          field: gv.title || 'Declaration Violation',
          message: `${gv.title}: ${gv.description}`,
          evidence: { text: gv.evidence },
          sourceRef: gv.legalConsequence,
          severity: gv.severity,
        });
      }
    }
  }

  // Store evidence files in GridFS if provided
  const evidenceFileIds = [];
  if (Array.isArray(files) && files.length > 0 && isDbConnected()) {
    for (const file of files) {
      try {
        const fileId = await uploadEvidenceBuffer(file.buffer, file.originalname || 'evidence.jpg', {
          contentType: file.mimetype || 'image/jpeg',
          metadata: { scanId, userId },
        });
        evidenceFileIds.push(fileId);
      } catch (err) {
        // Continue if evidence upload fails
        console.warn('Failed to upload evidence file to GridFS:', err.message);
      }
    }
  }

  const complaintData = {
    scan: new mongoose.Types.ObjectId(scanId),
    user: new mongoose.Types.ObjectId(userId),
    district: resolvedDistrict,
    address: resolvedAddress,
    submittedByRole: userRole || 'user',
    violations,
    evidenceFileIds,
    userNote,
    status,
  };

  if (isDbConnected()) {
    const complaint = await Complaint.create(complaintData);
    return complaint;
  }

  return {
    id: new mongoose.Types.ObjectId().toString(),
    ...complaintData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function getComplaintById(id, { userId, role = 'user', district = null } = {}) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError('Invalid complaint ID format');
  }

  const complaint = await Complaint.findById(id).populate('scan').lean();
  if (!complaint) {
    throw new NotFoundError(`Complaint with id ${id} not found`);
  }

  // Scoped authorization check
  const complaintUserId = complaint.user?.id || complaint.user?._id?.toString() || complaint.user?.toString();
  const complaintDistrict = complaint.district ? complaint.district.trim().toUpperCase() : null;
  const userDistrict = district ? district.trim().toUpperCase() : null;

  if (role === 'admin') {
    // Superadmin has universal read access
  } else if (role === 'district_admin') {
    // District Admin can view complaints belonging to their district
    if (!complaintDistrict || complaintDistrict !== userDistrict) {
      throw new ForbiddenError('You do not have permission to view complaints outside your assigned district');
    }
  } else if (role === 'officer') {
    // Officer can view complaints in their district or their own submissions
    if (complaintUserId !== userId?.toString() && (!complaintDistrict || complaintDistrict !== userDistrict)) {
      throw new ForbiddenError('You do not have permission to view this complaint');
    }
  } else if (complaintUserId !== userId?.toString()) {
    throw new ForbiddenError('You do not have permission to view this complaint');
  }

  return complaint;
}

export async function listComplaints({
  userId,
  role = 'user',
  district = null,
  page = 1,
  limit = 20,
  status = null,
} = {}) {
  const query = {};

  if (role === 'admin') {
    // Admin can view all or filter by district
    if (district) {
      query.district = district.trim().toUpperCase();
    }
  } else if (role === 'district_admin') {
    // District Admin ONLY views complaints in their district
    const normDistrict = district ? district.trim().toUpperCase() : null;
    query.district = normDistrict;
  } else if (role === 'officer') {
    // Officer sees complaints in their district
    const normDistrict = district ? district.trim().toUpperCase() : null;
    if (normDistrict) {
      query.district = normDistrict;
    } else {
      query.user = new mongoose.Types.ObjectId(userId);
    }
  } else {
    // Standard citizen only sees their own complaints
    if (!userId) {
      return { items: [], pagination: { total: 0, page: 1, limit, pages: 0 } };
    }
    query.user = new mongoose.Types.ObjectId(userId);
  }

  if (status) {
    query.status = status;
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  if (isDbConnected()) {
    const [items, total] = await Promise.all([
      Complaint.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum).populate('scan').lean(),
      Complaint.countDocuments(query),
    ]);

    return {
      items,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  return {
    items: [],
    pagination: {
      total: 0,
      page: pageNum,
      limit: limitNum,
      pages: 0,
    },
  };
}

export async function generateComplaintPdf(id, { userId, role = 'user' } = {}) {
  const complaint = await getComplaintById(id, { userId, role });

  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    // Header
    doc.fontSize(18).text('SafeFood Compliance Complaint Report', { align: 'center', underline: true });
    doc.moveDown();

    // Overview
    doc.fontSize(12).text(`Complaint ID: ${complaint._id || complaint.id}`);
    doc.text(`Status: ${complaint.status}`);
    doc.text(`Date Filed: ${new Date(complaint.createdAt).toLocaleString()}`);
    doc.moveDown();

    // Scan Details
    if (complaint.scan) {
      doc.fontSize(14).text('Product Information', { underline: true });
      doc.fontSize(11).text(`Barcode: ${complaint.scan.barcode || 'N/A'}`);
      if (complaint.scan.product) {
        doc.text(`Product Name: ${complaint.scan.product.name || 'N/A'}`);
        doc.text(`Brand: ${complaint.scan.product.brand || 'N/A'}`);
      }
      doc.moveDown();
    }

    // Violations
    doc.fontSize(14).text('Statutory Violations (PCR 2011)', { underline: true });
    if (!complaint.violations || complaint.violations.length === 0) {
      doc.fontSize(11).text('No violations recorded.');
    } else {
      complaint.violations.forEach((v, index) => {
        doc.fontSize(11).text(`${index + 1}. [${v.ruleId}] ${v.message}`);
        if (v.sourceRef) {
          doc.fontSize(10).text(`   Statutory Reference: ${v.sourceRef}`);
        }
        if (v.evidence) {
          doc.fontSize(10).text(`   Evidence: ${JSON.stringify(v.evidence)}`);
        }
        doc.moveDown(0.5);
      });
    }

    // AI Legal Metrology Audit Summary if available
    const aiSummary = complaint.scan?.geminiAudit?.executiveSummary || complaint.scan?.report?.geminiAudit?.executiveSummary;
    const aiAdvice = complaint.scan?.geminiAudit?.actionableAdvice || complaint.scan?.report?.geminiAudit?.actionableAdvice;

    if (aiSummary) {
      doc.moveDown();
      doc.fontSize(14).text('AI Statutory Legal Audit Summary', { underline: true });
      doc.fontSize(10).text(aiSummary);
    }

    if (aiAdvice) {
      doc.moveDown(0.5);
      doc.fontSize(11).text('Consumer Actionable Guidance:', { bold: true });
      doc.fontSize(10).text(aiAdvice);
    }

    // Consumer Statement
    if (complaint.userNote) {
      doc.moveDown();
      doc.fontSize(14).text('Consumer Statement', { underline: true });
      doc.fontSize(11).text(complaint.userNote);
    }

    doc.moveDown(2);
    doc.fontSize(9).text(
      'This report was compiled using automated legal metrology inspection by SafeFood with Google Gemini AI in compliance with the Legal Metrology (Packaged Commodities) Rules, 2011 and FSSAI regulations.',
      { align: 'center' },
    );

    doc.end();
  });
}

export default {
  createComplaint,
  getComplaintById,
  listComplaints,
  generateComplaintPdf,
};
