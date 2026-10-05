import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractFields } from '../modules/extraction/extraction.service.js';
import { getProductByBarcode } from '../modules/products/products.service.js';
import { getActiveRuleSet } from '../modules/rules/rules.service.js';
import { evaluateCompliance } from '../modules/compliance/compliance.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FIXTURES_DIR = path.resolve(__dirname, '../../fixtures/labels');

export async function runEvaluation({ maxAllowedFalseFailRate = 0.05 } = {}) {
  if (!fs.existsSync(FIXTURES_DIR)) {
    throw new Error(`Fixtures directory not found: ${FIXTURES_DIR}`);
  }

  const files = fs.readdirSync(FIXTURES_DIR);
  const ocrFiles = files.filter((f) => f.endsWith('.ocr.json'));

  if (ocrFiles.length === 0) {
    throw new Error(`No .ocr.json fixture files found in ${FIXTURES_DIR}`);
  }

  const ruleSet = await getActiveRuleSet();

  let totalFixtures = 0;
  let verdictMatches = 0;
  let falseFails = 0;
  let totalNonFails = 0;

  const fieldStats = {
    netQuantity: { expected: 0, matched: 0 },
    mrp: { expected: 0, matched: 0 },
    countryOfOrigin: { expected: 0, matched: 0 },
    fssai: { expected: 0, matched: 0 },
  };

  const results = [];

  for (const ocrFile of ocrFiles) {
    const id = ocrFile.replace('.ocr.json', '');
    const expectedFile = `${id}.expected.json`;
    const expectedPath = path.join(FIXTURES_DIR, expectedFile);

    if (!fs.existsSync(expectedPath)) {
      continue;
    }

    totalFixtures += 1;
    const ocrData = JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, ocrFile), 'utf-8'));
    const expected = JSON.parse(fs.readFileSync(expectedPath, 'utf-8'));

    // 1. Extraction
    const fields = extractFields(ocrData.words || []);

    // 2. Product lookup
    let product = null;
    const barcode = ocrData.barcode?.value || expected.barcode;
    if (barcode) {
      try {
        product = await getProductByBarcode(barcode);
      } catch {
        product = null;
      }
    }

    // 3. Compliance evaluation
    const report = evaluateCompliance({
      ruleSet,
      fields,
      scale: ocrData.scale,
      product,
      quality: ocrData.quality || { ok: true, issues: [] },
    });

    const isVerdictMatch = report.verdict === expected.verdict;
    if (isVerdictMatch) {
      verdictMatches += 1;
    }

    if (expected.verdict !== 'FAIL') {
      totalNonFails += 1;
      if (report.verdict === 'FAIL') {
        falseFails += 1;
      }
    }

    // Evaluate field extractions
    if (expected.fields) {
      if (expected.fields.netQuantity) {
        fieldStats.netQuantity.expected += 1;
        const netQty = fields.netQuantity?.value;
        if (
          netQty &&
          netQty.value === expected.fields.netQuantity.value &&
          netQty.unit.toLowerCase() === expected.fields.netQuantity.unit.toLowerCase()
        ) {
          fieldStats.netQuantity.matched += 1;
        }
      }

      if (expected.fields.mrp) {
        fieldStats.mrp.expected += 1;
        const mrpVal = fields.mrp?.value;
        if (mrpVal && mrpVal.amount === expected.fields.mrp.amount) {
          fieldStats.mrp.matched += 1;
        }
      }

      if (expected.fields.countryOfOrigin) {
        fieldStats.countryOfOrigin.expected += 1;
        const countryVal = fields.countryOfOrigin?.value;
        const actualCountry = typeof countryVal === 'string' ? countryVal : countryVal?.country;
        const expectedCountry =
          typeof expected.fields.countryOfOrigin === 'string'
            ? expected.fields.countryOfOrigin
            : expected.fields.countryOfOrigin?.country;
        if (
          actualCountry &&
          expectedCountry &&
          actualCountry.toLowerCase() === expectedCountry.toLowerCase()
        ) {
          fieldStats.countryOfOrigin.matched += 1;
        }
      }

      if (expected.fields.fssai) {
        fieldStats.fssai.expected += 1;
        const fssaiVal = fields.fssai?.value;
        const actualFssai = typeof fssaiVal === 'string' ? fssaiVal : fssaiVal?.licenseNumber;
        const expectedFssai =
          typeof expected.fields.fssai === 'string'
            ? expected.fields.fssai
            : expected.fields.fssai?.licenseNumber;
        if (actualFssai && expectedFssai && actualFssai === expectedFssai) {
          fieldStats.fssai.matched += 1;
        }
      }
    }

    results.push({
      id,
      expectedVerdict: expected.verdict,
      actualVerdict: report.verdict,
      match: isVerdictMatch,
    });
  }

  const verdictAccuracy = totalFixtures > 0 ? (verdictMatches / totalFixtures) * 100 : 0;
  const falseFailRate = totalNonFails > 0 ? falseFails / totalNonFails : 0;

  const summary = {
    totalFixtures,
    verdictMatches,
    verdictAccuracyPct: verdictAccuracy.toFixed(1),
    falseFails,
    totalNonFails,
    falseFailRatePct: (falseFailRate * 100).toFixed(1),
    fieldAccuracy: {
      netQuantity:
        fieldStats.netQuantity.expected > 0
          ? `${((fieldStats.netQuantity.matched / fieldStats.netQuantity.expected) * 100).toFixed(1)}%`
          : 'N/A',
      mrp:
        fieldStats.mrp.expected > 0
          ? `${((fieldStats.mrp.matched / fieldStats.mrp.expected) * 100).toFixed(1)}%`
          : 'N/A',
      countryOfOrigin:
        fieldStats.countryOfOrigin.expected > 0
          ? `${((fieldStats.countryOfOrigin.matched / fieldStats.countryOfOrigin.expected) * 100).toFixed(1)}%`
          : 'N/A',
      fssai:
        fieldStats.fssai.expected > 0
          ? `${((fieldStats.fssai.matched / fieldStats.fssai.expected) * 100).toFixed(1)}%`
          : 'N/A',
    },
    passedGate: falseFailRate <= maxAllowedFalseFailRate,
    results,
  };

  return summary;
}

// CLI runner
if (process.argv[1] && process.argv[1].endsWith('evaluate.js')) {
  runEvaluation()
    .then((summary) => {
      console.log('================================================================');
      console.log('            SafeFood Pipeline Evaluation Report                 ');
      console.log('================================================================');
      console.log(`Fixtures Evaluated:    ${summary.totalFixtures}`);
      console.log(`Verdict Agreement:     ${summary.verdictMatches}/${summary.totalFixtures} (${summary.verdictAccuracyPct}%)`);
      console.log(`False-FAIL Rate:       ${summary.falseFails}/${summary.totalNonFails} (${summary.falseFailRatePct}%)`);
      console.log('----------------------------------------------------------------');
      console.log('Field Extraction Accuracy:');
      console.log(`  - Net Quantity:      ${summary.fieldAccuracy.netQuantity}`);
      console.log(`  - MRP:               ${summary.fieldAccuracy.mrp}`);
      console.log(`  - Country of Origin: ${summary.fieldAccuracy.countryOfOrigin}`);
      console.log(`  - FSSAI License:     ${summary.fieldAccuracy.fssai}`);
      console.log('----------------------------------------------------------------');
      console.log('Individual Results:');
      summary.results.forEach((r) => {
        const icon = r.match ? '✓' : '✗';
        console.log(`  ${icon} [${r.id}] expected: ${r.expectedVerdict}, actual: ${r.actualVerdict}`);
      });
      console.log('================================================================');

      const isCiGate = process.argv.includes('--ci') || process.argv.includes('--gate');
      if (isCiGate && !summary.passedGate) {
        console.error(`\nCI Gate Failed: False-FAIL rate of ${summary.falseFailRatePct}% exceeds threshold.`);
        process.exit(1);
      }
    })
    .catch((err) => {
      console.error('Evaluation failed:', err);
      process.exit(1);
    });
}

export default runEvaluation;
