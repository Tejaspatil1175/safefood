import api from './api';

export const adminService = {
  /**
   * Get overview compliance metrics, violation distributions, and system KPIs
   */
  async getDashboardStats() {
    const response = await api.get('/api/admin/stats');
    return response.data;
  },

  /**
   * Manage and fetch system users (consumers, officers, administrators)
   * @param {Object} [params]
   */
  async getUsers(params = {}) {
    const response = await api.get('/api/admin/users', { params });
    return response.data;
  },

  /**
   * Update user role or verification status
   * @param {string} userId
   * @param {{ role?: string, isActive?: boolean }} data
   */
  async updateUser(userId, data) {
    const response = await api.patch(`/api/admin/users/${userId}`, data);
    return response.data;
  },

  /**
   * Legal Metrology Rule Configuration & Thresholds
   */
  async getComplianceRules() {
    const response = await api.get('/api/admin/compliance-rules');
    return response.data;
  },

  /**
   * Update compliance rule or mandatory declaration fields
   * @param {string} ruleId
   * @param {Object} ruleData
   */
  async updateComplianceRule(ruleId, ruleData) {
    const response = await api.put(`/api/admin/compliance-rules/${ruleId}`, ruleData);
    return response.data;
  },

  /**
   * System audit logs and AI OCR confidence metrics
   */
  async getAuditLogs(params = {}) {
    const response = await api.get('/api/admin/audit-logs', { params });
    return response.data;
  },
};

export default adminService;
