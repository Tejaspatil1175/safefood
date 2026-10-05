import { z } from 'zod';

export const heightBandSchema = z.object({
  minQuantity: z.number().nonnegative(),
  maxQuantity: z.number().positive().nullable(),
  unit: z.enum(['g', 'ml', 'kg', 'l', 'm', 'cm', 'units', 'number']),
  minHeightMm: z.number().positive(),
  sourceRef: z.string(),
});

export const ruleSchema = z.object({
  id: z.string(),
  field: z.enum([
    'netQuantity',
    'mrp',
    'dateOfManufacture',
    'expiryOrBestBefore',
    'manufacturer',
    'customerCare',
    'countryOfOrigin',
    'fssai',
    'productName',
  ]),
  type: z.enum(['presence', 'format', 'min_height']),
  mandatory: z.boolean().default(true),
  sourceRef: z.string(),
  message: z.string(),
  keywords: z.array(z.string()).optional(),
  pattern: z.string().optional(),
  allowedUnits: z.array(z.string()).optional(),
  heightBands: z.array(heightBandSchema).optional(),
});

export const ruleSetFileSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  source: z.string(),
  effectiveFrom: z.string(),
  rules: z.array(ruleSchema).min(1),
});

export function validateRuleSetFile(data) {
  return ruleSetFileSchema.parse(data);
}

export default {
  ruleSchema,
  ruleSetFileSchema,
  heightBandSchema,
  validateRuleSetFile,
};
