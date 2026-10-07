import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut, User, Menu } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { formatRoleLabel } from '../../utils/formatters';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, role, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md border-b border-border h-16 flex items-center px-4 md:px-6 justify-between">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg text-neutral-600 hover:bg-surface-muted focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-neutral-900 flex items-center gap-1.5">
              Trust<span className="text-primary-600">Label</span>
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-medium text-neutral-800">{user?.name || user?.email || 'User'}</span>
              <span className="text-xs text-neutral-500 font-medium">{formatRoleLabel(role)}</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary-50 text-primary-700 border border-primary-200 flex items-center justify-center font-semibold text-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-neutral-500 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors ml-1"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-sm font-medium text-neutral-700 hover:text-primary px-3 py-1.5 rounded-lg hover:bg-surface-muted transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium bg-primary text-white hover:bg-primary-700 px-3.5 py-1.5 rounded-lg transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
