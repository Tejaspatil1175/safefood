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

  // Fallback: load bundled rules file directly from disk
  if (fs.existsSync(DEFAULT_RULES_FILE)) {
    const raw = fs.readFileSync(DEFAULT_RULES_FILE, 'utf-8');
    const json = JSON.parse(raw);
    const validated = validateRuleSetFile(json);
    cachedActiveRuleSet = validated;
    return cachedActiveRuleSet;
  }

  throw new NotFoundError('No active rule set found');
}

export function clearRuleSetCache() {
  cachedActiveRuleSet = null;
  logger.info('RuleSet in-memory cache cleared');
}

export default {
  getActiveRuleSet,
  clearRuleSetCache,
};
