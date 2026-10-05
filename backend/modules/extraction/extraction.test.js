import { describe, it, expect } from 'vitest';
import { extractFields } from './extraction.service.js';

describe('Label Field Extraction Service', () => {
  it('should extract all legal declarations from a realistic packaged food label OCR sample', () => {
    const ocrWords = [
      // Line 1: Product name
      { text: 'PARLE-G', conf: 96, bbox: [20, 10, 80, 25], lineId: 1, glyphHeightPx: 20 },
      { text: 'GLUCO', conf: 95, bbox: [105, 10, 60, 25], lineId: 1, glyphHeightPx: 20 },
      { text: 'BISCUITS', conf: 95, bbox: [170, 10, 90, 25], lineId: 1, glyphHeightPx: 20 },

      // Line 2: Net Quantity
      { text: 'Net', conf: 94, bbox: [20, 45, 35, 18], lineId: 2, glyphHeightPx: 14 },
      { text: 'Weight:', conf: 93, bbox: [60, 45, 65, 18], lineId: 2, glyphHeightPx: 14 },
      { text: '800g', conf: 98, bbox: [130, 45, 45, 18], lineId: 2, glyphHeightPx: 16 },

      // Line 3: MRP
      { text: 'M.R.P.', conf: 92, bbox: [20, 75, 55, 16], lineId: 3, glyphHeightPx: 12 },
      { text: 'Rs.', conf: 90, bbox: [80, 75, 25, 16], lineId: 3, glyphHeightPx: 12 },
      { text: '120.00', conf: 95, bbox: [110, 75, 50, 16], lineId: 3, glyphHeightPx: 14 },
      { text: '(INCL.', conf: 88, bbox: [165, 75, 45, 16], lineId: 3, glyphHeightPx: 10 },
      { text: 'OF', conf: 90, bbox: [215, 75, 20, 16], lineId: 3, glyphHeightPx: 10 },
      { text: 'ALL', conf: 90, bbox: [240, 75, 30, 16], lineId: 3, glyphHeightPx: 10 },
      { text: 'TAXES)', conf: 88, bbox: [275, 75, 55, 16], lineId: 3, glyphHeightPx: 10 },

      // Line 4: Dates
      { text: 'MFD.', conf: 92, bbox: [20, 105, 40, 15], lineId: 4, glyphHeightPx: 11 },
      { text: '10/2024', conf: 95, bbox: [65, 105, 60, 15], lineId: 4, glyphHeightPx: 11 },
      { text: 'BEST', conf: 90, bbox: [140, 105, 40, 15], lineId: 4, glyphHeightPx: 11 },
      { text: 'BEFORE', conf: 90, bbox: [185, 105, 60, 15], lineId: 4, glyphHeightPx: 11 },
      { text: '6', conf: 95, bbox: [250, 105, 15, 15], lineId: 4, glyphHeightPx: 11 },
      { text: 'MONTHS', conf: 92, bbox: [270, 105, 65, 15], lineId: 4, glyphHeightPx: 11 },

      // Line 5: Manufacturer
      { text: 'Mfg', conf: 90, bbox: [20, 130, 35, 15], lineId: 5, glyphHeightPx: 10 },
      { text: 'by:', conf: 90, bbox: [60, 130, 25, 15], lineId: 5, glyphHeightPx: 10 },
      { text: 'Parle', conf: 92, bbox: [90, 130, 45, 15], lineId: 5, glyphHeightPx: 10 },
      { text: 'Products', conf: 92, bbox: [140, 130, 70, 15], lineId: 5, glyphHeightPx: 10 },
      { text: 'Pvt.', conf: 88, bbox: [215, 130, 35, 15], lineId: 5, glyphHeightPx: 10 },
      { text: 'Ltd.,', conf: 88, bbox: [255, 130, 40, 15], lineId: 5, glyphHeightPx: 10 },
      { text: 'Vile', conf: 88, bbox: [300, 130, 30, 15], lineId: 5, glyphHeightPx: 10 },
      { text: 'Parle,', conf: 88, bbox: [335, 130, 45, 15], lineId: 5, glyphHeightPx: 10 },
      { text: 'Mumbai', conf: 90, bbox: [385, 130, 60, 15], lineId: 5, glyphHeightPx: 10 },
      { text: '400057', conf: 95, bbox: [450, 130, 55, 15], lineId: 5, glyphHeightPx: 10 },

      // Line 6: FSSAI
      { text: 'fssai', conf: 92, bbox: [20, 160, 45, 15], lineId: 6, glyphHeightPx: 11 },
      { text: 'Lic.', conf: 90, bbox: [70, 160, 30, 15], lineId: 6, glyphHeightPx: 11 },
      { text: 'No.', conf: 90, bbox: [105, 160, 25, 15], lineId: 6, glyphHeightPx: 11 },
      { text: '10013022002253', conf: 98, bbox: [135, 160, 120, 15], lineId: 6, glyphHeightPx: 11 },

      // Line 7: Customer Care
      { text: 'Consumer', conf: 90, bbox: [20, 190, 75, 14], lineId: 7, glyphHeightPx: 10 },
      { text: 'Care:', conf: 90, bbox: [100, 190, 40, 14], lineId: 7, glyphHeightPx: 10 },
      { text: '1800220096', conf: 95, bbox: [145, 190, 85, 14], lineId: 7, glyphHeightPx: 10 },
      { text: 'care@parle.biz', conf: 92, bbox: [235, 190, 105, 14], lineId: 7, glyphHeightPx: 10 },

      // Line 8: Country of origin
      { text: 'Country', conf: 90, bbox: [20, 215, 60, 14], lineId: 8, glyphHeightPx: 10 },
      { text: 'of', conf: 90, bbox: [85, 215, 15, 14], lineId: 8, glyphHeightPx: 10 },
      { text: 'Origin:', conf: 90, bbox: [105, 215, 50, 14], lineId: 8, glyphHeightPx: 10 },
      { text: 'India', conf: 95, bbox: [160, 215, 40, 14], lineId: 8, glyphHeightPx: 10 },
    ];

    const fields = extractFields(ocrWords);

    // Verify Net Quantity
    expect(fields.netQuantity).not.toBeNull();
    expect(fields.netQuantity.value).toEqual({ value: 800, unit: 'g' });
    expect(fields.netQuantity.confidence).toBeGreaterThanOrEqual(0.85);

    // Verify MRP
    expect(fields.mrp).not.toBeNull();
    expect(fields.mrp.value.amount).toBe(120);
    expect(fields.mrp.value.inclusiveOfTaxes).toBe(true);

    // Verify Dates
    expect(fields.dateOfManufacture).not.toBeNull();
    expect(fields.dateOfManufacture.value).toBe('10/2024');
    expect(fields.expiryOrBestBefore).not.toBeNull();
    expect(fields.expiryOrBestBefore.value).toBe('6 months');

    // Verify Manufacturer
    expect(fields.manufacturer).not.toBeNull();
    expect(fields.manufacturer.value.hasPincode).toBe(true);
    expect(fields.manufacturer.rawText).toContain('400057');

    // Verify FSSAI
    expect(fields.fssai).not.toBeNull();
    expect(fields.fssai.value).toBe('10013022002253');

    // Verify Customer Care
    expect(fields.customerCare).not.toBeNull();
    expect(fields.customerCare.value.email).toBe('care@parle.biz');
    expect(fields.customerCare.value.phone).toBe('1800220096');

    // Verify Origin
    expect(fields.countryOfOrigin).not.toBeNull();
    expect(fields.countryOfOrigin.value.toLowerCase()).toContain('india');
  });
});
