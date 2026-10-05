import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, disconnectDB } from '../infra/db.js';
import { RuleSet } from '../modules/rules/rules.model.js';
import { validateRuleSetFile } from '../modules/rules/rules.schema.js';
import { logger } from '../lib/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_RULES_DIR = path.resolve(__dirname, '../../data/rules');

export async function seedRules() {
  logger.info({ dir: DATA_RULES_DIR }, 'Seeding rules from disk...');

  if (!fs.existsSync(DATA_RULES_DIR)) {
    throw new Error(`Rules directory not found at ${DATA_RULES_DIR}`);
  }

  const files = fs.readdirSync(DATA_RULES_DIR).filter((f) => f.endsWith('.json'));
  const seeded = [];

  for (const file of files) {
    const filePath = path.join(DATA_RULES_DIR, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(raw);

    const validated = validateRuleSetFile(json);

    const ruleSet = await RuleSet.findOneAndUpdate(
      { version: validated.version },
      {
        version: validated.version,
        name: validated.name,
        source: validated.source,
        effectiveFrom: validated.effectiveFrom,
        isActive: true,
        rules: validated.rules,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    logger.info({ version: ruleSet.version, rulesCount: ruleSet.rules.length }, `Upserted rule set: ${ruleSet.version}`);
    seeded.push(ruleSet);
  }

  return seeded;
}

// Allow direct execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  (async () => {
    try {
      await connectDB();
      const results = await seedRules();
      logger.info({ count: results.length }, 'Rule seeding completed successfully');
      await disconnectDB();
      process.exit(0);
    } catch (err) {
      logger.error({ err: err.message }, 'Rule seeding failed');
      await disconnectDB();
      process.exit(1);
    }
  })();
}

export default seedRules;
