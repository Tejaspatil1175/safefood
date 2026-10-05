import { orchestrateScan } from './scans.service.js';

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

export default {
  createScan,
};
