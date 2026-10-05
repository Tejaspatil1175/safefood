import { describe, it, expect } from 'vitest';
import { validateBarcode, isValidEan, calculateEanCheckDigit } from '../../lib/barcode.js';

describe('Barcode Checksum Validation', () => {
  it('should calculate correct check digit for 12-digit payloads', () => {
    // Parle-G 12 digits: '890171910103' -> check digit 8
    expect(calculateEanCheckDigit('890171910103')).toBe(8);

    // Maggi 12 digits: '890105885223' -> check digit 3
    expect(calculateEanCheckDigit('890105885223')).toBe(3);

    // EAN-8 7 digits: '9638507' -> check digit 4
    expect(calculateEanCheckDigit('9638507')).toBe(4);
  });

  it('should validate valid EAN-13 barcodes correctly', () => {
    // Parle-G 800g EAN-13
    const result1 = validateBarcode('8901719101038');
    expect(result1.valid).toBe(true);
    expect(result1.type).toBe('EAN13');
    expect(isValidEan('8901719101038')).toBe(true);

    // Maggi 2-Minute Noodles EAN-13
    const result2 = validateBarcode('8901058852233');
    expect(result2.valid).toBe(true);
    expect(result2.type).toBe('EAN13');
  });

  it('should validate valid EAN-8 barcodes correctly', () => {
    const result = validateBarcode('96385074');
    expect(result.valid).toBe(true);
    expect(result.type).toBe('EAN8');
    expect(isValidEan('96385074')).toBe(true);
  });

  it('should reject barcode with invalid check digit', () => {
    // Correct check digit is 8, here we pass 0
    const result = validateBarcode('8901719101030');
    expect(result.valid).toBe(false);
    expect(result.type).toBe('EAN13');
    expect(result.reason).toContain('Invalid EAN-13 checksum');
    expect(isValidEan('8901719101030')).toBe(false);
  });

  it('should reject invalid length or non-numeric barcodes', () => {
    expect(validateBarcode('12345').valid).toBe(false);
    expect(validateBarcode('890171910103899').valid).toBe(false);
    expect(validateBarcode('890171910103a').valid).toBe(false);
    expect(validateBarcode('').valid).toBe(false);
  });
});
