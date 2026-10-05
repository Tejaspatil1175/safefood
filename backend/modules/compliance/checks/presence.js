import { COMPLIANCE_STATUS } from '../compliance.types.js';

export function evaluatePresenceCheck(rule, fields = {}, quality = { ok: true, issues: [] }) {
  const fieldData = fields[rule.field];

  // 1. Field is detected
  if (fieldData && fieldData.value !== undefined && fieldData.value !== null) {
    const isLowConfidence = typeof fieldData.confidence === 'number' && fieldData.confidence < 0.65;
    const isQualityDegraded = quality && quality.ok === false;

    if (isLowConfidence || isQualityDegraded) {
      return {
        ruleId: rule.id,
        field: rule.field,
        status: COMPLIANCE_STATUS.UNCERTAIN,
        mandatory: rule.mandatory,
        message: `${rule.message} (detected with low confidence or degraded image quality)`,
        evidence: {
          text: fieldData.rawText || String(fieldData.value),
          bbox: fieldData.wordRefs?.[0]?.bbox || [0, 0, 0, 0],
          confidence: fieldData.confidence || 0.5,
        },
        sourceRef: rule.sourceRef,
      };
    }

    return {
      ruleId: rule.id,
      field: rule.field,
      status: COMPLIANCE_STATUS.PASS,
      mandatory: rule.mandatory,
      message: `${rule.message} is present on the label.`,
      evidence: {
        text: fieldData.rawText || String(fieldData.value),
        bbox: fieldData.wordRefs?.[0]?.bbox || [0, 0, 0, 0],
        confidence: fieldData.confidence || 0.9,
      },
      sourceRef: rule.sourceRef,
    };
  }

  // 2. Field is missing
  // If image quality is poor, mark UNCERTAIN instead of FAIL
  if (quality && quality.ok === false) {
    return {
      ruleId: rule.id,
      field: rule.field,
      status: COMPLIANCE_STATUS.UNCERTAIN,
      mandatory: rule.mandatory,
      message: `Mandatory declaration ${rule.field} was not clearly detected due to image quality issues: ${(quality.issues || []).join(', ')}`,
      evidence: null,
      sourceRef: rule.sourceRef,
    };
  }

  // Standard missing mandatory declaration
  return {
    ruleId: rule.id,
    field: rule.field,
    status: COMPLIANCE_STATUS.FAIL,
    mandatory: rule.mandatory,
    message: rule.message,
    evidence: null,
    sourceRef: rule.sourceRef,
  };
}

export default evaluatePresenceCheck;
