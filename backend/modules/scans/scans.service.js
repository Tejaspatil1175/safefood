import mongoose from 'mongoose';
import { analyzeImage } from '../../infra/visionClient.js';
import { extractFields } from '../extraction/extraction.service.js';
import { getActiveRuleSet } from '../rules/rules.service.js';
import { getProductByBarcode } from '../products/products.service.js';
import { evaluateCompliance } from '../compliance/compliance.service.js';
import { auditPackagingWithGemini } from '../../infra/geminiClient.js';
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
        fallbackOnOffline: true,
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

  // 7b. Perform Gemini AI Legal Metrology & Packaging Compliance Audit
  let geminiAudit = null;
  try {
    geminiAudit = await auditPackagingWithGemini({
      files,
      fields,
      barcode: detectedBarcode,
      product,
      ruleSet,
      deterministicReport: report,
    });
  } catch (err) {
    logger.warn({ err: err.message }, 'Gemini packaging audit skipped due to unexpected error');
  }

  // Attach Gemini audit into the compliance report
  let finalVerdict = report.verdict;
  let activeProduct = product;

  if (geminiAudit) {
    report.geminiAudit = geminiAudit;
    if (Array.isArray(geminiAudit.violations) && geminiAudit.violations.length > 0) {
      report.aiViolations = geminiAudit.violations;
    }
    if (geminiAudit.actionableAdvice) {
      report.actionableAdvice = geminiAudit.actionableAdvice;
    }

    // Unify verdict: if Gemini or rule engine detects failure, final verdict is FAIL
    if (geminiAudit.isValid === false || geminiAudit.verdict === 'FAIL') {
      finalVerdict = 'FAIL';
      report.verdict = 'FAIL';
      if (report.summary) {
        report.summary.fail = Math.max(report.summary.fail || 0, geminiAudit.violations?.length || 1);
      }
    } else if (report.verdict === 'PASS' && geminiAudit.isValid === true) {
      finalVerdict = 'PASS';
    }

    // If Gemini identified product info from real packaging image, enrich product & fields
    if (geminiAudit.detectedProduct) {
      const dp = geminiAudit.detectedProduct;
      if (dp.brand || dp.productName) {
        // If fallback barcode (Parle-G) was used but image is a different brand (e.g. Britannia), clear false barcode
        if (detectedBarcode === '8901719101038' && dp.brand && !dp.brand.toLowerCase().includes('parle')) {
          detectedBarcode = null;
        }

        // If current product reference brand does not match real packaging image brand, prioritize real pack
        if (!activeProduct || (dp.brand && activeProduct.brand && !activeProduct.brand.toLowerCase().includes(dp.brand.toLowerCase()))) {
          activeProduct = {
            name: dp.productName || dp.brand || 'Detected Packaging',
            brand: dp.brand || 'Identified Brand',
            manufacturer: {
              name: dp.manufacturer || 'Detected Manufacturer',
              address: dp.manufacturer || '',
            },
          };
        }
      }

      // Synchronize fields directly from real packaging image
      if (dp.manufacturer) {
        fields.manufacturer = {
          name: 'manufacturer',
          value: { raw: dp.manufacturer, hasAddress: true },
          rawText: dp.manufacturer,
          confidence: 0.95,
        };
      }
      if (dp.consumerCare) {
        fields.customerCare = {
          name: 'customerCare',
          value: { raw: dp.consumerCare },
          rawText: dp.consumerCare,
          confidence: 0.95,
        };
      }
      if (dp.fssaiLicense) {
        fields.fssai = {
          name: 'fssai',
          value: dp.fssaiLicense,
          rawText: dp.fssaiLicense,
          confidence: 0.95,
        };
      }
      if (dp.countryOfOrigin) {
        fields.countryOfOrigin = {
          name: 'countryOfOrigin',
          value: dp.countryOfOrigin.toLowerCase().includes('not') ? null : dp.countryOfOrigin,
          rawText: dp.countryOfOrigin,
          confidence: 0.95,
        };
      }

      if (dp.netQuantity && dp.netQuantity.toLowerCase().includes('not')) {
        fields.netQuantity = { name: 'netQuantity', value: null, rawText: dp.netQuantity, confidence: 0 };
      }
      if (dp.mrp && dp.mrp.toLowerCase().includes('not')) {
        fields.mrp = { name: 'mrp', value: null, rawText: dp.mrp, confidence: 0 };
      }
      if (dp.dates && dp.dates.toLowerCase().includes('not')) {
        fields.dateOfManufacture = { name: 'dateOfManufacture', value: null, rawText: dp.dates, confidence: 0 };
        fields.expiryOrBestBefore = { name: 'expiryOrBestBefore', value: null, rawText: dp.dates, confidence: 0 };
      }
    }

    // If Gemini provided direct declarations audit from the image, synchronize report.checks
    if (Array.isArray(geminiAudit.declarationsAudit) && geminiAudit.declarationsAudit.length > 0) {
      report.checks = geminiAudit.declarationsAudit.map((da) => ({
        ruleId: da.rule || da.declaration,
        field: da.declaration,
        status: da.status,
        mandatory: true,
        message: da.notes || `${da.declaration}: ${da.status}`,
        evidence: { text: da.foundValue },
        sourceRef: da.rule || 'PCR 2011',
      }));

      const passedCount = report.checks.filter((c) => c.status === 'PASS').length;
      const failedCount = report.checks.filter((c) => c.status === 'FAIL').length;
      const uncertainCount = report.checks.filter((c) => c.status === 'UNCERTAIN').length;

      report.summary = {
        pass: passedCount,
        fail: failedCount,
        uncertain: uncertainCount,
        total: report.checks.length,
      };
    }
  }

  // Ensure counts are consistent for all clients
  report.passedRulesCount = report.summary?.pass ?? 0;
  report.failedRulesCount = report.summary?.fail ?? 0;
  report.evaluatedRulesCount = report.summary?.total || (report.passedRulesCount + report.failedRulesCount) || 8;

  // 8. Persist scan
  let scanDoc = null;
  const scanData = {
    user: user?._id || user?.id || null,
    barcode: detectedBarcode || null,
    ruleSetVersion: ruleSetVersion || ruleSet.version || 'pcr-2011.v1',
    verdict: finalVerdict,
    report,
    geminiAudit,
    fields,
    qualityIssues: [],
    product: activeProduct
      ? {
          name: activeProduct.name,
          brand: activeProduct.brand,
          netQuantity: activeProduct.netQuantity,
          manufacturer: activeProduct.manufacturer,
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

  const formattedScan = formatScanForClient(scanDoc);

  return {
    scan: formattedScan,
    report,
    fields,
    product,
  };
}

export function formatScanForClient(scan) {
  if (!scan) return null;
  const isDoc = typeof scan.toObject === 'function';
  const obj = isDoc ? scan.toObject() : { ...scan };

  const id = obj.id || obj._id?.toString();
  const isCompliant = obj.verdict === 'PASS';
  const passCount = obj.report?.summary?.pass ?? (isCompliant ? 8 : 4);
  const totalCount = obj.report?.summary?.total ?? 8;
  const score = isCompliant ? 100 : Math.max(15, Math.round((passCount / (totalCount || 1)) * 100));

  const productInfo = {
    productName:
      obj.product?.name ||
      obj.geminiAudit?.detectedProduct?.name ||
      obj.fields?.productName?.value ||
      'Packaged Product',
    brand: obj.product?.brand || obj.geminiAudit?.detectedProduct?.brand || '',
    netQuantity:
      obj.fields?.netQuantity?.rawText ||
      (obj.product?.netQuantity ? `${obj.product.netQuantity.value} ${obj.product.netQuantity.unit}` : 'N/A'),
    mrp: obj.fields?.mrp?.rawText || 'N/A',
    expiryDate:
      obj.fields?.expiryOrBestBefore?.rawText ||
      obj.geminiAudit?.detectedProduct?.dates ||
      'N/A',
    manufacturer:
      obj.fields?.manufacturer?.rawText ||
      (typeof obj.product?.manufacturer === 'object'
        ? obj.product.manufacturer?.name
        : obj.product?.manufacturer) ||
      'N/A',
    fssaiLicense: obj.fields?.fssai?.rawText || 'N/A',
    barcode: obj.barcode || 'N/A',
  };

  const checklist = (obj.report?.checks || []).map((c) => ({
    label: c.field || c.ruleId,
    status: c.status === 'PASS' ? 'pass' : c.status === 'FAIL' ? 'fail' : 'warning',
    detail: c.message,
    rule: c.ruleId || c.sourceRef,
  }));

  const issues = (obj.report?.checks || [])
    .filter((c) => c.status === 'FAIL')
    .map((c) => ({
      title: c.field || c.ruleId,
      severity: 'high',
      description: c.message,
      rule: c.ruleId || c.sourceRef,
      evidence: c.evidence?.text || '',
    }));

  return {
    ...obj,
    id,
    isCompliant,
    score,
    productInfo,
    checklist,
    issues,
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

  return formatScanForClient(scan);
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
      items: (items || []).map(formatScanForClient),
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
