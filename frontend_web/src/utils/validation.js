/**
 * Input validation utilities for TrustLabel
 */

export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  // Validates standard 10-digit Indian / International numbers
  const regex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return regex.test(phone.trim());
};

export const isValidPassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  // Min 8 chars, at least 1 letter and 1 number
  return password.length >= 8 && /\d/.test(password) && /[a-zA-Z]/.test(password);
};

export const validateImageFile = (file, maxSizeMB = 10) => {
  if (!file) return { isValid: false, error: 'No file selected' };
  
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file format. Please upload JPG, PNG, WEBP, or HEIC image.',
    };
  }

  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      isValid: false,
      error: `File size exceeds ${maxSizeMB}MB limit.`,
    };
  }

  return { isValid: true, error: null };
};

/**
 * Legal Metrology Mandatory Declarations Checklist Validator
 */
export const LEGAL_METROLOGY_MANDATORY_FIELDS = [
  { key: 'manufacturerName', label: 'Name and Address of Manufacturer/Packer/Importer' },
  { key: 'genericName', label: 'Common or Generic Name of the Commodity' },
  { key: 'netQuantity', label: 'Net Quantity (Standard Units of Weight/Measure)' },
  { key: 'mrp', label: 'Maximum Retail Price (MRP inclusive of all taxes)' },
  { key: 'manufactureDate', label: 'Month and Year of Manufacture/Packing/Import' },
  { key: 'countryOfOrigin', label: 'Country of Origin (for imported goods)' },
  { key: 'consumerCare', label: 'Consumer Care Contact Details' },
  { key: 'unitSalePrice', label: 'Unit Sale Price (per g/ml/piece)' },
];

export const checkComplianceCompleteness = (extractedFields = {}) => {
  const missing = [];
  const present = [];

  LEGAL_METROLOGY_MANDATORY_FIELDS.forEach((field) => {
    if (extractedFields[field.key] && String(extractedFields[field.key]).trim().length > 0) {
      present.push(field);
    } else {
      missing.push(field);
    }
  });

  const score = Math.round((present.length / LEGAL_METROLOGY_MANDATORY_FIELDS.length) * 100);

  return {
    score,
    isFullyCompliant: missing.length === 0,
    presentFields: present,
    missingFields: missing,
  };
};
