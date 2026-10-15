/**
 * SafeFood API Client
 * Connects frontend directly to all backend API endpoints mounted on /api/v1
 */

const API_BASE = typeof window !== 'undefined'
  ? (window.location.port === '3000' ? 'http://localhost:4000/api/v1' : '/api/v1')
  : 'http://localhost:4000/api/v1';

export type ApiResponse<T> = {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any[];
  };
};

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface UserProfile {
  id: string;
  _id?: string;
  email: string;
  name: string;
  role: 'user' | 'officer' | 'admin' | 'district_admin';
  district?: string;
  address?: string;
  state?: string;
  phoneNumber?: string;
  badgeNumber?: string;
  avatar?: string | null;
}

export interface ActiveRuleSet {
  _id: string;
  version: string;
  name: string;
  isActive: boolean;
  rules: Array<{
    id: string;
    field: string;
    type: string;
    mandatory: boolean;
    sourceRef: string;
    message: string;
    keywords?: string[];
  }>;
}

export interface OfficerStats {
  totalScans: number;
  compliantProducts: number;
  productsWithIssues: number;
  pendingInvestigations: number;
}

export interface ScanItemResult {
  id: string;
  _id?: string;
  isCompliant: boolean;
  score: number;
  product?: {
    name?: string;
    brand?: string;
    netQuantity?: { value: number; unit: string };
    manufacturer?: { name: string; address: string };
  };
  productInfo?: {
    productName?: string;
    brand?: string;
    netQuantity?: string;
    mrp?: string;
    expiryDate?: string;
    manufacturer?: string;
    fssaiLicense?: string;
    barcode?: string;
  };
  checklist: Array<{
    label: string;
    status: 'pass' | 'fail' | 'warn';
    detail: string;
    rule: string;
  }>;
  issues: any[];
  createdAt: string;
}

export interface ComplaintItem {
  id: string;
  _id?: string;
  scanId?: string;
  complaintNumber?: string;
  status: string;
  userNote?: string;
  district?: string;
  address?: string;
  productName?: string;
  createdAt: string;
  timeline?: Array<{
    status: string;
    note?: string;
    timestamp: string;
  }>;
  assignedOfficer?: {
    id: string;
    name: string;
    email: string;
  };
}

// Token management in browser localStorage
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('safefood_access_token');
}

export function setAccessToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('safefood_access_token', token);
}

export function clearAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('safefood_access_token');
  localStorage.removeItem('safefood_user');
}

export function getStoredUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('safefood_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredUser(user: UserProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('safefood_user', JSON.stringify(user));
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Do not set Content-Type if sending FormData (browser handles boundary)
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/pdf') || contentType.includes('application/octet-stream')) {
    return (await res.blob()) as unknown as T;
  }

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMsg = json?.error?.message || json?.message || `Request failed with status ${res.status}`;
    const err = new Error(errorMsg);
    (err as any).status = res.status;
    (err as any).details = json?.error?.details || json;
    throw err;
  }

  return json as T;
}

/* ==========================================================================
   1. Health API (/api/v1/health)
   ========================================================================== */
export const healthApi = {
  check: () => request<{ status: string; uptime: number; timestamp: string }>('/health'),
};

/* ==========================================================================
   2. Rules API (/api/v1/rules)
   ========================================================================== */
export const rulesApi = {
  getActive: () => request<ActiveRuleSet>('/rules/active'),
};

/* ==========================================================================
   3. Products API (/api/v1/products)
   ========================================================================== */
export const productsApi = {
  getByBarcode: (barcode: string) => request<any>(`/products/${barcode}`),
};

/* ==========================================================================
   4. Auth API (/api/v1/auth)
   ========================================================================== */
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const result = await request<{ user: UserProfile; accessToken: string; refreshToken?: string; expiresIn?: number }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );
    if (result.accessToken) {
      setAccessToken(result.accessToken);
    }
    if (result.user) {
      setStoredUser(result.user);
    }
    return result;
  },

  register: async (userData: {
    email: string;
    password: string;
    name: string;
    district?: string;
    address?: string;
    state?: string;
    pincode?: string;
    phoneNumber?: string;
    role?: string;
  }) => {
    const result = await request<{ user: UserProfile; accessToken: string; refreshToken?: string }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(userData),
      }
    );
    if (result.accessToken) {
      setAccessToken(result.accessToken);
    }
    if (result.user) {
      setStoredUser(result.user);
    }
    return result;
  },

  googleLogin: async (idToken: string) => {
    const result = await request<{ user: UserProfile; accessToken: string }>(
      '/auth/google',
      {
        method: 'POST',
        body: JSON.stringify({ idToken }),
      }
    );
    if (result.accessToken) {
      setAccessToken(result.accessToken);
    }
    if (result.user) {
      setStoredUser(result.user);
    }
    return result;
  },

  getMe: () => request<UserProfile>('/auth/me'),

  updateProfile: async (data: Partial<UserProfile>) => {
    const updated = await request<UserProfile>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    if (updated) {
      setStoredUser(updated);
    }
    return updated;
  },

  logout: async () => {
    try {
      await request('/auth/logout', { method: 'POST' });
    } finally {
      clearAuth();
    }
  },
};

/* ==========================================================================
   5. Scans API (/api/v1/scans)
   ========================================================================== */
export const scansApi = {
  create: (formData: FormData) =>
    request<ScanItemResult>('/scans', {
      method: 'POST',
      body: formData,
    }),

  list: (params?: { page?: number; limit?: number; verdict?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.verdict) query.set('verdict', params.verdict);
    const qs = query.toString();
    return request<{
      items: ScanItemResult[];
      scans?: ScanItemResult[];
      pagination: { total: number; page: number; limit: number; pages: number };
    }>(`/scans${qs ? `?${qs}` : ''}`);
  },

  getById: (id: string) => request<ScanItemResult>(`/scans/${id}`),
};

/* ==========================================================================
   6. Complaints API (/api/v1/complaints)
   ========================================================================== */
export const complaintsApi = {
  create: (data: FormData | {
    scanId?: string;
    confirmed?: boolean;
    userNote?: string;
    district?: string;
    address?: string;
  }) => {
    const isFormData = data instanceof FormData;
    return request<ComplaintItem>('/complaints', {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
    });
  },

  list: (params?: { page?: number; limit?: number; status?: string; district?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.status) query.set('status', params.status);
    if (params?.district) query.set('district', params.district);
    const qs = query.toString();
    return request<{ complaints: ComplaintItem[]; pagination?: { total: number } } | ComplaintItem[]>(
      `/complaints${qs ? `?${qs}` : ''}`
    );
  },

  getById: (id: string) => request<ComplaintItem>(`/complaints/${id}`),

  updateStatus: (id: string, payload: { status: string; note?: string }) =>
    request<ComplaintItem>(`/complaints/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  assign: (id: string, payload: { officerId: string }) =>
    request<ComplaintItem>(`/complaints/${id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  exportPdf: (id: string) => request<Blob>(`/complaints/${id}/export`),
};

/* ==========================================================================
   7. Officer API (/api/v1/officer)
   ========================================================================== */
export const officerApi = {
  getStats: () => request<OfficerStats>('/officer/stats'),
};

/* ==========================================================================
   8. Districts API (/api/v1/districts)
   ========================================================================== */
export const districtsApi = {
  getOverview: () => request<any>('/districts/overview'),

  listOfficers: () => request<any[]>('/districts/officers'),

  createOfficer: (data: {
    name: string;
    email: string;
    password?: string;
    district: string;
    badgeNumber?: string;
  }) =>
    request<any>('/districts/officers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  listReports: (params?: { status?: string; district?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.district) query.set('district', params.district);
    const qs = query.toString();
    return request<any[]>(`/districts/reports${qs ? `?${qs}` : ''}`);
  },

  getReport: (id: string) => request<any>(`/districts/reports/${id}`),

  reviewReport: (id: string, payload: { action: string; note?: string }) =>
    request<any>(`/districts/reports/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  listAdmins: () => request<any[]>('/districts/admins'),

  createAdmin: (data: {
    name: string;
    email: string;
    password?: string;
    district: string;
  }) =>
    request<any>('/districts/admins', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
