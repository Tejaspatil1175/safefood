import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import { ProtectedRoute, RoleRoute } from './components/auth';
import { DashboardLayout } from './components/layout';

// Public & Auth Pages
import { LandingPage, NotFoundPage, AccessDeniedPage } from './pages/public';
import { LoginPage, RegisterPage } from './pages/auth';

// User / Consumer Pages
import {
  UserDashboardPage,
  UserScanPage,
  UserHistoryPage,
  UserReportPage,
  UserComplaintsPage,
  UserComplaintNewPage,
  UserComplaintDetailPage,
  UserSettingsPage,
} from './pages/user';

// Enforcement Officer Pages
import {
  OfficerDashboardPage,
  OfficerScanPage,
  OfficerHistoryPage,
  OfficerReportPage,
  OfficerInvestigationsPage,
  OfficerInvestigationDetailPage,
  OfficerSettingsPage,
} from './pages/officer';

// System Admin Pages
import {
  AdminDashboardPage,
  AdminUsersPage,
  AdminOfficersPage,
  AdminComplaintsPage,
  AdminSettingsPage,
} from './pages/admin';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/access-denied" element={<AccessDeniedPage />} />

            {/* Authenticated Application Wrapper */}
            <Route element={<ProtectedRoute />}>
              {/* Consumer / User Panel */}
              <Route path="/app/user" element={<RoleRoute allowedRoles={['user']} />}>
                <Route element={<DashboardLayout />}>
                  <Route index element={<Navigate to="/app/user/dashboard" replace />} />
                  <Route path="dashboard" element={<UserDashboardPage />} />
                  <Route path="scan" element={<UserScanPage />} />
                  <Route path="history" element={<UserHistoryPage />} />
                  <Route path="report/:id" element={<UserReportPage />} />
                  <Route path="complaints" element={<UserComplaintsPage />} />
                  <Route path="complaints/new" element={<UserComplaintNewPage />} />
                  <Route path="complaints/:id" element={<UserComplaintDetailPage />} />
                  <Route path="settings" element={<UserSettingsPage />} />
                </Route>
              </Route>

              {/* Enforcement Officer Panel */}
              <Route path="/app/officer" element={<RoleRoute allowedRoles={['officer']} />}>
                <Route element={<DashboardLayout />}>
                  <Route index element={<Navigate to="/app/officer/dashboard" replace />} />
                  <Route path="dashboard" element={<OfficerDashboardPage />} />
                  <Route path="scan" element={<OfficerScanPage />} />
                  <Route path="history" element={<OfficerHistoryPage />} />
                  <Route path="report/:id" element={<OfficerReportPage />} />
                  <Route path="investigations" element={<OfficerInvestigationsPage />} />
                  <Route path="investigations/:id" element={<OfficerInvestigationDetailPage />} />
                  <Route path="settings" element={<OfficerSettingsPage />} />
                </Route>
              </Route>

              {/* System Admin Panel */}
              <Route path="/app/admin" element={<RoleRoute allowedRoles={['admin']} />}>
                <Route element={<DashboardLayout />}>
                  <Route index element={<Navigate to="/app/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                  <Route path="users" element={<AdminUsersPage />} />
                  <Route path="officers" element={<AdminOfficersPage />} />
                  <Route path="complaints" element={<AdminComplaintsPage />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                </Route>
              </Route>

              {/* Root /app redirect helper */}
              <Route path="/app" element={<Navigate to="/login" replace />} />
            </Route>

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
