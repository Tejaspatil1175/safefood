import { aggregateVerdict } from './compliance.types.js';
import { evaluatePresenceCheck } from './checks/presence.js';
import { evaluateFormatCheck } from './checks/format.js';
import { evaluateHeightCheck } from './checks/height.js';
import { evaluateProductCrossCheck } from './checks/productMatch.js';

export function evaluateCompliance({
  ruleSet,
  fields = {},
  scale = null,
  product = null,
  quality = { ok: true, issues: [] },
  heightTolerancePct = 10,
}) {
  if (!ruleSet || !Array.isArray(ruleSet.rules)) {
    throw new Error('Valid ruleSet with rules array is required for compliance evaluation');
  }

  const checks = [];

  for (const rule of ruleSet.rules) {
    let result = null;

    switch (rule.type) {
      case 'presence':
        result = evaluatePresenceCheck(rule, fields, quality);
        break;
      case 'format':
        result = evaluateFormatCheck(rule, fields);
        break;
      case 'min_height':
        result = evaluateHeightCheck(rule, fields, scale, heightTolerancePct);
        break;
      default:
        break;
    }

    if (result) {
      checks.push(result);
    }
  }

  // Evaluate reference product cross-checks if product record exists
  const productChecks = evaluateProductCrossCheck(fields, product);
  checks.push(...productChecks);

  // Aggregate overall report verdict and counts
  const { verdict, summary } = aggregateVerdict(checks);

  return {
    verdict,
    ruleSetVersion: ruleSet.version || 'pcr-2011.v1',
    checks,
    summary,
  };
}

export default {
  evaluateCompliance,
};
