import api from './api';

export const complaintsService = {
  /**
   * Submit a new Legal Metrology non-compliance grievance/complaint
   * @param {FormData|Object} data
   */
  async createComplaint(data) {
    const isFormData = data instanceof FormData;
    const response = await api.post('/api/complaints', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },

  /**
   * Get complaints list with role-aware filters
   * @param {Object} [params]
   */
  async getComplaints(params = {}) {
    const response = await api.get('/api/complaints', { params });
    return response.data;
  },

  /**
   * Get single complaint report details
   * @param {string} id
   */
  async getComplaintById(id) {
    const response = await api.get(`/api/complaints/${id}`);
    return response.data;
  },

  /**
   * Officer/Admin action: Update complaint status (e.g., UNDER_REVIEW, NOTICE_ISSUED, RESOLVED, REJECTED)
   * @param {string} id
   * @param {{ status: string, notes?: string, actionTaken?: string }} updateData
   */
  async updateStatus(id, updateData) {
    const response = await api.patch(`/api/complaints/${id}/status`, updateData);
    return response.data;
  },
};

export default complaintsService;
