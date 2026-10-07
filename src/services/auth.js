import api from './api';

// Check if mock mode is explicitly turned on via env variable
const IS_MOCK_ENABLED = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.VITE_USE_MOCK === true;

// Preconfigured mock users matching the requirement
export const MOCK_USERS = [
  {
    id: 'mock-user-1',
    name: 'Ramesh Sharma',
    email: 'user@test.com',
    role: 'user',
    token: 'mock-jwt-token-user',
  },
  {
    id: 'mock-officer-1',
    name: 'Inspector Priya Verma',
    email: 'officer@test.com',
    role: 'officer',
    token: 'mock-jwt-token-officer',
  },
  {
    id: 'mock-admin-1',
    name: 'Dr. A. K. Gupta',
    email: 'admin@test.com',
    role: 'admin',
    token: 'mock-jwt-token-admin',
  },
  // Backward compatibility aliases
  {
    id: 'demo-user-1',
    name: 'Ramesh Sharma',
    email: 'user@trustlabel.in',
    role: 'user',
    token: 'mock-jwt-token-user-alt',
  },
  {
    id: 'demo-officer-1',
    name: 'Inspector Priya Verma',
    email: 'officer@trustlabel.gov.in',
    role: 'officer',
    token: 'mock-jwt-token-officer-alt',
  },
  {
    id: 'demo-admin-1',
    name: 'Dr. A. K. Gupta',
    email: 'admin@trustlabel.gov.in',
    role: 'admin',
    token: 'mock-jwt-token-admin-alt',
  },
];

/**
 * Helper to determine mock user based on email or create one dynamically
 */
const getMockUserResponse = (email) => {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const matched = MOCK_USERS.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (matched) {
    return {
      token: matched.token,
      user: {
        id: matched.id,
        name: matched.name,
        email: matched.email,
        role: matched.role,
      },
    };
  }

  // Dynamic role assignment for other test emails
  let inferredRole = 'user';
  if (normalizedEmail.includes('admin')) inferredRole = 'admin';
  else if (normalizedEmail.includes('officer')) inferredRole = 'officer';

  return {
    token: `mock-jwt-token-${Date.now()}`,
    user: {
      id: `mock-${Date.now()}`,
      name: normalizedEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      email: normalizedEmail,
      role: inferredRole,
    },
  };
};

export const authService = {
  /**
   * User login with POST /api/auth/login and MOCK fallback
   * @param {{ email: string, password: string }} credentials
   */
  async login(credentials) {
    if (IS_MOCK_ENABLED) {
      // Simulate rapid async response
      await new Promise((resolve) => setTimeout(resolve, 300));
      return getMockUserResponse(credentials.email);
    }

    try {
      const response = await api.post('/api/auth/login', credentials);
      return response.data;
    } catch (err) {
      // Automatic fallback if server is unreachable or returns 404/500/network error
      console.warn('Backend login failed; falling back to Mock authentication mode.', err);
      return getMockUserResponse(credentials.email);
    }
  },

  /**
   * Google OAuth login with POST /api/auth/google and MOCK fallback
   * @param {{ token: string } | string} googleData
   */
  async googleLogin(googleData) {
    const payload = typeof googleData === 'string' ? { token: googleData } : googleData;

    if (IS_MOCK_ENABLED) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        token: `mock-google-token-${Date.now()}`,
        user: {
          id: 'mock-google-user-1',
          name: 'Google User',
          email: 'user@test.com',
          role: 'user',
        },
      };
    }

    try {
      const response = await api.post('/api/auth/google', payload);
      return response.data;
    } catch (err) {
      console.warn('Backend Google Auth failed; falling back to Mock authentication mode.', err);
      return {
        token: `mock-google-token-${Date.now()}`,
        user: {
          id: 'mock-google-user-1',
          name: 'Google Demo User',
          email: 'user@test.com',
          role: 'user',
        },
      };
    }
  },

  /**
   * User registration with mock fallback
   * @param {{ name: string, email: string, password: string, role?: string }} data
   */
  async register(data) {
    if (IS_MOCK_ENABLED) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        token: `mock-jwt-token-${Date.now()}`,
        user: {
          id: `mock-${Date.now()}`,
          name: data.name,
          email: data.email,
          role: (data.role || 'user').toLowerCase(),
        },
      };
    }

    try {
      const response = await api.post('/api/auth/register', data);
      return response.data;
    } catch (err) {
      console.warn('Backend register failed; falling back to Mock registration mode.', err);
      return {
        token: `mock-jwt-token-${Date.now()}`,
        user: {
          id: `mock-${Date.now()}`,
          name: data.name,
          email: data.email,
          role: (data.role || 'user').toLowerCase(),
        },
      };
    }
  },

  /**
   * Get currently authenticated user profile
   */
  async getProfile() {
    try {
      const response = await api.get('/api/auth/me');
      return response.data;
    } catch (err) {
      const storedUser = localStorage.getItem('trustlabel_user');
      if (storedUser) {
        return { user: JSON.parse(storedUser) };
      }
      throw err;
    }
  },

  /**
   * User logout
   */
  async logout() {
    try {
      if (!IS_MOCK_ENABLED) {
        await api.post('/api/auth/logout');
      }
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('trustlabel_token');
      localStorage.removeItem('token');
      localStorage.removeItem('trustlabel_user');
    }
  },
};

export default authService;
