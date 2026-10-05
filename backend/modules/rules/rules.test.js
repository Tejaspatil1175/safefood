import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, it, expect } from 'vitest';
import { validateRuleSetFile, ruleSetFileSchema } from './rules.schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PCR_2011_FILE = path.resolve(__dirname, '../../../data/rules/pcr-2011.v1.json');

describe('Rules Validation & Schema', () => {
  it('should successfully validate the shipped pcr-2011.v1.json rule file', () => {
    const raw = fs.readFileSync(PCR_2011_FILE, 'utf-8');
    const json = JSON.parse(raw);

    const validated = validateRuleSetFile(json);
    expect(validated).toBeDefined();
    expect(validated.version).toBe('pcr-2011.v1');
    expect(validated.rules.length).toBeGreaterThan(0);

    const netQtyRule = validated.rules.find((r) => r.id === 'net_quantity.min_height');
    expect(netQtyRule).toBeDefined();
    expect(netQtyRule.heightBands).toBeDefined();
    expect(netQtyRule.heightBands.length).toBeGreaterThan(0);
  });

  it('should reject a malformed rule set file schema', () => {
    const malformed = {
      id: 'invalid-rule-set',
      // missing version, name, source
      rules: [
        {
          id: 'test.rule',
          field: 'unknownField', // invalid field name
          type: 'invalidType',
          sourceRef: 'None',
          message: 'Error',
        },
      ],
    };

    expect(() => ruleSetFileSchema.parse(malformed)).toThrow();
  });
});
