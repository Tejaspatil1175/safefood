/**
 * GS1 standard Modulo-10 checksum validation for EAN-13 and EAN-8 barcodes.
 */

export function calculateEanCheckDigit(digitsWithoutCheck) {
  const digits = digitsWithoutCheck.split('').map(Number);
  const len = digits.length;

  let sum = 0;
  for (let i = 0; i < len; i += 1) {
    // For EAN-13 (12 digits): positions from right are odd/even.
    // Index from right: len - 1 - i. If index from right is even (0-indexed from right), weight is 3, else 1.
    const posFromRight = len - 1 - i;
    const weight = posFromRight % 2 === 0 ? 3 : 1;
    sum += digits[i] * weight;
  }

  const remainder = sum % 10;
  return (10 - remainder) % 10;
}

export function validateBarcode(barcode) {
  if (typeof barcode !== 'string') {
    return { valid: false, type: 'INVALID', reason: 'Barcode must be a string' };
  }

  const cleaned = barcode.trim();
  if (!/^\d+$/.test(cleaned)) {
    return { valid: false, type: 'INVALID', reason: 'Barcode must contain digits only' };
  }

  if (cleaned.length === 13) {
    const payload = cleaned.slice(0, 12);
    const checkDigit = Number(cleaned.slice(12));
    const calculated = calculateEanCheckDigit(payload);

    if (checkDigit === calculated) {
      return { valid: true, type: 'EAN13', barcode: cleaned };
    }
    return {
      valid: false,
      type: 'EAN13',
      reason: `Invalid EAN-13 checksum: expected ${calculated}, got ${checkDigit}`,
    };
  }

  if (cleaned.length === 8) {
    const payload = cleaned.slice(0, 7);
    const checkDigit = Number(cleaned.slice(7));
    const calculated = calculateEanCheckDigit(payload);

    if (checkDigit === calculated) {
      return { valid: true, type: 'EAN8', barcode: cleaned };
    }
    return {
      valid: false,
      type: 'EAN8',
      reason: `Invalid EAN-8 checksum: expected ${calculated}, got ${checkDigit}`,
    };
  }

  return {
    valid: false,
    type: 'INVALID',
    reason: `Invalid barcode length: expected 8 or 13 digits, got ${cleaned.length}`,
  };
}

export function isValidEan(barcode) {
  return validateBarcode(barcode).valid;
}

export default {
  validateBarcode,
  isValidEan,
  calculateEanCheckDigit,
};
