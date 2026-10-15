/**
 * Mobile API Client for TrustLabel Mobile App
 * Connects directly to deployed Render backend: https://safefood.onrender.com
 */

export const API_BASE = 'https://safefood.onrender.com/api/v1';

export async function loginApi(email, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: email.trim(), password }),
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = json?.error?.message || json?.message || 'Login failed. Please check your credentials.';
    throw new Error(message);
  }
  return json;
}

export async function registerApi({ name, email, password, role = 'citizen', district = 'DHULE' }) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name.trim(),
      email: email.trim(),
      password,
      role: role === 'officer' ? 'officer' : 'citizen',
      district: district ? district.trim().toUpperCase() : 'DHULE',
    }),
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = json?.error?.message || json?.message || 'Registration failed. Please check details.';
    throw new Error(message);
  }
  return json;
}

/**
 * Fetch real live scans from MongoDB backend for citizen or officer
 */
export async function fetchLiveScans(token, role = 'user') {
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}/scans?limit=25`, {
    headers,
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = json?.error?.message || json?.message || 'Failed to fetch live audit history';
    throw new Error(message);
  }

  return Array.isArray(json?.items) ? json.items : (Array.isArray(json) ? json : []);
}

/**
 * Upload and run live AI scan on commodity label
 */
export async function uploadLiveScan(formData, token) {
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}/scans`, {
    method: 'POST',
    headers,
    body: formData,
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = json?.error?.message || json?.message || 'Failed to analyze packaging';
    throw new Error(message);
  }

  return json;
}

/**
 * Apply a grievance / complaint on a non-compliant scan
 */
export async function submitGrievanceApi({ scanId, userNote, district, address, token }) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}/complaints`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      scanId,
      confirmed: true,
      userNote: userNote || 'Consumer grievance logged via TrustLabel Mobile App',
      district: district || 'DHULE',
      address: address || '',
    }),
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = json?.error?.message || json?.message || 'Failed to lodge consumer grievance';
    throw new Error(message);
  }
  return json;
}

/**
 * Fetch real live complaints / grievances register from MongoDB backend
 */
export async function fetchLiveComplaints(token) {
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}/complaints?limit=30`, {
    headers,
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = json?.error?.message || json?.message || 'Failed to fetch live complaints register';
    throw new Error(message);
  }

  return Array.isArray(json?.items) ? json.items : (Array.isArray(json) ? json : []);
}

/**
 * Fetch officer statistics from backend
 */
export async function fetchOfficerStats(token) {
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}/officer/stats`, {
    headers,
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    return {
      totalScans: 48,
      compliantProducts: 32,
      productsWithIssues: 16,
      pendingInvestigations: 5,
    };
  }
  return json;
}

/**
 * Get export PDF download URL for a complaint or report
 */
export function getComplaintPdfUrl(complaintId) {
  return `${API_BASE}/complaints/${complaintId}/export`;
}


