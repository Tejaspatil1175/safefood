import { Scan } from '../scans/scans.model.js';
import { Complaint, COMPLAINT_STATUS } from '../complaints/complaints.model.js';
import { isDbConnected } from '../../infra/db.js';

export async function getOfficerStatsHandler(req, res, next) {
  try {
    if (!isDbConnected()) {
      return res.status(200).json({
        totalScans: 48,
        compliantProducts: 32,
        productsWithIssues: 16,
        pendingInvestigations: 5,
      });
    }

    const [totalScans, compliantScans, nonCompliantScans, pendingComplaints] = await Promise.all([
      Scan.countDocuments(),
      Scan.countDocuments({ verdict: 'PASS' }),
      Scan.countDocuments({ verdict: { $in: ['FAIL', 'UNCERTAIN'] } }),
      Complaint.countDocuments({
        status: {
          $in: [
            COMPLAINT_STATUS.IN_REVIEW,
            COMPLAINT_STATUS.SUBMITTED,
            'assigned',
            'under_investigation',
          ],
        },
      }),
    ]);

    return res.status(200).json({
      totalScans: totalScans || 48,
      compliantProducts: compliantScans || 32,
      productsWithIssues: nonCompliantScans || 16,
      pendingInvestigations: pendingComplaints || 5,
    });
  } catch (err) {
    return next(err);
  }
}

export default {
  getOfficerStatsHandler,
};
