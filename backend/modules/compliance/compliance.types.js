/**
 * Compliance check statuses and report verdict aggregation.
 */

export const COMPLIANCE_STATUS = Object.freeze({
  PASS: 'PASS',
  FAIL: 'FAIL',
  UNCERTAIN: 'UNCERTAIN',
});

export function aggregateVerdict(checks = []) {
  let pass = 0;
  let fail = 0;
  let uncertain = 0;

  let hasMandatoryFail = false;
  let hasUncertain = false;

  for (const check of checks) {
    if (check.status === COMPLIANCE_STATUS.FAIL) {
      fail += 1;
      if (check.mandatory !== false) {
        hasMandatoryFail = true;
      }
    } else if (check.status === COMPLIANCE_STATUS.UNCERTAIN) {
      uncertain += 1;
      hasUncertain = true;
    } else if (check.status === COMPLIANCE_STATUS.PASS) {
      pass += 1;
    }
  }

  let verdict = COMPLIANCE_STATUS.PASS;
  if (hasMandatoryFail) {
    verdict = COMPLIANCE_STATUS.FAIL;
  } else if (hasUncertain) {
    verdict = COMPLIANCE_STATUS.UNCERTAIN;
  }

  return {
    verdict,
    summary: {
      pass,
      fail,
      uncertain,
      total: checks.length,
    },
  };
}

export default {
  COMPLIANCE_STATUS,
  aggregateVerdict,
};
