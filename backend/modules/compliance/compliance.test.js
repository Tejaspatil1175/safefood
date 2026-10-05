import { describe, it, expect } from 'vitest';
import { evaluateCompliance } from './compliance.service.js';
import { COMPLIANCE_STATUS } from './compliance.types.js';

// Sample PCR rule set
const mockRuleSet = {
  version: 'pcr-2011.v1',
  rules: [
    {
      id: 'net_quantity.presence',
      field: 'netQuantity',
      type: 'presence',
      mandatory: true,
      sourceRef: 'Rule 6(1)(c)',
      message: 'Net quantity must be declared',
    },
    {
      id: 'net_quantity.format',
      field: 'netQuantity',
      type: 'format',
      mandatory: true,
      allowedUnits: ['g', 'kg', 'ml', 'l'],
      sourceRef: 'Rule 12',
      message: 'Net quantity must use metric units',
    },
    {
      id: 'net_quantity.min_height',
      field: 'netQuantity',
      type: 'min_height',
      mandatory: true,
      sourceRef: 'PCR 2011 Table 1',
      message: 'Numeral height must meet minimum requirements',
      heightBands: [
        { minQuantity: 0, maxQuantity: 50, unit: 'g', minHeightMm: 1.0, sourceRef: 'Upto 50g' },
        { minQuantity: 50.001, maxQuantity: 200, unit: 'g', minHeightMm: 2.0, sourceRef: '50-200g' },
        { minQuantity: 200.001, maxQuantity: 500, unit: 'g', minHeightMm: 4.0, sourceRef: '200-500g' },
        { minQuantity: 500.001, maxQuantity: null, unit: 'g', minHeightMm: 6.0, sourceRef: 'Above 500g' },
      ],
    },
    {
      id: 'mrp.presence',
      field: 'mrp',
      type: 'presence',
      mandatory: true,
      sourceRef: 'Rule 6(1)(e)',
      message: 'MRP must be declared',
    },
    {
      id: 'fssai.presence',
      field: 'fssai',
      type: 'presence',
      mandatory: true,
      sourceRef: 'FSS Act Sec 31',
      message: 'FSSAI License must be declared',
    },
  ],
};

describe('Compliance Engine', () => {
  it('should return PASS when all mandatory declarations and height checks comply', () => {
    const fields = {
      netQuantity: {
        value: { value: 800, unit: 'g' },
        rawText: 'Net Wt: 800g',
        confidence: 0.95,
        wordRefs: [{ text: '800g', glyphHeightPx: 65, bbox: [0, 0, 50, 65] }],
      },
      mrp: {
        value: { amount: 120, currency: 'INR', inclusiveOfTaxes: true },
        rawText: 'MRP Rs. 120',
        confidence: 0.92,
      },
      fssai: {
        value: '10013022002253',
        rawText: 'FSSAI Lic. No. 10013022002253',
        confidence: 0.95,
      },
    };

    // scale: 10 px per mm -> 65px / 10 = 6.5mm (required is 6.0mm)
    const scale = { pxPerMm: 10, confidence: 0.95 };

    const report = evaluateCompliance({
      ruleSet: mockRuleSet,
      fields,
      scale,
    });

    expect(report.verdict).toBe(COMPLIANCE_STATUS.PASS);
    expect(report.summary.fail).toBe(0);
    expect(report.summary.pass).toBe(5);
  });

  it('should return FAIL when character height is smaller than statutory minimum', () => {
    const fields = {
      netQuantity: {
        value: { value: 800, unit: 'g' },
        rawText: 'Net Wt: 800g',
        confidence: 0.95,
        // 30px / 10 = 3.0mm (required: 6.0mm -> FAIL)
        wordRefs: [{ text: '800g', glyphHeightPx: 30, bbox: [0, 0, 50, 30] }],
      },
      mrp: { value: { amount: 120 } },
      fssai: { value: '10013022002253' },
    };

    const scale = { pxPerMm: 10, confidence: 0.95 };

    const report = evaluateCompliance({
      ruleSet: mockRuleSet,
      fields,
      scale,
    });

    expect(report.verdict).toBe(COMPLIANCE_STATUS.FAIL);
    const heightCheck = report.checks.find((c) => c.ruleId === 'net_quantity.min_height');
    expect(heightCheck.status).toBe(COMPLIANCE_STATUS.FAIL);
    expect(heightCheck.evidence.measuredMm).toBe(3);
    expect(heightCheck.evidence.requiredMm).toBe(6);
  });

  it('should return UNCERTAIN when scale is missing rather than falsely failing height', () => {
    const fields = {
      netQuantity: {
        value: { value: 800, unit: 'g' },
        rawText: 'Net Wt: 800g',
        wordRefs: [{ text: '800g', glyphHeightPx: 60 }],
      },
      mrp: { value: { amount: 120 } },
      fssai: { value: '10013022002253' },
    };

    const report = evaluateCompliance({
      ruleSet: mockRuleSet,
      fields,
      scale: null, // No scale in frame
    });

    expect(report.verdict).toBe(COMPLIANCE_STATUS.UNCERTAIN);
    const heightCheck = report.checks.find((c) => c.ruleId === 'net_quantity.min_height');
    expect(heightCheck.status).toBe(COMPLIANCE_STATUS.UNCERTAIN);
  });

  it('should return UNCERTAIN instead of FAIL if missing field is due to blurry image', () => {
    const fields = {
      netQuantity: { value: { value: 50, unit: 'g' }, wordRefs: [{ glyphHeightPx: 20 }] },
      mrp: { value: { amount: 50 } },
      // fssai missing
    };

    const report = evaluateCompliance({
      ruleSet: mockRuleSet,
      fields,
      scale: { pxPerMm: 10 },
      quality: { ok: false, issues: ['BLURRY'] },
    });

    expect(report.verdict).toBe(COMPLIANCE_STATUS.UNCERTAIN);
    const fssaiCheck = report.checks.find((c) => c.ruleId === 'fssai.presence');
    expect(fssaiCheck.status).toBe(COMPLIANCE_STATUS.UNCERTAIN);
  });

  it('should flag FAIL if net quantity conflicts with verified reference product record', () => {
    const fields = {
      netQuantity: {
        value: { value: 500, unit: 'g' },
        rawText: '500g',
        wordRefs: [{ glyphHeightPx: 70 }],
      },
      mrp: { value: { amount: 100 } },
      fssai: { value: '10013022002253' },
    };

    const productRecord = {
      barcode: '8901719101038',
      netQuantity: { value: 800, unit: 'g' }, // Record says 800g, scanned says 500g!
    };

    const report = evaluateCompliance({
      ruleSet: mockRuleSet,
      fields,
      scale: { pxPerMm: 10 },
      product: productRecord,
    });

    expect(report.verdict).toBe(COMPLIANCE_STATUS.FAIL);
    const crossCheck = report.checks.find((c) => c.ruleId === 'product_reference.net_quantity_match');
    expect(crossCheck).toBeDefined();
    expect(crossCheck.status).toBe(COMPLIANCE_STATUS.FAIL);
  });
});
