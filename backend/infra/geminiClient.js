import { logger } from '../lib/logger.js';
import env from '../config/env.js';

/**
 * Perform AI Legal Metrology & Food Packaging Compliance Audit using Google Gemini.
 * Inspects uploaded packaging photos directly and audits mandatory declarations
 * against India's Legal Metrology (Packaged Commodities) Rules, 2011 and FSSAI regulations.
 *
 * @param {Object} options
 * @param {Array<{buffer: Buffer, mimetype: string, originalname: string}>} options.files - Uploaded image files
 * @param {Object} options.fields - Initial extracted fields (if any)
 * @param {string|null} options.barcode - Decoded or supplied barcode
 * @param {Object|null} options.product - Reference database product
 * @param {Object|null} options.ruleSet - Statutory rule set
 * @param {Object|null} options.deterministicReport - Rule engine compliance output
 * @param {string|null} options.apiKey - Optional API key override
 * @returns {Promise<Object>} Comprehensive Gemini AI compliance audit report
 */
export async function auditPackagingWithGemini({
  files = [],
  fields = {},
  barcode = null,
  product = null,
  ruleSet = null,
  deterministicReport = null,
  apiKey = null,
} = {}) {
  const keyToUse = apiKey !== null ? apiKey : (process.env.GEMINI_API_KEY || env.GEMINI_API_KEY);
  const preferredModel = env.GEMINI_MODEL || process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  // If no Gemini API key configured or in test mode without explicit key, synthesize compliance dossier
  if (!keyToUse || (process.env.NODE_ENV === 'test' && !apiKey)) {
    logger.debug('Synthesizing compliance dossier from rules engine');
    return synthesizeDossierFromRules({ fields, barcode, product, deterministicReport });
  }

  try {
    const promptText = buildAuditPrompt({ fields, barcode, product, deterministicReport, hasFiles: files && files.length > 0 });
    const parts = [{ text: promptText }];

    // Attach up to 2 uploaded images as inline_data
    if (Array.isArray(files)) {
      for (const file of files.slice(0, 2)) {
        if (file?.buffer) {
          const buf = Buffer.isBuffer(file.buffer) ? file.buffer : Buffer.from(file.buffer);
          // Only attach if buffer has content and appears to be an image
          if (buf.length > 50) {
            const mimeType = file.mimetype || 'image/jpeg';
            parts.push({
              inline_data: {
                mime_type: mimeType,
                data: buf.toString('base64'),
              },
            });
          }
        }
      }
    }

    const candidateModels = [preferredModel, 'gemini-2.5-flash', 'gemini-3.8-flash', 'gemini-flash-latest'];
    const uniqueModels = [...new Set(candidateModels)];

    let rawOutput = null;
    let successfulModel = null;
    let lastError = null;

    for (const model of uniqueModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(keyToUse)}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts,
              },
            ],
            generationConfig: {
              responseMimeType: 'application/json',
            },
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        const resData = await response.json();
        const candidateText = resData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          rawOutput = candidateText;
          successfulModel = model;
          break;
        }
      } catch (err) {
        lastError = err;
        logger.warn({ model, err: err.message }, 'Gemini model attempt failed, trying fallback');
      }
    }

    if (!rawOutput) {
      throw lastError || new Error('No content returned from Gemini models');
    }

    const parsed = JSON.parse(rawOutput);
    return formatGeminiDossier(parsed, successfulModel, deterministicReport);
  } catch (err) {
    logger.warn({ err: err.message }, 'Gemini audit failed; falling back to synthesized legal report');
    return synthesizeDossierFromRules({ fields, barcode, product, deterministicReport, errorNote: err.message });
  }
}

function buildAuditPrompt({ fields = {}, barcode = null, product = null, deterministicReport = null, hasFiles = false }) {
  const fieldsJson = JSON.stringify(
    Object.entries(fields).reduce((acc, [k, v]) => {
      acc[k] = v?.value || v?.rawText || v;
      return acc;
    }, {}),
    null,
    2,
  );

  return `You are an expert Legal Metrology & Food Safety compliance auditor in India.
Your mission is to inspect this packaged food commodity against:
1. Legal Metrology (Packaged Commodities) Rules, 2011 (PCR 2011)
2. Legal Metrology Act, 2009 (Sections 18 & 36)
3. FSSAI (Packaging and Labelling) Regulations, 2018

${hasFiles ? 'IMPORTANT: You are provided with actual packaging image(s). Read and inspect the text, logos, numbers, and panels DIRECTLY from the image(s).' : ''}

Statutory Mandatory Declarations to verify:
1. Rule 6(1)(a): Common or generic name of commodity (e.g., 'Biscuits', 'Cookies', 'Chips'). Brand name alone is NOT sufficient.
2. Rule 6(1)(b): Complete postal address of manufacturer / packer / marketer / importer (must include street/locality, city, state, and PIN code).
3. Rule 6(1)(c) & Rule 12: Net quantity in standard metric units (g, kg, ml, l) with adequate numeral font size on principal display panel.
4. Rule 6(1)(d): Month and year of manufacture or pre-packing, and Expiry / Best Before date.
5. Rule 6(1)(e): Maximum Retail Price (explicitly stating 'MRP Rs.' or 'MRP ₹' inclusive of all taxes).
6. Rule 6(1)(n): Consumer care contact details (officer designation, telephone number, email address, and complete physical postal address).
7. Rule 6(10): Country of origin.
8. FSSAI Regulations: 14-digit FSSAI license number AND the mandatory FSSAI food safety logo.

Extracted OCR Reference (Initial):
${fieldsJson}
${barcode ? `Barcode: ${barcode}` : ''}
${product ? `Catalog Match: ${product.brand} - ${product.name}` : ''}

INSTRUCTIONS:
1. Identify the actual product, brand, and declarations from the image(s).
2. If this is only one panel (e.g. back panel) and certain declarations like Net Qty, MRP, or Dates are typically on the front panel or seal, explicitly note whether they are visible on this panel or missing.
3. If all mandatory declarations are present and satisfy the statutory requirements:
   - "isValid": true
   - "verdict": "PASS"
   - "violations": []
   - "complianceScore": 100
   - "executiveSummary": "All mandatory packaging declarations comply with Legal Metrology (Packaged Commodities) Rules, 2011."
4. If mandatory declarations are missing, truncated (e.g., address missing PIN code or state, customer care missing phone number, generic name absent, MRP format invalid):
   - "isValid": false
   - "verdict": "FAIL"
   - "complianceScore": 0 to 80
   - "violations": detailed array with rule, title, severity (CRITICAL | HIGH | MEDIUM | LOW), description, evidence, and legalConsequence.
   - "actionableAdvice": specific guidance for consumer complaints and manufacturer corrective actions.

Respond STRICTLY with valid JSON following this schema:
{
  "detectedProduct": {
    "brand": string,
    "productName": string,
    "manufacturer": string,
    "consumerCare": string,
    "netQuantity": string,
    "mrp": string,
    "dates": string,
    "fssaiLicense": string,
    "hasFssaiLogo": boolean,
    "countryOfOrigin": string
  },
  "isValid": boolean,
  "verdict": "PASS" | "FAIL" | "UNCERTAIN",
  "complianceScore": number,
  "executiveSummary": string,
  "declarationsAudit": [
    {
      "declaration": string,
      "rule": string,
      "status": "PASS" | "FAIL" | "UNCERTAIN",
      "foundValue": string,
      "notes": string
    }
  ],
  "violations": [
    {
      "rule": string,
      "title": string,
      "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
      "description": string,
      "evidence": string,
      "legalConsequence": string
    }
  ],
  "actionableAdvice": string
}`;
}

function formatGeminiDossier(data, modelName, deterministicReport) {
  const violations = Array.isArray(data.violations) ? data.violations : [];
  const isValid = data.isValid === true && violations.length === 0;
  const verdict = isValid ? 'PASS' : (data.verdict || 'FAIL');

  return {
    source: 'gemini-ai',
    model: modelName || 'gemini-2.5-flash',
    detectedProduct: data.detectedProduct || null,
    isValid,
    verdict,
    complianceScore: typeof data.complianceScore === 'number' ? data.complianceScore : (isValid ? 100 : 45),
    executiveSummary: data.executiveSummary || (isValid ? 'Product packaging complies with Legal Metrology Rules.' : 'Product packaging exhibits statutory violations under PCR 2011.'),
    declarationsAudit: Array.isArray(data.declarationsAudit) ? data.declarationsAudit : [],
    violations,
    actionableAdvice: data.actionableAdvice || (isValid ? 'Product is compliant. Safe to purchase.' : 'Non-compliant product. Consumers may file a complaint with National Consumer Helpline (1915).'),
    auditedAt: new Date().toISOString(),
  };
}

function synthesizeDossierFromRules({ fields = {}, barcode = null, product = null, deterministicReport = null, errorNote = null }) {
  const failedChecks = (deterministicReport?.checks || []).filter((c) => c.status === 'FAIL');
  const uncertainChecks = (deterministicReport?.checks || []).filter((c) => c.status === 'UNCERTAIN');
  const isValid = failedChecks.length === 0;
  const verdict = !isValid ? 'FAIL' : (uncertainChecks.length > 0 ? 'UNCERTAIN' : 'PASS');

  const violations = failedChecks.map((c) => ({
    rule: c.ruleId || 'PCR 2011 Mandatory Declaration',
    title: c.message || 'Statutory Requirement Violation',
    severity: 'HIGH',
    description: c.message || 'Declaration does not satisfy statutory requirements under Legal Metrology Rules, 2011.',
    evidence: c.evidence?.text ? `Found: "${c.evidence.text}"` : 'Declaration missing or unreadable on pack.',
    legalConsequence: 'Liable for penalty under Section 36 of Legal Metrology Act, 2009 for sale of non-compliant commodity.',
  }));

  return {
    source: 'rule-engine-fallback',
    model: 'pcr-2011-statutory-engine',
    isValid,
    verdict,
    complianceScore: isValid ? 100 : Math.max(20, 100 - (failedChecks.length * 25)),
    executiveSummary: isValid
      ? 'All mandatory declarations comply with Legal Metrology (Packaged Commodities) Rules, 2011. No statutory infractions found.'
      : `Packaging audit identified ${failedChecks.length} statutory violation(s) under Legal Metrology (Packaged Commodities) Rules, 2011. Non-compliant for retail distribution without rectification.`,
    declarationsAudit: [
      { declaration: 'Net Quantity', rule: 'PCR 2011 Rule 6(1)(c)', status: fields.netQuantity?.value ? 'PASS' : 'FAIL', foundValue: fields.netQuantity?.value ? `${fields.netQuantity.value} ${fields.netQuantity.unit || ''}` : 'Not found', notes: 'Mandatory standard units and numeral height' },
      { declaration: 'Maximum Retail Price (MRP)', rule: 'PCR 2011 Rule 6(1)(e)', status: fields.mrp?.value ? 'PASS' : 'FAIL', foundValue: fields.mrp?.value ? `Rs. ${fields.mrp.value}` : 'Not found', notes: 'Mandatory inclusive of all taxes declaration' },
      { declaration: 'Date of Packing / Mfg', rule: 'PCR 2011 Rule 6(1)(d)', status: fields.dateOfManufacture?.value ? 'PASS' : 'FAIL', foundValue: fields.dateOfManufacture?.value || 'Not found', notes: 'Month and year of manufacture or pre-packing' },
      { declaration: 'Manufacturer Address', rule: 'PCR 2011 Rule 6(1)(b)', status: fields.manufacturer?.value ? 'PASS' : 'FAIL', foundValue: fields.manufacturer?.value || 'Not found', notes: 'Full address with postal locality and PIN code' },
      { declaration: 'Consumer Care', rule: 'PCR 2011 Rule 6(1)(n)', status: fields.customerCare?.value ? 'PASS' : 'FAIL', foundValue: fields.customerCare?.value || 'Not found', notes: 'Name, address, telephone, email of grievance officer' },
      { declaration: 'Country of Origin', rule: 'PCR 2011 Rule 6(10)', status: fields.countryOfOrigin?.value ? 'PASS' : 'FAIL', foundValue: fields.countryOfOrigin?.value || 'Not found', notes: 'Country of origin for imported or domestic goods' },
      { declaration: 'FSSAI License', rule: 'FSSAI Packaging Regulations', status: fields.fssaiLicense?.value ? 'PASS' : 'FAIL', foundValue: fields.fssaiLicense?.value || 'Not found', notes: '14-digit license number and logo' },
    ],
    violations,
    actionableAdvice: isValid
      ? 'Package is compliant with Legal Metrology Rules, 2011.'
      : 'Consumers may file a complaint with the National Consumer Helpline (NCH: 1915 or consumerhelpline.gov.in) or Department of Legal Metrology attaching this dossier.',
    auditedAt: new Date().toISOString(),
    note: errorNote ? `Note: Live AI inspection fallback: ${errorNote}` : undefined,
  };
}

export default {
  auditPackagingWithGemini,
};
