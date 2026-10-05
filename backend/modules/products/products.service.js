import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Product } from './products.model.js';
import { validateBarcode } from '../../lib/barcode.js';
import { NotFoundError, ValidationError } from '../../lib/errors.js';
import { isDbConnected } from '../../infra/db.js';
import { logger } from '../../lib/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PRODUCTS_SEED_FILE = path.resolve(__dirname, '../../../data/products/products.seed.json');

export async function getProductByBarcode(barcode) {
  const validation = validateBarcode(barcode);
  if (!validation.valid) {
    throw new ValidationError(validation.reason || 'Invalid barcode format or checksum');
  }

  // 1. Try fetching from MongoDB if connected
  if (isDbConnected()) {
    try {
      const product = await Product.findOne({ barcode }).lean();
      if (product) {
        return product;
      }
    } catch (err) {
      logger.warn({ err: err.message, barcode }, 'Failed to query Product from DB, falling back to seed file');
    }
  }

  // 2. Fallback to bundled seed file
  if (fs.existsSync(PRODUCTS_SEED_FILE)) {
    const raw = fs.readFileSync(PRODUCTS_SEED_FILE, 'utf-8');
    const products = JSON.parse(raw);
    const found = products.find((p) => p.barcode === barcode);
    if (found) {
      return found;
    }
  }

  throw new NotFoundError(`Product with barcode ${barcode} not found`);
}

export default {
  getProductByBarcode,
};
