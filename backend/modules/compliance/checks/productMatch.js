import { COMPLIANCE_STATUS } from '../compliance.types.js';

export function evaluateProductCrossCheck(fields = {}, product = null) {
  if (!product) {
    // If no reference product in database, skip cross-check (do not fail)
    return [];
  }

  const checks = [];

  // 1. Net Quantity Cross-Check
  if (fields.netQuantity && fields.netQuantity.value) {
    const labelVal = fields.netQuantity.value.value;
    const labelUnit = fields.netQuantity.value.unit?.toLowerCase();
    const refVal = product.netQuantity?.value;
    const refUnit = product.netQuantity?.unit?.toLowerCase();

    if (typeof refVal === 'number' && refUnit) {
      const isQtyMatch = labelVal === refVal && labelUnit === refUnit;
      checks.push({
        ruleId: 'product_reference.net_quantity_match',
        field: 'netQuantity',
        status: isQtyMatch ? COMPLIANCE_STATUS.PASS : COMPLIANCE_STATUS.FAIL,
        mandatory: false,
        message: isQtyMatch
          ? `Net quantity matches verified reference record (${refVal} ${refUnit}).`
          : `Net quantity on pack (${labelVal} ${labelUnit}) does not match registered reference record (${refVal} ${refUnit}).`,
        evidence: {
          scanned: `${labelVal} ${labelUnit}`,
          registered: `${refVal} ${refUnit}`,
          productBarcode: product.barcode,
        },
        sourceRef: `Reference Record: ${product.barcode}`,
      });
    }
  }

  // 2. Brand / Manufacturer Cross-Check
  if (fields.manufacturer && product.manufacturer) {
    const scannedText = (fields.manufacturer.rawText || '').toLowerCase();
    const refMfg = (product.manufacturer.name || '').toLowerCase();
    const refBrand = (product.brand || '').toLowerCase();

    const matchesBrand = scannedText.includes(refBrand);
    const matchesMfg = scannedText.includes(refMfg) || refMfg.split(' ').some((word) => word.length > 3 && scannedText.includes(word));

    if (matchesBrand || matchesMfg) {
      checks.push({
        ruleId: 'product_reference.manufacturer_match',
        field: 'manufacturer',
        status: COMPLIANCE_STATUS.PASS,
        mandatory: false,
        message: `Manufacturer corresponds to reference record (${product.manufacturer.name}).`,
        evidence: {
          scanned: fields.manufacturer.rawText,
          registered: product.manufacturer.name,
        },
        sourceRef: `Reference Record: ${product.barcode}`,
      });
    }
  }

  return checks;
}

export default evaluateProductCrossCheck;
