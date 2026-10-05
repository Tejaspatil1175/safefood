import { orchestrateScan, getScanById, listScans } from './scans.service.js';

export async function createScan(req, res, next) {
  try {
    const result = await orchestrateScan({
      files: req.scanImages,
      barcode: req.body?.barcode,
      user: req.user,
      ruleSetVersion: req.body?.ruleSetVersion,
    });
    return res.status(201).json(result.scan);
  } catch (err) {
    return next(err);
  }
}

export async function getScan(req, res, next) {
  try {
    const scan = await getScanById(req.params.id);
    return res.status(200).json(scan);
  } catch (err) {
    return next(err);
  }
}

export async function getScansList(req, res, next) {
  try {
    const { page, limit, verdict } = req.query;
    const result = await listScans({
      userId: req.user?._id || req.user?.id,
      page,
      limit,
      verdict,
    });
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
}

export default {
  createScan,
  getScan,
  getScansList,
};
