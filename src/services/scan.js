import api from './api';

export const scanService = {
  /**
   * Upload and analyze a product label image for Legal Metrology compliance
   * @param {FormData} formData - Contains image file and optional metadata
   */
  async analyzeLabel(formData) {
    const response = await api.post('/api/scans/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Fetch scan history for the authenticated user / officer
   * @param {Object} [params] - Query pagination/filters
   */
  async getScanHistory(params = {}) {
    const response = await api.get('/api/scans', { params });
    return response.data;
  },

  /**
   * Get full details and compliance audit report for a specific scan ID
   * @param {string} scanId
   */
  async getScanById(scanId) {
    const response = await api.get(`/api/scans/${scanId}`);
    return response.data;
  },

  /**
   * Verify or re-run compliance checks on a previously stored scan
   * @param {string} scanId
   */
  async reevaluateScan(scanId) {
    const response = await api.post(`/api/scans/${scanId}/reevaluate`);
    return response.data;
  },
};

export default scanService;
