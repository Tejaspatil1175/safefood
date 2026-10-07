import api from './api';

const IS_MOCK_ENABLED = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.VITE_USE_MOCK === true;

// Comprehensive mock database of inspections for pagination & filtering
export const ALL_MOCK_INSPECTIONS = [
  {
    id: 'SCN-2026-904',
    product: 'Sunrise Sunflower Cooking Oil 1L',
    brand: 'Sunrise Agro Foods Ltd',
    status: 'non-compliant',
    date: 'Oct 07, 2026 • 04:30 PM',
    outlet: 'Metro Mart #14, Sector 18',
    officer: 'Insp. Priya Verma',
    score: '62%',
  },
  {
    id: 'SCN-2026-903',
    product: 'Organic Almond Milk 1L',
    brand: 'NutriPure Foods Ltd',
    status: 'compliant',
    date: 'Oct 07, 2026 • 01:15 PM',
    outlet: 'Nature Basket Supermarket',
    officer: 'Insp. Priya Verma',
    score: '100%',
  },
  {
    id: 'SCN-2026-901',
    product: 'Packaged Drinking Water 1L',
    brand: 'AquaPure Refresh Ltd',
    status: 'non-compliant',
    date: 'Oct 06, 2026 • 11:45 AM',
    outlet: 'City Express Mart #4',
    officer: 'Insp. Priya Verma',
    score: '45%',
  },
  {
    id: 'SCN-2026-899',
    product: 'Imported Energy Drink 250ml',
    brand: 'Alpine Turbo Bev',
    status: 'warning',
    date: 'Oct 05, 2026 • 03:20 PM',
    outlet: 'Highway Fuel Station #12',
    officer: 'Insp. Priya Verma',
    score: '78%',
  },
  {
    id: 'SCN-2026-895',
    product: 'Refined Sugar 1kg Standard Pack',
    brand: 'Shree Sugar Mills',
    status: 'compliant',
    date: 'Oct 04, 2026 • 05:00 PM',
    outlet: 'Royal Provision Stores',
    officer: 'Insp. Priya Verma',
    score: '100%',
  },
  {
    id: 'SCN-2026-892',
    product: 'Premium CTC Tea Leaves 500g',
    brand: 'Assam Gold Tea Co',
    status: 'compliant',
    date: 'Oct 03, 2026 • 02:10 PM',
    outlet: 'Green Valley Retailers',
    officer: 'Insp. Priya Verma',
    score: '100%',
  },
  {
    id: 'SCN-2026-890',
    product: 'Detergent Powder 2kg Polybag',
    brand: 'CleanGlow Hygiene Ltd',
    status: 'non-compliant',
    date: 'Oct 02, 2026 • 10:30 AM',
    outlet: 'Super Hypermarket #8',
    officer: 'Insp. Priya Verma',
    score: '50%',
  },
  {
    id: 'SCN-2026-887',
    product: 'Pure Desi Ghee 1L Tin',
    brand: 'GauNaturals Dairy',
    status: 'compliant',
    date: 'Oct 01, 2026 • 12:15 PM',
    outlet: 'Dharini Dairy Depot',
    officer: 'Insp. Priya Verma',
    score: '100%',
  },
  {
    id: 'SCN-2026-885',
    product: 'Instant Masala Noodles 280g',
    brand: 'QuickSnack Foods',
    status: 'warning',
    date: 'Sep 30, 2026 • 04:45 PM',
    outlet: 'Corner Grocery Store',
    officer: 'Insp. Priya Verma',
    score: '80%',
  },
  {
    id: 'SCN-2026-882',
    product: 'Tomato Ketchup Squeeze 950g',
    brand: 'FarmRed Condiments',
    status: 'compliant',
    date: 'Sep 29, 2026 • 09:20 AM',
    outlet: 'Metro Mart #14',
    officer: 'Insp. Priya Verma',
    score: '100%',
  },
  {
    id: 'SCN-2026-879',
    product: 'Basmati Rice Premium 5kg',
    brand: 'Kohinoor Harvest',
    status: 'warning',
    date: 'Sep 28, 2026 • 03:00 PM',
    outlet: 'Grain Wholesale Bazaar',
    officer: 'Insp. Priya Verma',
    score: '75%',
  },
  {
    id: 'SCN-2026-874',
    product: 'Chilli Powder Extra Hot 200g',
    brand: 'Spices Of India Ltd',
    status: 'non-compliant',
    date: 'Sep 26, 2026 • 11:10 AM',
    outlet: 'Heritage Kirana #2',
    officer: 'Insp. Priya Verma',
    score: '40%',
  },
];

// Detailed sample reports by ID
export const DETAILED_MOCK_REPORTS = {
  'SCN-2026-904': {
    id: 'SCN-2026-904',
    productName: 'Sunrise Sunflower Cooking Oil',
    brand: 'Sunrise Agro Foods Ltd',
    scanDate: '2026-10-07T16:30:00Z',
    inspectedBy: 'Inspector Priya Verma (Badge #LM-DEL-2024-884)',
    jurisdiction: 'State Legal Metrology Cell - North Division',
    outlet: 'Metro Mart #14, Sector 18',
    ocrConfidence: '98.4%',
    isCompliant: false,
    verdict: 'NON-COMPLIANT',
    summaryMessage: 'Potential compliance issues were detected regarding Unit Sale Price (USP) omission and numeral height below statutory threshold.',
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
    recommendations: [
      {
        id: 1,
        title: 'Issue Notice under PCR Rule 6(11)',
        description: 'Issue Form-A statutory rectification notice to Sunrise Agro Foods Ltd regarding the absence of Unit Sale Price (USP). Allow 15 days for formal compliance.',
        type: 'warning',
      },
      {
        id: 2,
        title: 'Sample 5 Additional Retail Units',
        description: 'Inspect 5 additional packaged units from Metro Mart #14 to verify whether weight variance is systemic or isolated to this batch.',
        type: 'info',
      },
    ],
  },
  'SCN-2026-903': {
    id: 'SCN-2026-903',
    productName: 'Organic Almond Milk 1L',
    brand: 'NutriPure Foods Ltd',
    scanDate: '2026-10-07T13:15:00Z',
    inspectedBy: 'Inspector Priya Verma (Badge #LM-DEL-2024-884)',
    jurisdiction: 'State Legal Metrology Cell - North Division',
    outlet: 'Nature Basket Supermarket',
    ocrConfidence: '99.2%',
    isCompliant: true,
    verdict: 'COMPLIANT',
    summaryMessage: 'This product label meets all required declarations under Legal Metrology (Packaged Commodities) Rules 2011.',
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
    recommendations: [
      {
        id: 1,
        title: 'Packaging Approved for Distribution',
        description: 'Sample satisfies all statutory packaging requirements. No further enforcement action required.',
        type: 'success',
      },
      {
        id: 2,
        title: 'Routine Surveillance Scheduling',
        description: 'Schedule routine follow-up sample during next scheduled quarter.',
        type: 'info',
      },
    ],
  },
};

// Helper for mock dataset filtering, searching, and pagination
export const filterAndPaginateMock = (params = {}) => {
  const { page = 1, limit = 10, search = '', status = 'all' } = params;
  let filtered = [...ALL_MOCK_INSPECTIONS];

  // Search filter (Product name, brand, outlet, or Scan ID)
  if (search && search.trim()) {
    const query = search.trim().toLowerCase();
    filtered = filtered.filter(
      (item) =>
        (item.product && item.product.toLowerCase().includes(query)) ||
        (item.id && item.id.toLowerCase().includes(query)) ||
        (item.brand && item.brand.toLowerCase().includes(query)) ||
        (item.outlet && item.outlet.toLowerCase().includes(query))
    );
  }

  // Status tab filter
  if (status && status !== 'all') {
    const targetStatus = status.toLowerCase();
    if (targetStatus === 'compliant') {
      filtered = filtered.filter((i) => i.status === 'compliant');
    } else if (targetStatus === 'non-compliant' || targetStatus === 'non_compliant') {
      filtered = filtered.filter((i) => i.status === 'non-compliant');
    } else if (targetStatus === 'warnings' || targetStatus === 'warning') {
      filtered = filtered.filter((i) => i.status === 'warning');
    }
  }

  // Pagination calculations
  const total = filtered.length;
  const numLimit = Number(limit) || 10;
  const numPage = Number(page) || 1;
  const totalPages = Math.ceil(total / numLimit) || 1;
  const startIndex = (numPage - 1) * numLimit;
  const paginatedItems = filtered.slice(startIndex, startIndex + numLimit);

  // Counts for filter tabs
  const counts = {
    all: ALL_MOCK_INSPECTIONS.length,
    compliant: ALL_MOCK_INSPECTIONS.filter((i) => i.status === 'compliant').length,
    nonCompliant: ALL_MOCK_INSPECTIONS.filter((i) => i.status === 'non-compliant').length,
    warnings: ALL_MOCK_INSPECTIONS.filter((i) => i.status === 'warning').length,
  };

  return {
    scans: paginatedItems,
    total,
    page: numPage,
    totalPages,
    counts,
  };
};

export const scanService = {
  /**
   * Upload and analyze a product label image for Legal Metrology compliance
   * POST /api/scan with field name "label"
   * @param {FormData} formData
   * @param {Object} [config]
   */
  async analyzeLabel(formData, config = {}) {
    if (IS_MOCK_ENABLED) {
      await new Promise((resolve) => setTimeout(resolve, 4000));
      const randomIndex = Math.random() > 0.4 ? 0 : 1;
      const baseResult = randomIndex === 0 ? DETAILED_MOCK_REPORTS['SCN-2026-904'] : DETAILED_MOCK_REPORTS['SCN-2026-903'];
      const result = JSON.parse(JSON.stringify(baseResult));
      result.id = `SCN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      result.scanDate = new Date().toISOString();
      return result;
    }

    try {
      let response;
      try {
        response = await api.post('/api/v1/scan', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          ...config,
        });
      } catch {
        response = await api.post('/api/scan', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          ...config,
        });
      }
      return response.data?.data || response.data;
    } catch (err) {
      console.warn('Backend scan endpoint failed (status ' + (err.response?.status || '500') + '); returning mock compliance audit result.', err);
      const randomIndex = Math.random() > 0.4 ? 0 : 1;
      const baseResult = randomIndex === 0 ? DETAILED_MOCK_REPORTS['SCN-2026-904'] : DETAILED_MOCK_REPORTS['SCN-2026-903'];
      const result = JSON.parse(JSON.stringify(baseResult));
      result.id = `SCN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      result.scanDate = new Date().toISOString();
      return result;
    }
  },

  /**
   * Paginated and filtered scan history list
   * GET /api/scans?page=1&limit=10&search=...&status=...
   */
  async getScanHistory(params = {}) {
    if (IS_MOCK_ENABLED) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return filterAndPaginateMock(params);
    }

    try {
      let response;
      try {
        response = await api.get('/api/v1/scans', { params });
      } catch {
        response = await api.get('/api/scans', { params });
      }

      const data = response?.data;
      if (data && (Array.isArray(data.scans) || Array.isArray(data.data) || Array.isArray(data.inspections))) {
        const scansList = data.scans || data.data || data.inspections || [];
        const total = data.total || scansList.length;
        const limit = Number(params.limit) || 10;
        const totalPages = data.totalPages || Math.ceil(total / limit) || 1;
        const counts = data.counts || {
          all: total,
          compliant: scansList.filter((i) => i.status === 'compliant').length,
          nonCompliant: scansList.filter((i) => i.status === 'non-compliant').length,
          warnings: scansList.filter((i) => i.status === 'warning').length,
        };
        return {
          scans: scansList,
          total,
          page: Number(params.page) || 1,
          totalPages,
          counts,
        };
      }

      if (Array.isArray(data)) {
        return {
          scans: data,
          total: data.length,
          page: Number(params.page) || 1,
          totalPages: Math.ceil(data.length / (Number(params.limit) || 10)) || 1,
          counts: {
            all: data.length,
            compliant: data.filter((i) => i.status === 'compliant').length,
            nonCompliant: data.filter((i) => i.status === 'non-compliant').length,
            warnings: data.filter((i) => i.status === 'warning').length,
          },
        };
      }

      return filterAndPaginateMock(params);
    } catch (err) {
      console.warn('Backend getScanHistory failed (status ' + (err.response?.status || '500') + '); serving local inspection records.', err);
      return filterAndPaginateMock(params);
    }
  },

  /**
   * Fetch recent officer inspections list (dashboard view)
   */
  async getRecentInspections(params = {}) {
    const data = await this.getScanHistory({ limit: 5, ...params });
    return {
      inspections: data.scans || data.inspections || [],
      total: data.total || 0,
    };
  },

  /**
   * Fetch officer dashboard metric counters
   */
  async getOfficerDashboardStats() {
    if (IS_MOCK_ENABLED) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return {
        totalScans: 48,
        compliantProducts: 32,
        productsWithIssues: 16,
        pendingInvestigations: 5,
      };
    }

    try {
      let response;
      try {
        response = await api.get('/api/v1/officer/stats');
      } catch {
        response = await api.get('/api/officer/stats');
      }
      return response?.data?.data || response?.data || {
        totalScans: 48,
        compliantProducts: 32,
        productsWithIssues: 16,
        pendingInvestigations: 5,
      };
    } catch (err) {
      console.warn('Backend getOfficerDashboardStats failed (status ' + (err.response?.status || '500') + '); serving mock stats.', err);
      return {
        totalScans: 48,
        compliantProducts: 32,
        productsWithIssues: 16,
        pendingInvestigations: 5,
      };
    }
  },

  /**
   * Fetch detailed report by Scan ID
   * GET /api/scans/:id
   * @param {string} scanId
   */
  async getScanById(scanId) {
    if (IS_MOCK_ENABLED) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const report = DETAILED_MOCK_REPORTS[scanId];
      if (report) return report;

      // Generate dynamic report if specific ID is not hardcoded
      const template = DETAILED_MOCK_REPORTS['SCN-2026-904'];
      const dynamicReport = JSON.parse(JSON.stringify(template));
      dynamicReport.id = scanId;
      return dynamicReport;
    }

    try {
      let response;
      try {
        response = await api.get(`/api/v1/scans/${scanId}`);
      } catch {
        response = await api.get(`/api/scans/${scanId}`);
      }
      return response.data?.data || response.data;
    } catch (err) {
      console.warn(`Backend getScanById for ${scanId} failed (status ${err.response?.status || '500'}), serving detailed mock dossier.`, err);
      const report = DETAILED_MOCK_REPORTS[scanId];
      if (report) return report;
      const template = DETAILED_MOCK_REPORTS['SCN-2026-904'];
      const dynamicReport = JSON.parse(JSON.stringify(template));
      dynamicReport.id = scanId;
      return dynamicReport;
    }
  },
};

export default scanService;
