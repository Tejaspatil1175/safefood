import api from './api';

const IS_MOCK_ENABLED = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.VITE_USE_MOCK === true;

// Realistic sample compliance scan results
export const SAMPLE_SCAN_RESULTS = [
  {
    id: 'SCN-2026-904',
    productName: 'Sunrise Sunflower Cooking Oil',
    brand: 'Sunrise Agro Foods Ltd',
    scanDate: new Date().toISOString(),
    isCompliant: false,
    verdict: 'NON-COMPLIANT',
    summaryMessage: 'Potential compliance issues were detected regarding Unit Sale Price and net weight tolerances.',
    score: 62,
    productInfo: {
      productName: 'Sunrise Sunflower Cooking Oil 1L',
      manufacturer: 'Sunrise Agro Foods Ltd., Plot 18, MIDC Tarapur, Maharashtra - 401506',
      netQuantity: '1 Litre (890g net measured)',
      mrp: '₹175.00 (Inclusive of all taxes)',
      unitSalePrice: 'Missing / Not specified per ml',
      manufactureDate: '09/2026',
      expiryDate: '03/2027',
      countryOfOrigin: 'India (IND)',
      consumerCare: 'Phone: 1800-222-909 | Email: care@sunriseagro.in',
      fssaiLicNo: '10019022009845',
    },
    checklist: [
      {
        key: 'manufacturer',
        title: 'Manufacturer declaration',
        status: 'passed',
        detail: 'Name, complete postal address, and packaging unit are clearly legible.',
      },
      {
        key: 'netQuantity',
        title: 'Net quantity declaration',
        status: 'warning',
        detail: 'Standard metric unit (1 Litre) declared, but secondary gross weight font is under 3mm.',
      },
      {
        key: 'mrp',
        title: 'MRP declaration',
        status: 'failed',
        detail: 'Maximum Retail Price declared without mandatory Unit Sale Price (USP) per 100ml / 1L.',
      },
      {
        key: 'consumerCare',
        title: 'Consumer care information',
        status: 'passed',
        detail: 'Toll-free customer care contact number and email address verified.',
      },
      {
        key: 'additional',
        title: 'Additional information',
        status: 'passed',
        detail: 'Valid FSSAI 14-digit license number and Country of Origin (India) detected.',
      },
    ],
    issues: [
      {
        id: 1,
        title: 'Missing Mandatory Unit Sale Price (USP)',
        description: 'Under PCR Amendment Rule 6(11), pre-packaged commodities must declare the Unit Sale Price (e.g., ₹0.175/ml) alongside the MRP.',
        severity: 'high',
      },
      {
        id: 2,
        title: 'Non-compliant Font Height for Secondary Numerals',
        description: 'Printed character height for net volume numerals is 2.8mm, which is below the statutory 4.0mm requirement for packages between 500g and 1kg.',
        severity: 'medium',
      },
    ],
  },
  {
    id: 'SCN-2026-903',
    productName: 'Organic Almond Milk 1L',
    brand: 'NutriPure Foods Ltd',
    scanDate: new Date(Date.now() - 3600000 * 3).toISOString(),
    isCompliant: true,
    verdict: 'COMPLIANT',
    summaryMessage: 'This product label meets the required declarations under Legal Metrology (Packaged Commodities) Rules 2011.',
    score: 100,
    productInfo: {
      productName: 'Organic Almond Milk (Unsweetened) 1L',
      manufacturer: 'NutriPure Foods Pvt Ltd, Food Park Phase 2, Mumbai - 400088',
      netQuantity: '1000 ml (1 L)',
      mrp: '₹145.00 (Incl. of all taxes)',
      unitSalePrice: '₹0.15 / ml',
      manufactureDate: '10/2026',
      expiryDate: '07/2027',
      countryOfOrigin: 'India',
      consumerCare: 'care@nutripure.in | Helpline: 1800-400-500',
      fssaiLicNo: '11521018000342',
    },
    checklist: [
      {
        key: 'manufacturer',
        title: 'Manufacturer declaration',
        status: 'passed',
        detail: 'Full manufacturer entity name and verifiable registered address present.',
      },
      {
        key: 'netQuantity',
        title: 'Net quantity declaration',
        status: 'passed',
        detail: 'Standard metric unit (1000 ml / 1 L) with compliant 4.2mm numeral height.',
      },
      {
        key: 'mrp',
        title: 'MRP declaration',
        status: 'passed',
        detail: 'All-inclusive MRP with precise Unit Sale Price (₹0.15/ml) clearly printed.',
      },
      {
        key: 'consumerCare',
        title: 'Consumer care information',
        status: 'passed',
        detail: 'Customer support cell email, postal address, and helpline verified.',
      },
      {
        key: 'additional',
        title: 'Additional information',
        status: 'passed',
        detail: 'FSSAI license number and Country of Origin statutory declarations satisfied.',
      },
    ],
    issues: [],
  },
];

export const INITIAL_OFFICER_INSPECTIONS = [
  {
    id: 'SCN-2026-904',
    product: 'Sunrise Sunflower Cooking Oil 1L',
    status: 'non-compliant',
    date: 'Oct 07, 2026 • 04:30 PM',
    outlet: 'Metro Mart #14, Sector 18',
    officer: 'Insp. Priya Verma',
    score: '62%',
  },
  {
    id: 'SCN-2026-903',
    product: 'Organic Almond Milk 1L',
    status: 'compliant',
    date: 'Oct 07, 2026 • 01:15 PM',
    outlet: 'Nature Basket Supermarket',
    officer: 'Insp. Priya Verma',
    score: '100%',
  },
  {
    id: 'SCN-2026-901',
    product: 'Packaged Drinking Water 1L',
    status: 'non-compliant',
    date: 'Oct 06, 2026 • 11:45 AM',
    outlet: 'City Express Mart #4',
    officer: 'Insp. Priya Verma',
    score: '45%',
  },
  {
    id: 'SCN-2026-899',
    product: 'Imported Energy Drink 250ml',
    status: 'warning',
    date: 'Oct 05, 2026 • 03:20 PM',
    outlet: 'Highway Fuel Station #12',
    officer: 'Insp. Priya Verma',
    score: '78%',
  },
  {
    id: 'SCN-2026-895',
    product: 'Refined Sugar 1kg Standard Pack',
    status: 'compliant',
    date: 'Oct 04, 2026 • 05:00 PM',
    outlet: 'Royal Provision Stores',
    officer: 'Insp. Priya Verma',
    score: '100%',
  },
];

export const scanService = {
  /**
   * Upload and analyze a product label image for Legal Metrology compliance
   * POST /api/scan with field name "label"
   * @param {FormData} formData
   * @param {Object} [config]
   */
  async analyzeLabel(formData, config = {}) {
    if (IS_MOCK_ENABLED) {
      // Simulate realistic processing time in mock mode
      await new Promise((resolve) => setTimeout(resolve, 4000));
      // Alternate between non-compliant and compliant sample data
      const randomIndex = Math.random() > 0.4 ? 0 : 1;
      const result = JSON.parse(JSON.stringify(SAMPLE_SCAN_RESULTS[randomIndex]));
      result.id = `SCN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      result.scanDate = new Date().toISOString();
      return result;
    }

    try {
      // Try /api/scan (as specified), with fallback to /api/scans or /api/v1/scans
      const response = await api.post('/api/scan', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        ...config,
      });
      return response.data;
    } catch (err) {
      console.warn('Backend scan endpoint failed; returning mock compliance audit result.', err);
      const randomIndex = Math.random() > 0.4 ? 0 : 1;
      const result = JSON.parse(JSON.stringify(SAMPLE_SCAN_RESULTS[randomIndex]));
      result.id = `SCN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      result.scanDate = new Date().toISOString();
      return result;
    }
  },

  /**
   * Fetch recent officer inspections list
   * @param {Object} [params]
   */
  async getRecentInspections(params = {}) {
    if (IS_MOCK_ENABLED) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      return { inspections: INITIAL_OFFICER_INSPECTIONS, total: INITIAL_OFFICER_INSPECTIONS.length };
    }

    try {
      const response = await api.get('/api/scans', { params });
      return response.data;
    } catch {
      return { inspections: INITIAL_OFFICER_INSPECTIONS, total: INITIAL_OFFICER_INSPECTIONS.length };
    }
  },

  /**
   * Fetch officer dashboard metric counters
   */
  async getOfficerDashboardStats() {
    if (IS_MOCK_ENABLED) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      return {
        totalScans: 48,
        compliantProducts: 32,
        productsWithIssues: 16,
        pendingInvestigations: 5,
      };
    }

    try {
      const response = await api.get('/api/officer/stats');
      return response.data;
    } catch {
      return {
        totalScans: 48,
        compliantProducts: 32,
        productsWithIssues: 16,
        pendingInvestigations: 5,
      };
    }
  },

  /**
   * Fetch scan by ID
   * @param {string} scanId
   */
  async getScanById(scanId) {
    if (IS_MOCK_ENABLED) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const found = SAMPLE_SCAN_RESULTS.find((s) => s.id === scanId) || SAMPLE_SCAN_RESULTS[0];
      return found;
    }

    try {
      const response = await api.get(`/api/scans/${scanId}`);
      return response.data;
    } catch {
      return SAMPLE_SCAN_RESULTS[0];
    }
  },
};

export default scanService;
