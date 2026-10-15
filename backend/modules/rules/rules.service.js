import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { RuleSet } from './rules.model.js';
import { validateRuleSetFile } from './rules.schema.js';
import { NotFoundError } from '../../lib/errors.js';
import { logger } from '../../lib/logger.js';
import { isDbConnected } from '../../infra/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_RULES_FILE = path.resolve(__dirname, '../../../data/rules/pcr-2011.v1.json');

let cachedActiveRuleSet = null;

export async function getActiveRuleSet({ forceRefresh = false } = {}) {
  if (!forceRefresh && cachedActiveRuleSet) {
    return cachedActiveRuleSet;
  }

  // If DB is connected, fetch active rule set from DB
  if (isDbConnected()) {
    try {
      const activeFromDb = await RuleSet.findOne({ isActive: true }).lean();
      if (activeFromDb) {
        cachedActiveRuleSet = activeFromDb;
        return cachedActiveRuleSet;
      }
    } catch (err) {
      logger.warn({ err: err.message }, 'Failed to query RuleSet from DB, falling back to bundled rules file');
    }
  }

  // Fallback 1: load bundled rules file directly from disk
  if (fs.existsSync(DEFAULT_RULES_FILE)) {
    try {
      const raw = fs.readFileSync(DEFAULT_RULES_FILE, 'utf-8');
      const json = JSON.parse(raw);
      const validated = validateRuleSetFile(json);
      cachedActiveRuleSet = validated;
      return cachedActiveRuleSet;
    } catch (err) {
      logger.warn({ err: err.message }, 'Failed reading DEFAULT_RULES_FILE');
    }
  }

  // Fallback 2: Hardcoded in-memory standard PCR-2011 v1 rule set
  cachedActiveRuleSet = {
    id: 'pcr-2011-v1',
    name: 'Legal Metrology (Packaged Commodities) Rules, 2011 - Mandatory Declarations',
    version: 'pcr-2011.v1',
    source: 'Ministry of Consumer Affairs, Food and Public Distribution, Government of India',
    effectiveFrom: '2011-04-01',
    rules: [
      {
        id: 'manufacturer.presence',
        field: 'manufacturer',
        type: 'presence',
        mandatory: true,
        sourceRef: 'Rule 6(1)(a)',
        message: 'Name and complete address of the manufacturer, packer, or importer must be declared on the package.',
        keywords: ['mfg by', 'manufactured by', 'packed by', 'marketed by', 'imported by', 'mfd by', 'pkd by']
      },
      {
        id: 'product_name.presence',
        field: 'productName',
        type: 'presence',
        mandatory: true,
        sourceRef: 'Rule 6(1)(b)',
        message: 'Common or generic name of the commodity contained in the package must be declared.',
        keywords: ['product', 'commodity', 'name']
      },
      {
        id: 'net_quantity.presence',
        field: 'netQuantity',
        type: 'presence',
        mandatory: true,
        sourceRef: 'Rule 6(1)(c)',
        message: 'Net quantity in terms of standard unit of weight or measure must be declared.',
        keywords: ['net wt', 'net weight', 'net qty', 'net quantity', 'net volume', 'net contents']
      },
      {
        id: 'net_quantity.format',
        field: 'netQuantity',
        type: 'format',
        mandatory: true,
        sourceRef: 'Rule 6(1)(c) & Rule 12',
        message: 'Net quantity must be declared using standard metric units (g, kg, ml, l).',
        allowedUnits: ['g', 'kg', 'ml', 'l', 'units', 'number']
      },
      {
        id: 'mfg_date.presence',
        field: 'mfgDate',
        type: 'presence',
        mandatory: true,
        sourceRef: 'Rule 6(1)(d)',
        message: 'Month and year of manufacture or packaging must be declared.',
        keywords: ['mfd', 'mfg', 'pkd', 'packed', 'date of mfg', 'manufactured']
      },
      {
        id: 'mrp.presence',
        field: 'mrp',
        type: 'presence',
        mandatory: true,
        sourceRef: 'Rule 6(1)(e)',
        message: 'Maximum Retail Price (MRP) inclusive of all taxes must be declared.',
        keywords: ['mrp', 'm.r.p.', 'maximum retail price', 'incl of all taxes', 'incl. of all taxes']
      },
      {
        id: 'mrp.format',
        field: 'mrp',
        type: 'format',
        mandatory: true,
        sourceRef: 'Rule 6(1)(e)',
        message: 'MRP must include currency symbol (Rs. or ₹) and declare inclusion of all taxes.',
        mustInclude: ['incl']
      },
      {
        id: 'consumer_care.presence',
        field: 'consumerCare',
        type: 'presence',
        mandatory: true,
        sourceRef: 'Rule 6(1)(n)',
        message: 'Consumer care details (name, address, phone number, and email address) must be declared.',
        keywords: ['customer care', 'consumer care', 'feedback', 'helpline', 'care cell', 'toll free', 'contact us']
      }
    ]
  };

  return cachedActiveRuleSet;
}

export function clearRuleSetCache() {
  cachedActiveRuleSet = null;
  logger.info('RuleSet in-memory cache cleared');
}

export default {
  getActiveRuleSet,
  clearRuleSetCache,
};
