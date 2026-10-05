import mongoose from 'mongoose';
import { analyzeImage } from '../../infra/visionClient.js';
import { extractFields } from '../extraction/extraction.service.js';
import { getActiveRuleSet } from '../rules/rules.service.js';
import { getProductByBarcode } from '../products/products.service.js';
import { evaluateCompliance } from '../compliance/compliance.service.js';
import { Scan } from './scans.model.js';
import { QualityGateError, NotFoundError, ValidationError, ForbiddenError } from '../../lib/errors.js';
import { isDbConnected } from '../../infra/db.js';
import { logger } from '../../lib/logger.js';

export async function orchestrateScan({
  files = [],
  barcode = null,
  user = null,
  ruleSetVersion = null,
  heightTolerancePct = 10,
} = {}) {
  if (!files || files.length === 0) {
    throw new ValidationError('At least one label image is required for scanning');
  }

  // 1. Send each image to vision service
  const visionResults = await Promise.all(
    files.map((file) =>
      analyzeImage(file.buffer, {
        mimeType: file.mimetype,
        filename: file.originalname,
      }),
    ),
  );

  // 2. Quality gate check across all uploaded images
  const qualityIssues = [];
  for (let i = 0; i < visionResults.length; i += 1) {
    const res = visionResults[i];
    if (res?.quality && res.quality.pass === false) {
      const issues = res.quality.issues || [`Image ${i + 1} quality check failed`];
      qualityIssues.push(...issues);
    }
  }

  if (qualityIssues.length > 0) {
    throw new QualityGateError(
      'Image quality check failed. Please retake the photo with better lighting and focus.',
      qualityIssues,
    );
  }

  // 3. Merge words, extract scale, and detect barcode
  const allWords = [];
  let detectedBarcode = barcode;
  let scale = null;

  for (const res of visionResults) {
    if (Array.isArray(res?.words)) {
      allWords.push(...res.words);
    }
    if (!detectedBarcode && res?.barcode?.value) {
      detectedBarcode = res.barcode.value;
    }
    if (!scale && res?.scale?.pxPerMm) {
      scale = res.scale;
    }
  }

  // 4. Run field extraction
  const fields = extractFields(allWords);

  // 5. Look up reference product if barcode exists
  let product = null;
  if (detectedBarcode) {
    try {
      product = await getProductByBarcode(detectedBarcode);
    } catch (err) {
      logger.debug({ barcode: detectedBarcode, err: err.message }, 'No product reference found for barcode');
      product = null;
    }
  }

  // 6. Get active rule set
  const ruleSet = await getActiveRuleSet();

  // 7. Evaluate compliance
  const report = evaluateCompliance({
    ruleSet,
    fields,
    scale,
    product,
    quality: { ok: true, issues: [] },
    heightTolerancePct,
  });

  // 8. Persist scan
  let scanDoc = null;
  const scanData = {
    user: user?._id || user?.id || null,
    barcode: detectedBarcode || null,
    ruleSetVersion: ruleSetVersion || ruleSet.version || 'pcr-2011.v1',
    verdict: report.verdict,
    report,
    fields,
    qualityIssues: [],
    product: product
      ? {
          name: product.name,
          brand: product.brand,
          netQuantity: product.netQuantity,
          manufacturer: product.manufacturer,
        }
      : null,
  };

  if (isDbConnected()) {
    scanDoc = await Scan.create(scanData);
  } else {
    scanDoc = {
      id: new mongoose.Types.ObjectId().toString(),
      ...scanData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  return {
    scan: scanDoc,
    report,
    fields,
    product,
  };
}

export async function getScanById(id, { userId = null, role = 'user' } = {}) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError('Invalid scan ID format');
  }

  const scan = await Scan.findById(id).lean();
  if (!scan) {
    throw new NotFoundError(`Scan with id ${id} not found`);
  }

  // Ownership check: If scan is associated with a specific user, ensure only owner or admin can view
  if (scan.user && role !== 'admin' && (!userId || scan.user.toString() !== userId.toString())) {
    throw new ForbiddenError('You do not have permission to view this scan record');
  }

  return scan;
}

export async function listScans({
  userId = null,
  role = 'user',
  page = 1,
  limit = 20,
  verdict = null,
} = {}) {
  const query = {};

  if (role !== 'admin') {
    if (userId) {
      query.user = userId;
    } else {
      // Anonymous users only see anonymous scans
      query.user = null;
    }
  } else if (userId) {
    query.user = userId;
  }

  if (verdict) {
    query.verdict = verdict;
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  if (isDbConnected()) {
    const [items, total] = await Promise.all([
      Scan.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      Scan.countDocuments(query),
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

export default {
  orchestrateScan,
  getScanById,
  listScans,
};
