import {
  createComplaint,
  getComplaintById,
  listComplaints,
  generateComplaintPdf,
} from './complaints.service.js';

export async function createComplaintHandler(req, res, next) {
  try {
    const { scanId, confirmed, userNote, district, address } = req.body || {};
    const complaint = await createComplaint({
      scanId,
      confirmed: confirmed === true || confirmed === 'true',
      userNote,
      userId: req.user.sub,
      userRole: req.user.role,
      district: district || req.user.district,
      address: address || req.user.address,
      files: req.files,
    });

    return res.status(201).json(complaint);
  } catch (err) {
    return next(err);
  }
}

export async function getComplaintHandler(req, res, next) {
  try {
    const complaint = await getComplaintById(req.params.id, {
      userId: req.user.sub,
      role: req.user.role,
      district: req.user.district,
    });

    return res.status(200).json(complaint);
  } catch (err) {
    return next(err);
  }
}

export async function listComplaintsHandler(req, res, next) {
  try {
    const { page, limit, status, district } = req.query;
    const result = await listComplaints({
      userId: req.user.sub,
      role: req.user.role,
      district: req.user.district || district,
      page,
      limit,
      status,
    });

    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
}

export async function exportComplaintPdfHandler(req, res, next) {
  try {
    const pdfBuffer = await generateComplaintPdf(req.params.id, {
      userId: req.user.sub,
      role: req.user.role,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="complaint-${req.params.id}.pdf"`);
    return res.status(200).send(pdfBuffer);
  } catch (err) {
    return next(err);
  }
}

export default {
  createComplaintHandler,
  getComplaintHandler,
  listComplaintsHandler,
  exportComplaintPdfHandler,
};
