import { describe, it, expect, vi, beforeEach } from 'vitest';
import { auditPackagingWithGemini } from '../../infra/geminiClient.js';

describe('Gemini AI Legal Metrology Packaging Auditor', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should generate synthesized legal dossier if apiKey is empty', async () => {
    const res = await auditPackagingWithGemini({
      apiKey: '',
      fields: {
        netQuantity: { value: 800, unit: 'g' },
        mrp: { value: 85.0 },
      },
      deterministicReport: {
        verdict: 'PASS',
        checks: [{ status: 'PASS', ruleId: 'net_quantity.presence' }],
      },
    });

    expect(res).toBeDefined();
    expect(res.source).toBe('rule-engine-fallback');
    expect(res.isValid).toBe(true);
    expect(res.verdict).toBe('PASS');
    expect(res.complianceScore).toBe(100);
    expect(Array.isArray(res.violations)).toBe(true);
    expect(res.violations.length).toBe(0);
  });

  it('should flag violations and construct a non-compliance report when checks fail', async () => {
    const res = await auditPackagingWithGemini({
      apiKey: '',
      fields: {},
      deterministicReport: {
        verdict: 'FAIL',
        checks: [
          {
            status: 'FAIL',
            ruleId: 'mrp.presence',
            message: 'Mandatory MRP declaration is missing',
            evidence: { text: '' },
          },
        ],
      },
    });

    expect(res.isValid).toBe(false);
    expect(res.verdict).toBe('FAIL');
    expect(res.violations.length).toBeGreaterThan(0);
    expect(res.violations[0].rule).toBe('mrp.presence');
    expect(res.actionableAdvice).toContain('National Consumer Helpline');
  });
});
