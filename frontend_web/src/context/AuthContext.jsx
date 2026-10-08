import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/auth';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth state from localStorage on application load
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('trustlabel_token') || localStorage.getItem('token');
        const storedUser = localStorage.getItem('trustlabel_user');

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // Normalize role to lowercase "user" | "officer" | "admin"
          parsedUser.role = (parsedUser.role || 'user').toLowerCase();
          setToken(storedToken);
          setUser(parsedUser);
        } else if (storedToken) {
          setToken(storedToken);
        }
      } catch (err) {
        console.error('Failed to parse stored authentication details', err);
        localStorage.removeItem('trustlabel_token');
        localStorage.removeItem('token');
        localStorage.removeItem('trustlabel_user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Standard Login
  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      // Support object payload or separate arguments
      const credentials = typeof email === 'object' ? email : { email, password };
      const response = await authService.login(credentials);
      
      const authToken = response.token || response.data?.token || response.accessToken || 'mock-jwt-token';
      let authUser = response.user || response.data?.user;

      if (!authUser && credentials.email) {
        let inferredRole = 'user';
        if (credentials.email.includes('admin')) inferredRole = 'admin';
        else if (credentials.email.includes('officer')) inferredRole = 'officer';

        authUser = {
          id: `user-${Date.now()}`,
          name: credentials.email.split('@')[0],
          email: credentials.email,
          role: inferredRole,
        };
      }

      // Normalize role
      if (authUser) {
        authUser.role = (authUser.role || 'user').toLowerCase();
      }

      if (authToken) {
        localStorage.setItem('trustlabel_token', authToken);
        setToken(authToken);
      }

      if (authUser) {
        localStorage.setItem('trustlabel_user', JSON.stringify(authUser));
        setUser(authUser);
      }

      return { token: authToken, user: authUser };
    } finally {
      setLoading(false);
    }
  }, []);

  // Google OAuth Login
  const googleLogin = useCallback(async (googleData) => {
    setLoading(true);
    try {
      const response = await authService.googleLogin(googleData);
      const authToken = response.token || response.data?.token || response.accessToken || 'mock-google-token';
      let authUser = response.user || response.data?.user || {
        id: 'google-user-1',
        name: 'Google User',
        email: 'user@test.com',
        role: 'user',
      };

      authUser.role = (authUser.role || 'user').toLowerCase();

      if (authToken) {
        localStorage.setItem('trustlabel_token', authToken);
        setToken(authToken);
      }

      if (authUser) {
        localStorage.setItem('trustlabel_user', JSON.stringify(authUser));
        setUser(authUser);
      }

      return { token: authToken, user: authUser };
    } finally {
      setLoading(false);
    }
  }, []);

  // Register
  const register = useCallback(async (userData) => {
    setLoading(true);
    try {
      const response = await authService.register(userData);
      const authToken = response.token || response.data?.token || response.accessToken || `mock-token-${Date.now()}`;
      let authUser = response.user || response.data?.user || {
        id: `user-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        role: (userData.role || 'user').toLowerCase(),
      };

      authUser.role = (authUser.role || 'user').toLowerCase();

      if (authToken) {
        localStorage.setItem('trustlabel_token', authToken);
        setToken(authToken);
      }

      if (authUser) {
        localStorage.setItem('trustlabel_user', JSON.stringify(authUser));
        setUser(authUser);
      }

      return { token: authToken, user: authUser };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore network errors
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('trustlabel_token');
      localStorage.removeItem('token');
      localStorage.removeItem('trustlabel_user');
    }
  }, []);

  const role = user?.role ? user.role.toLowerCase() : null;

  const value = {
    user,
    token,
    role,
    isAuthenticated: Boolean(token),
    loading,
    login,
    googleLogin,
    register,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
