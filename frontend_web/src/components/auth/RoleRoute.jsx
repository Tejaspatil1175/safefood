import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * Route guard that checks if the logged in user has the required role
 * @param {string[]} allowedRoles e.g. ['user'], ['officer'], ['admin']
 */
export const RoleRoute = ({ allowedRoles = [] }) => {
  const { user, role, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" message="Checking permissions..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const currentRole = (role || user?.role || 'user').toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map((r) => r.toLowerCase());

  if (!normalizedAllowedRoles.includes(currentRole)) {
    // If logged in user visits wrong panel, send to Access Denied
    return <Navigate to="/access-denied" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
