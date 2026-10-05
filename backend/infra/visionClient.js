import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { UpstreamError } from '../lib/errors.js';
import { logger } from '../lib/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FIXTURES_DIR = path.resolve(__dirname, '../../fixtures/labels');

export function getFallbackVisionResult(filename = '') {
  const name = (filename || '').toLowerCase();
  let fixtureId = 'parle-g-800g';

  if (name.includes('lays') || name.includes('chips')) fixtureId = 'lays-classic-50g';
  else if (name.includes('bourbon') || name.includes('britannia')) fixtureId = 'britannia-bourbon-120g';
  else if (name.includes('amul') || name.includes('butter')) fixtureId = 'amul-butter-500g';
  else if (name.includes('maggi') || name.includes('noodle')) fixtureId = 'maggi-noodles-280g';
  else if (name.includes('salt') || name.includes('tata')) fixtureId = 'tata-salt-1kg';
  else if (name.includes('cadbury') || name.includes('dairy')) fixtureId = 'cadbury-dairy-milk-130g';
  else if (name.includes('dabur') || name.includes('honey')) fixtureId = 'dabur-honey-250g';
  else if (name.includes('haldiram') || name.includes('bhujia')) fixtureId = 'haldirams-bhujia-400g';
  else if (name.includes('spice')) fixtureId = 'unknown-spices-100g';

  const filePath = path.join(FIXTURES_DIR, `${fixtureId}.ocr.json`);
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      return data;
    } catch {
      // Fall through to embedded fallback
    }
  }

  return {
    id: fixtureId,
    quality: { pass: true, issues: [] },
    scale: { pxPerMm: 4.0 },
    barcode: { format: 'EAN_13', value: '8901719101038' },
    words: [
      { text: 'Parle-G', bbox: [10, 10, 100, 40], confidence: 0.96, lineId: 1 },
      { text: 'NET', bbox: [10, 50, 40, 70], confidence: 0.95, lineId: 2 },
      { text: 'QTY:', bbox: [45, 50, 80, 70], confidence: 0.95, lineId: 2 },
      { text: '800g', bbox: [85, 50, 135, 70], confidence: 0.98, lineId: 2 },
      { text: 'MRP', bbox: [10, 80, 40, 100], confidence: 0.95, lineId: 3 },
      { text: 'Rs.', bbox: [45, 80, 70, 100], confidence: 0.95, lineId: 3 },
      { text: '85.00', bbox: [75, 80, 120, 100], confidence: 0.98, lineId: 3 },
      { text: 'INCL.', bbox: [125, 80, 160, 100], confidence: 0.92, lineId: 3 },
      { text: 'OF', bbox: [165, 80, 185, 100], confidence: 0.92, lineId: 3 },
      { text: 'ALL', bbox: [190, 80, 215, 100], confidence: 0.92, lineId: 3 },
      { text: 'TAXES', bbox: [220, 80, 260, 100], confidence: 0.92, lineId: 3 },
      { text: 'MFD:', bbox: [10, 110, 50, 130], confidence: 0.95, lineId: 4 },
      { text: '01/2026', bbox: [55, 110, 120, 130], confidence: 0.95, lineId: 4 },
      { text: 'EXPIRY:', bbox: [10, 140, 70, 160], confidence: 0.95, lineId: 5 },
      { text: '07/2026', bbox: [75, 140, 140, 160], confidence: 0.95, lineId: 5 },
      { text: 'Mfg by Parle Products Pvt Ltd, Mumbai', bbox: [10, 170, 310, 190], confidence: 0.95, lineId: 6 },
      { text: 'Customer care: care@parle.biz', bbox: [10, 200, 230, 220], confidence: 0.95, lineId: 7 },
      { text: 'Country of Origin: India', bbox: [10, 230, 185, 250], confidence: 0.95, lineId: 8 },
      { text: 'FSSAI Lic No. 10012022000123', bbox: [10, 260, 240, 280], confidence: 0.95, lineId: 9 },
    ],
  };
}

export async function analyzeImage(imageBuffer, {
  mimeType = 'image/jpeg',
  filename = 'label.jpg',
  referenceHint = null,
  knownPanelMm = null,
  timeoutMs = 5000,
  maxRetries = 1,
  fallbackOnOffline = false,
} = {}) {
  const visionUrl = process.env.VISION_URL || 'http://localhost:8000';
  const url = `${visionUrl.replace(/\/$/, '')}/v1/analyze`;

  let attempts = 0;
  while (attempts <= maxRetries) {
    try {
      attempts += 1;

      const formData = new FormData();
      const blob = new Blob([imageBuffer], { type: mimeType });
      formData.append('image', blob, filename);

      if (referenceHint) {
        formData.append('referenceHint', referenceHint);
      }
      if (knownPanelMm) {
        formData.append('knownPanelMm', JSON.stringify(knownPanelMm));
      }

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new UpstreamError(`Vision service returned HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const isLastAttempt = attempts > maxRetries;
      logger.warn(
        { attempt: attempts, err: err.message, url },
        `Vision service request failed${isLastAttempt ? '' : ', retrying...'}`,
      );

      if (isLastAttempt) {
        if (fallbackOnOffline) {
          logger.info({ filename }, 'Vision service offline, using fallback vision parser');
          return getFallbackVisionResult(filename);
        }
        if (err instanceof UpstreamError) {
          throw err;
        }
        throw new UpstreamError(`Failed to communicate with vision service: ${err.message}`);
      }
    }
  }
}

export default {
  analyzeImage,
  getFallbackVisionResult,
};

