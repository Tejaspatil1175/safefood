import { COMPLIANCE_STATUS } from '../compliance.types.js';

export function evaluateHeightCheck(
  rule,
  fields = {},
  scale = null,
  tolerancePct = 10,
) {
  const fieldData = fields[rule.field];

  if (!fieldData || !fieldData.value || typeof fieldData.value.value !== 'number') {
    return {
      ruleId: rule.id,
      field: rule.field,
      status: COMPLIANCE_STATUS.UNCERTAIN,
      mandatory: rule.mandatory,
      message: `Cannot measure character height: ${rule.field} was not detected`,
      evidence: null,
      sourceRef: rule.sourceRef,
    };
  }

  // 1. Check if scale is available
  const pxPerMm = scale?.pxPerMm;
  if (!pxPerMm || pxPerMm <= 0) {
    return {
      ruleId: rule.id,
      field: rule.field,
      status: COMPLIANCE_STATUS.UNCERTAIN,
      mandatory: rule.mandatory,
      message: 'Scale could not be determined from image. Physical character height cannot be measured without a scale reference.',
      evidence: {
        text: fieldData.rawText,
        scale: null,
      },
      sourceRef: rule.sourceRef,
    };
  }

  // 2. Find height band for the net quantity (normalize kg -> g, l -> ml)
  let qtyVal = fieldData.value.value;
  let qtyUnit = (fieldData.value.unit || 'g').toLowerCase();
  if (qtyUnit === 'kg') {
    qtyVal *= 1000;
    qtyUnit = 'g';
  } else if (qtyUnit === 'l' || qtyUnit === 'litre' || qtyUnit === 'liter') {
    qtyVal *= 1000;
    qtyUnit = 'ml';
  }

  const band = (rule.heightBands || []).find((b) => {
    const unitMatch = b.unit.toLowerCase() === qtyUnit;
    const minOk = qtyVal >= b.minQuantity;
    const maxOk = b.maxQuantity === null || qtyVal <= b.maxQuantity;
    return unitMatch && minOk && maxOk;
  });

  if (!band) {
    return {
      ruleId: rule.id,
      field: rule.field,
      status: COMPLIANCE_STATUS.UNCERTAIN,
      mandatory: rule.mandatory,
      message: `No statutory height band defined for quantity ${qtyVal} ${qtyUnit}`,
      evidence: {
        quantity: fieldData.value,
      },
      sourceRef: rule.sourceRef,
    };
  }

  const requiredMm = band.minHeightMm;
  const effectiveMinMm = requiredMm * (1 - (tolerancePct / 100));

  // 3. Measure glyph height from word references
  let maxGlyphPx = 0;
  if (Array.isArray(fieldData.wordRefs)) {
    for (const word of fieldData.wordRefs) {
      if (typeof word.glyphHeightPx === 'number') {
        maxGlyphPx = Math.max(maxGlyphPx, word.glyphHeightPx);
      } else if (Array.isArray(word.bbox) && word.bbox[3]) {
        maxGlyphPx = Math.max(maxGlyphPx, word.bbox[3]);
      }
    }
  }

  if (maxGlyphPx === 0) {
    return {
      ruleId: rule.id,
      field: rule.field,
      status: COMPLIANCE_STATUS.UNCERTAIN,
      mandatory: rule.mandatory,
      message: 'Glyph pixel height could not be measured from OCR word boxes',
      evidence: { text: fieldData.rawText },
      sourceRef: rule.sourceRef,
    };
  }

  const measuredMm = Number((maxGlyphPx / pxPerMm).toFixed(2));
  const isCompliant = measuredMm >= effectiveMinMm;

  if (isCompliant) {
    return {
      ruleId: rule.id,
      field: rule.field,
      status: COMPLIANCE_STATUS.PASS,
      mandatory: rule.mandatory,
      message: `Numeral height of ${measuredMm} mm meets the statutory minimum of ${requiredMm} mm (band: ${band.sourceRef}).`,
      evidence: {
        text: fieldData.rawText,
        measuredMm,
        requiredMm,
        glyphHeightPx: maxGlyphPx,
        pxPerMm,
        tolerancePct,
      },
      confidence: scale.confidence || 0.9,
      sourceRef: band.sourceRef || rule.sourceRef,
    };
  }

  return {
    ruleId: rule.id,
    field: rule.field,
    status: COMPLIANCE_STATUS.FAIL,
    mandatory: rule.mandatory,
    message: `Net quantity numeral height is ${measuredMm} mm, which is below the minimum required ${requiredMm} mm under ${band.sourceRef}.`,
    evidence: {
      text: fieldData.rawText,
      measuredMm,
      requiredMm,
      glyphHeightPx: maxGlyphPx,
      pxPerMm,
      tolerancePct,
    },
    confidence: scale.confidence || 0.9,
    sourceRef: band.sourceRef || rule.sourceRef,
  };
}

export default evaluateHeightCheck;
