import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FIXTURES_DIR = path.resolve(__dirname, '../../fixtures/labels');

if (!fs.existsSync(FIXTURES_DIR)) {
  fs.mkdirSync(FIXTURES_DIR, { recursive: true });
}

const fixtures = [
  {
    id: 'parle-g-800g',
    barcode: '8901719101038',
    scale: { pxPerMm: 4.0 },
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
      { text: 'Mfg', bbox: [10, 170, 40, 190], confidence: 0.95, lineId: 6 },
      { text: 'by:', bbox: [45, 170, 70, 190], confidence: 0.95, lineId: 6 },
      { text: 'Parle', bbox: [75, 170, 115, 190], confidence: 0.95, lineId: 6 },
      { text: 'Products', bbox: [120, 170, 180, 190], confidence: 0.95, lineId: 6 },
      { text: 'Pvt', bbox: [185, 170, 210, 190], confidence: 0.95, lineId: 6 },
      { text: 'Ltd,', bbox: [215, 170, 245, 190], confidence: 0.95, lineId: 6 },
      { text: 'Mumbai', bbox: [250, 170, 310, 190], confidence: 0.95, lineId: 6 },
      { text: 'Customer', bbox: [10, 200, 75, 220], confidence: 0.95, lineId: 7 },
      { text: 'care:', bbox: [80, 200, 120, 220], confidence: 0.95, lineId: 7 },
      { text: 'care@parle.biz', bbox: [125, 200, 230, 220], confidence: 0.95, lineId: 7 },
      { text: 'Country', bbox: [10, 230, 65, 250], confidence: 0.95, lineId: 8 },
      { text: 'of', bbox: [70, 230, 85, 250], confidence: 0.95, lineId: 8 },
      { text: 'Origin:', bbox: [90, 230, 140, 250], confidence: 0.95, lineId: 8 },
      { text: 'India', bbox: [145, 230, 185, 250], confidence: 0.95, lineId: 8 },
      { text: 'FSSAI', bbox: [10, 260, 55, 280], confidence: 0.95, lineId: 9 },
      { text: 'Lic', bbox: [60, 260, 85, 280], confidence: 0.95, lineId: 9 },
      { text: 'No.', bbox: [90, 260, 115, 280], confidence: 0.95, lineId: 9 },
      { text: '10012022000123', bbox: [120, 260, 240, 280], confidence: 0.95, lineId: 9 },
    ],
    expected: {
      verdict: 'PASS',
      barcode: '8901719101038',
      fields: {
        netQuantity: { value: 800, unit: 'g' },
        mrp: { amount: 85.0, currency: 'INR' },
        dateOfManufacture: { rawText: '01/2026' },
        expiryOrBestBefore: { rawText: '07/2026' },
        countryOfOrigin: { country: 'India' },
        fssai: { licenseNumber: '10012022000123' },
      },
    },
  },
  {
    id: 'lays-classic-50g',
    barcode: '8901491101831',
    scale: { pxPerMm: 4.0 },
    words: [
      { text: "Lay's", bbox: [10, 10, 80, 40], confidence: 0.97, lineId: 1 },
      { text: 'Classic', bbox: [85, 10, 150, 40], confidence: 0.95, lineId: 1 },
      { text: 'Net', bbox: [10, 50, 40, 68], confidence: 0.95, lineId: 2 },
      { text: 'Weight:', bbox: [45, 50, 100, 68], confidence: 0.95, lineId: 2 },
      { text: '50 g', bbox: [105, 50, 145, 68], confidence: 0.98, lineId: 2 },
      { text: 'MRP', bbox: [10, 80, 45, 98], confidence: 0.96, lineId: 3 },
      { text: 'Rs. 20.00', bbox: [50, 80, 120, 98], confidence: 0.97, lineId: 3 },
      { text: '(INCLUSIVE OF ALL TAXES)', bbox: [125, 80, 310, 98], confidence: 0.93, lineId: 3 },
      { text: 'Packed:', bbox: [10, 110, 65, 128], confidence: 0.94, lineId: 4 },
      { text: '12/2025', bbox: [70, 110, 130, 128], confidence: 0.96, lineId: 4 },
      { text: 'Best', bbox: [10, 140, 45, 158], confidence: 0.95, lineId: 5 },
      { text: 'Before', bbox: [50, 140, 95, 158], confidence: 0.95, lineId: 5 },
      { text: '4 Months from Packaging', bbox: [100, 140, 270, 158], confidence: 0.94, lineId: 5 },
      { text: 'Manufactured by PepsiCo India Holdings Pvt Ltd, Gurgaon', bbox: [10, 170, 420, 188], confidence: 0.95, lineId: 6 },
      { text: 'Consumer care feedback at consumer.feedback@pepsico.com', bbox: [10, 200, 410, 218], confidence: 0.94, lineId: 7 },
      { text: 'Country of Origin: India', bbox: [10, 230, 180, 248], confidence: 0.96, lineId: 8 },
      { text: 'FSSAI Lic. No. 10014064000435', bbox: [10, 260, 250, 278], confidence: 0.97, lineId: 9 },
    ],
    expected: {
      verdict: 'PASS',
      barcode: '8901491101831',
      fields: {
        netQuantity: { value: 50, unit: 'g' },
        mrp: { amount: 20.0, currency: 'INR' },
        countryOfOrigin: { country: 'India' },
        fssai: { licenseNumber: '10014064000435' },
      },
    },
  },
  {
    id: 'britannia-bourbon-120g',
    barcode: '8901063012627',
    scale: { pxPerMm: 4.0 },
    words: [
      { text: 'Britannia', bbox: [10, 10, 90, 35], confidence: 0.97, lineId: 1 },
      { text: 'Bourbon', bbox: [95, 10, 170, 35], confidence: 0.96, lineId: 1 },
      { text: 'Net Quantity: 120 g', bbox: [10, 50, 160, 70], confidence: 0.98, lineId: 2 },
      { text: 'MRP ₹ 35.00 (INCL. OF ALL TAXES)', bbox: [10, 80, 270, 100], confidence: 0.96, lineId: 3 },
      { text: 'Mfg Date: 02/2026', bbox: [10, 110, 140, 130], confidence: 0.95, lineId: 4 },
      { text: 'Use By: 08/2026', bbox: [10, 140, 125, 160], confidence: 0.95, lineId: 5 },
      { text: 'Mfg by Britannia Industries Ltd, Kolkata 700017', bbox: [10, 170, 370, 190], confidence: 0.95, lineId: 6 },
      { text: 'Consumer care: 1800-425-4449 feedback@britindia.com', bbox: [10, 200, 390, 220], confidence: 0.94, lineId: 7 },
      { text: 'Made in India', bbox: [10, 230, 110, 250], confidence: 0.95, lineId: 8 },
      { text: 'fssai Lic. No. 10015043001129', bbox: [10, 260, 240, 280], confidence: 0.97, lineId: 9 },
    ],
    expected: {
      verdict: 'PASS',
      barcode: '8901063012627',
      fields: {
        netQuantity: { value: 120, unit: 'g' },
        mrp: { amount: 35.0, currency: 'INR' },
        countryOfOrigin: { country: 'India' },
        fssai: { licenseNumber: '10015043001129' },
      },
    },
  },
  {
    id: 'amul-butter-500g',
    barcode: '8901262010052',
    scale: { pxPerMm: 4.0 },
    words: [
      { text: 'Amul', bbox: [10, 10, 60, 35], confidence: 0.98, lineId: 1 },
      { text: 'Butter', bbox: [65, 10, 120, 35], confidence: 0.98, lineId: 1 },
      { text: 'Net Weight : 500 g', bbox: [10, 50, 160, 72], confidence: 0.98, lineId: 2 },
      { text: 'M.R.P. Rs. 275.00 Incl. of all taxes', bbox: [10, 80, 280, 100], confidence: 0.96, lineId: 3 },
      { text: 'PKD: 01/2026', bbox: [10, 110, 110, 130], confidence: 0.95, lineId: 4 },
      { text: 'Best Before 12 Months from packaging', bbox: [10, 140, 310, 160], confidence: 0.94, lineId: 5 },
      { text: 'Marketed by GCMMF Ltd, Anand 388001 Gujarat', bbox: [10, 170, 380, 190], confidence: 0.95, lineId: 6 },
      { text: 'Toll free 1800-258-3333 gcmmf@amul.coop', bbox: [10, 200, 330, 220], confidence: 0.94, lineId: 7 },
      { text: 'Product of India', bbox: [10, 230, 130, 250], confidence: 0.95, lineId: 8 },
      { text: 'FSSAI License No. 10012021000071', bbox: [10, 260, 270, 280], confidence: 0.97, lineId: 9 },
    ],
    expected: {
      verdict: 'PASS',
      barcode: '8901262010052',
      fields: {
        netQuantity: { value: 500, unit: 'g' },
        mrp: { amount: 275.0, currency: 'INR' },
        countryOfOrigin: { country: 'India' },
        fssai: { licenseNumber: '10012021000071' },
      },
    },
  },
  {
    id: 'tata-salt-1kg',
    barcode: '8901030000107',
    scale: { pxPerMm: 4.0 },
    words: [
      { text: 'Tata', bbox: [10, 10, 50, 35], confidence: 0.98, lineId: 1 },
      { text: 'Salt', bbox: [55, 10, 95, 35], confidence: 0.98, lineId: 1 },
      { text: 'Net Quantity: 1 kg', bbox: [10, 50, 150, 72], confidence: 0.98, lineId: 2 },
      { text: 'MRP Rs. 28.00 (INCL. OF ALL TAXES)', bbox: [10, 80, 290, 100], confidence: 0.96, lineId: 3 },
      { text: 'Packed: 01/2026', bbox: [10, 110, 130, 130], confidence: 0.95, lineId: 4 },
      { text: 'Best Before 24 Months from PKD', bbox: [10, 140, 270, 160], confidence: 0.94, lineId: 5 },
      { text: 'Mfg by Tata Consumer Products Ltd, Mumbai', bbox: [10, 170, 360, 190], confidence: 0.95, lineId: 6 },
      { text: 'Customer Care: care@tataconsumer.com 1800-345-1720', bbox: [10, 200, 420, 220], confidence: 0.94, lineId: 7 },
      { text: 'Country of Origin: India', bbox: [10, 230, 180, 250], confidence: 0.96, lineId: 8 },
      { text: 'FSSAI Lic. No. 10014022002759', bbox: [10, 260, 250, 280], confidence: 0.97, lineId: 9 },
    ],
    expected: {
      verdict: 'PASS',
      barcode: '8901030000107',
      fields: {
        netQuantity: { value: 1, unit: 'kg' },
        mrp: { amount: 28.0, currency: 'INR' },
        countryOfOrigin: { country: 'India' },
        fssai: { licenseNumber: '10014022002759' },
      },
    },
  },
  {
    id: 'maggi-noodles-280g',
    barcode: '8901058852894',
    scale: { pxPerMm: 4.0 },
    words: [
      { text: 'MAGGI', bbox: [10, 10, 70, 35], confidence: 0.98, lineId: 1 },
      { text: '2-Minute', bbox: [75, 10, 140, 35], confidence: 0.96, lineId: 1 },
      { text: 'Noodles', bbox: [145, 10, 210, 35], confidence: 0.96, lineId: 1 },
      { text: 'Net Weight: 280 g', bbox: [10, 50, 150, 72], confidence: 0.98, lineId: 2 },
      { text: 'MRP Rs 56.00 (Inclusive of all taxes)', bbox: [10, 80, 280, 100], confidence: 0.96, lineId: 3 },
      { text: 'MFG: 02/2026', bbox: [10, 110, 105, 130], confidence: 0.95, lineId: 4 },
      { text: 'Best Before 9 Months from manufacture', bbox: [10, 140, 310, 160], confidence: 0.94, lineId: 5 },
      { text: 'Manufactured by Nestle India Limited, New Delhi', bbox: [10, 170, 370, 190], confidence: 0.95, lineId: 6 },
      { text: 'Contact wecare@in.nestle.com 1800-103-1947', bbox: [10, 200, 340, 220], confidence: 0.94, lineId: 7 },
      { text: 'Country of Origin: India', bbox: [10, 230, 175, 250], confidence: 0.96, lineId: 8 },
      { text: 'FSSAI Lic. No. 10012011000168', bbox: [10, 260, 245, 280], confidence: 0.97, lineId: 9 },
    ],
    expected: {
      verdict: 'PASS',
      barcode: '8901058852894',
      fields: {
        netQuantity: { value: 280, unit: 'g' },
        mrp: { amount: 56.0, currency: 'INR' },
        countryOfOrigin: { country: 'India' },
        fssai: { licenseNumber: '10012011000168' },
      },
    },
  },
  {
    id: 'cadbury-dairy-milk-130g',
    barcode: '7622201745431',
    scale: { pxPerMm: 4.0 },
    words: [
      { text: 'Cadbury', bbox: [10, 10, 80, 35], confidence: 0.97, lineId: 1 },
      { text: 'Dairy', bbox: [85, 10, 130, 35], confidence: 0.97, lineId: 1 },
      { text: 'Milk', bbox: [135, 10, 175, 35], confidence: 0.97, lineId: 1 },
      { text: 'Net Quantity: 130 g', bbox: [10, 50, 160, 72], confidence: 0.98, lineId: 2 },
      { text: 'MRP Rs 100.00 (Incl. of all taxes)', bbox: [10, 80, 260, 100], confidence: 0.96, lineId: 3 },
      { text: 'Mfg: 01/2026', bbox: [10, 110, 100, 130], confidence: 0.95, lineId: 4 },
      { text: 'Best Before 12 Months', bbox: [10, 140, 180, 160], confidence: 0.94, lineId: 5 },
      { text: 'Mondelez India Foods Pvt Ltd, Mumbai 400018', bbox: [10, 170, 360, 190], confidence: 0.95, lineId: 6 },
      // MISSING customer care! Mandatory violation -> FAIL
      { text: 'Country of Origin: India', bbox: [10, 230, 180, 250], confidence: 0.96, lineId: 8 },
      { text: 'FSSAI Lic. No. 10014022002711', bbox: [10, 260, 245, 280], confidence: 0.97, lineId: 9 },
    ],
    expected: {
      verdict: 'FAIL',
      barcode: '7622201745431',
      failedRuleId: 'customer_care.presence',
    },
  },
  {
    id: 'haldirams-bhujia-400g',
    barcode: '8904004400018',
    scale: { pxPerMm: 4.0 },
    words: [
      { text: "Haldiram's", bbox: [10, 10, 100, 35], confidence: 0.97, lineId: 1 },
      { text: 'Bhujia', bbox: [105, 10, 160, 35], confidence: 0.97, lineId: 1 },
      // Invalid net quantity: number without recognized unit -> FAIL
      { text: 'Net Qty: 400 pieces', bbox: [10, 50, 160, 72], confidence: 0.98, lineId: 2 },
      { text: 'MRP Rs. 120.00 (INCL. OF ALL TAXES)', bbox: [10, 80, 280, 100], confidence: 0.96, lineId: 3 },
      { text: 'PKD: 01/2026', bbox: [10, 110, 110, 130], confidence: 0.95, lineId: 4 },
      { text: 'Best Before 6 Months', bbox: [10, 140, 170, 160], confidence: 0.94, lineId: 5 },
      { text: 'Haldiram Snacks Pvt Ltd, Noida 201307', bbox: [10, 170, 330, 190], confidence: 0.95, lineId: 6 },
      { text: 'Customer care: feedback@haldirams.com 0120-2400123', bbox: [10, 200, 410, 220], confidence: 0.94, lineId: 7 },
      { text: 'Country of Origin: India', bbox: [10, 230, 180, 250], confidence: 0.96, lineId: 8 },
      { text: 'FSSAI Lic. No. 10012051000096', bbox: [10, 260, 245, 280], confidence: 0.97, lineId: 9 },
    ],
    expected: {
      verdict: 'FAIL',
      barcode: '8904004400018',
      failedRuleId: 'net_quantity.presence',
    },
  },
  {
    id: 'dabur-honey-250g',
    barcode: '8901207010482',
    scale: { pxPerMm: 10.0 }, // 10 px per mm -> bbox height 10px = 1.0 mm (below 4mm requirement)
    words: [
      { text: 'Dabur Honey', bbox: [10, 10, 100, 30], confidence: 0.97, lineId: 1 },
      // Numeral bbox height: (48 - 40) = 8px -> 0.8 mm (required 4.0mm) -> FAIL
      { text: 'Net Quantity: 250 g', bbox: [10, 40, 150, 48], confidence: 0.98, lineId: 2 },
      { text: 'MRP Rs. 140.00 (INCL. OF ALL TAXES)', bbox: [10, 60, 280, 80], confidence: 0.96, lineId: 3 },
      { text: 'Mfg: 01/2026', bbox: [10, 90, 100, 110], confidence: 0.95, lineId: 4 },
      { text: 'Best Before 24 Months', bbox: [10, 120, 180, 140], confidence: 0.94, lineId: 5 },
      { text: 'Dabur India Ltd, Ghaziabad 201010', bbox: [10, 150, 320, 170], confidence: 0.95, lineId: 6 },
      { text: 'Care: daburcares@dabur.com 1800-103-1644', bbox: [10, 180, 350, 200], confidence: 0.94, lineId: 7 },
      { text: 'Country of Origin: India', bbox: [10, 210, 180, 230], confidence: 0.96, lineId: 8 },
      { text: 'FSSAI Lic. No. 10012051000023', bbox: [10, 240, 245, 260], confidence: 0.97, lineId: 9 },
    ],
    expected: {
      verdict: 'FAIL',
      barcode: '8901207010482',
      failedRuleId: 'net_quantity.min_height',
    },
  },
  {
    id: 'unknown-spices-100g',
    barcode: '8901234567890',
    scale: null, // No scale
    words: [
      { text: 'Spices', bbox: [10, 10, 60, 35], confidence: 0.45, lineId: 1 }, // Low confidence
      { text: 'Net Qty: 100g', bbox: [10, 50, 120, 70], confidence: 0.50, lineId: 2 },
      { text: 'MRP Rs 40', bbox: [10, 80, 100, 100], confidence: 0.48, lineId: 3 },
      { text: 'Mfg: 01/2026', bbox: [10, 110, 90, 130], confidence: 0.50, lineId: 4 },
      { text: 'Packed in India', bbox: [10, 140, 120, 160], confidence: 0.52, lineId: 5 },
    ],
    expected: {
      verdict: 'UNCERTAIN',
      barcode: '8901234567890',
    },
  },
];

for (const fix of fixtures) {
  const ocrPath = path.join(FIXTURES_DIR, `${fix.id}.ocr.json`);
  const expectedPath = path.join(FIXTURES_DIR, `${fix.id}.expected.json`);

  const ocrData = {
    id: fix.id,
    barcode: fix.barcode ? { format: 'EAN_13', value: fix.barcode } : null,
    scale: fix.scale,
    quality: fix.quality || { pass: true, issues: [] },
    words: fix.words,
  };

  fs.writeFileSync(ocrPath, JSON.stringify(ocrData, null, 2), 'utf-8');
  fs.writeFileSync(expectedPath, JSON.stringify(fix.expected, null, 2), 'utf-8');
}

console.log(`Generated ${fixtures.length} fixture sets in ${FIXTURES_DIR}`);
