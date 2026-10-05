import { COMPLIANCE_STATUS } from '../compliance.types.js';

export function evaluateFormatCheck(rule, fields = {}) {
  const fieldData = fields[rule.field];

  if (!fieldData || fieldData.value === undefined || fieldData.value === null) {
    // If field is missing, format check is uncertain or skipped (presence check handles failure)
    return {
      ruleId: rule.id,
      field: rule.field,
      status: COMPLIANCE_STATUS.UNCERTAIN,
      mandatory: rule.mandatory,
      message: `Cannot check format for ${rule.field}: field not found on label`,
      evidence: null,
      sourceRef: rule.sourceRef,
    };
  }

  // 1. Allowed units check (e.g. netQuantity units)
  if (Array.isArray(rule.allowedUnits) && rule.allowedUnits.length > 0) {
    const unit = fieldData.value?.unit?.toLowerCase();
    const isAllowed = rule.allowedUnits.includes(unit);

    if (isAllowed) {
      return {
        ruleId: rule.id,
        field: rule.field,
        status: COMPLIANCE_STATUS.PASS,
        mandatory: rule.mandatory,
        message: `Net quantity unit '${unit}' is standard and compliant with ${rule.sourceRef}.`,
        evidence: {
          text: fieldData.rawText,
          unit,
          allowedUnits: rule.allowedUnits,
        },
        sourceRef: rule.sourceRef,
      };
    }

    return {
      ruleId: rule.id,
      field: rule.field,
      status: COMPLIANCE_STATUS.FAIL,
      mandatory: rule.mandatory,
      message: `Net quantity unit '${unit}' is not an approved metric unit under ${rule.sourceRef}. Allowed: ${rule.allowedUnits.join(', ')}`,
      evidence: {
        text: fieldData.rawText,
        unit,
        allowedUnits: rule.allowedUnits,
      },
      sourceRef: rule.sourceRef,
    };
  }

  // 2. Custom pattern check
  if (rule.pattern) {
    const regex = new RegExp(rule.pattern, 'i');
    const matches = regex.test(fieldData.rawText);

    return {
      ruleId: rule.id,
      field: rule.field,
      status: matches ? COMPLIANCE_STATUS.PASS : COMPLIANCE_STATUS.FAIL,
      mandatory: rule.mandatory,
      message: matches
        ? `Field ${rule.field} matches required format`
        : `Field ${rule.field} does not match required format pattern`,
      evidence: {
        text: fieldData.rawText,
      },
      sourceRef: rule.sourceRef,
    };
  }

  return {
    ruleId: rule.id,
    field: rule.field,
    status: COMPLIANCE_STATUS.PASS,
    mandatory: rule.mandatory,
    message: `${rule.field} format is compliant`,
    evidence: { text: fieldData.rawText },
    sourceRef: rule.sourceRef,
  };
}

export default evaluateFormatCheck;
