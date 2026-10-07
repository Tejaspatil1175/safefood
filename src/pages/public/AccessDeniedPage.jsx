import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LayoutDashboard } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

export const AccessDeniedPage = () => {
  const { role, user } = useAuth();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    const r = (role || user?.role || 'user').toLowerCase();
    if (r === 'admin') return '/app/admin/dashboard';
    if (r === 'officer') return '/app/officer/dashboard';
    return '/app/user/dashboard';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 text-center">
      <Card className="max-w-md w-full p-8 flex flex-col items-center shadow-float">
        <div className="h-16 w-16 rounded-2xl bg-error-100 text-error-600 border border-error-200 flex items-center justify-center mb-5">
          <ShieldAlert className="h-8 w-8" aria-hidden="true" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-error-600 bg-error-50 border border-error-200 px-3 py-1 rounded-full mb-3">
          403 Access Denied
        </span>

        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
          Restricted Area
        </h1>

        <p className="text-sm text-neutral-600 mt-2 mb-6">
          You do not have the required permissions for this role-based panel. You are currently authenticated as{' '}
          <strong className="text-neutral-900 capitalize">{role || 'user'}</strong>.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            onClick={() => navigate(-1)}
            variant="secondary"
            icon={ArrowLeft}
            className="flex-1"
          >
            Go Back
          </Button>

          <Link to={getDashboardPath()} className="flex-1">
            <Button variant="primary" icon={LayoutDashboard} className="w-full">
              Your Dashboard
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default AccessDeniedPage;
