import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, disconnectDB } from '../infra/db.js';
import { Product } from '../modules/products/products.model.js';
import { isValidEan } from '../lib/barcode.js';
import { logger } from '../lib/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PRODUCTS_SEED_FILE = path.resolve(__dirname, '../../data/products/products.seed.json');

export async function seedProducts() {
  logger.info({ file: PRODUCTS_SEED_FILE }, 'Seeding products from disk...');

  if (!fs.existsSync(PRODUCTS_SEED_FILE)) {
    throw new Error(`Products seed file not found at ${PRODUCTS_SEED_FILE}`);
  }

  const raw = fs.readFileSync(PRODUCTS_SEED_FILE, 'utf-8');
  const products = JSON.parse(raw);
  const seeded = [];

  for (const item of products) {
    if (!isValidEan(item.barcode)) {
      throw new Error(`Invalid barcode in seed file: ${item.barcode} (${item.name})`);
    }

    const doc = await Product.findOneAndUpdate(
      { barcode: item.barcode },
      item,
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    logger.info({ barcode: doc.barcode, name: doc.name }, `Upserted reference product: ${doc.name}`);
    seeded.push(doc);
  }

  return seeded;
}

// Allow direct execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  (async () => {
    try {
      await connectDB();
      const results = await seedProducts();
      logger.info({ count: results.length }, 'Product seeding completed successfully');
      await disconnectDB();
      process.exit(0);
    } catch (err) {
      logger.error({ err: err.message }, 'Product seeding failed');
      await disconnectDB();
      process.exit(1);
    }
  })();
}

export default seedProducts;
