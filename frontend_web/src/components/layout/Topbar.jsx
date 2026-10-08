import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  User,
  LogOut,
  Settings,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Badge from '../common/Badge';

/**
 * Topbar Header with page title, search, role badge, and profile dropdown
 */
export const Topbar = ({ onToggleSidebar }) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Derive dynamic page title from pathname
  const getPageTitle = () => {
    const path = location.pathname.split('/').filter(Boolean);
    if (path.length === 0) return 'TrustLabel';

    const lastSegment = path[path.length - 1];
    switch (lastSegment.toLowerCase()) {
      case 'dashboard':
        return 'Overview Dashboard';
      case 'scan':
        return 'Label Compliance Scanner';
      case 'history':
        return 'Scan & Audit History';
      case 'complaints':
        return 'Complaints & Grievances';
      case 'investigations':
        return 'Assigned Investigations';
      case 'users':
        return 'User Management';
      case 'officers':
        return 'Officer Directory';
      case 'settings':
        return 'Settings & Configuration';
      default:
        return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
    }
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/login');
  };

  const getRoleBadgeVariant = () => {
    const r = (role || 'user').toLowerCase();
    if (r === 'admin') return 'error';
    if (r === 'officer') return 'warning';
    return 'primary';
  };

  const getRoleDisplay = () => {
    const r = (role || 'user').toLowerCase();
    if (r === 'admin') return 'System Admin';
    if (r === 'officer') return 'Enforcement Officer';
    return 'Consumer';
  };

  return (
    <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-border h-16 flex items-center justify-between px-4 sm:px-6">
      {/* Left: Mobile Menu Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg text-neutral-600 hover:bg-surface-muted hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <Link to="/" className="flex md:hidden items-center gap-1.5 mr-2">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center text-white">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </Link>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight leading-tight">
              {getPageTitle()}
            </h1>
          </div>
        </div>
      </div>

      {/* Right: Search, Role Badge, and Profile Dropdown */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search Bar */}
        <div className="hidden lg:flex items-center relative w-64">
          <Search className="absolute left-3 h-4 w-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search records, rules..."
            className="w-full pl-9 pr-12 py-1.5 text-xs rounded-lg border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
          <kbd className="absolute right-2.5 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-400 bg-surface-muted border border-border rounded">
            ⌘K
          </kbd>
        </div>

        {/* Role Badge */}
        <div className="hidden sm:block">
          <Badge variant={getRoleBadgeVariant()} size="md" dot>
            {getRoleDisplay()}
          </Badge>
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surface-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <div className="h-8 w-8 rounded-lg bg-primary-50 border border-primary-200 text-primary-700 flex items-center justify-center font-bold text-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-neutral-800 leading-tight">
                {user?.name || 'User'}
              </span>
              <span className="text-[11px] text-neutral-500 truncate max-w-[120px]">
                {user?.email || 'user@test.com'}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-neutral-400 hidden md:block" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-surface rounded-xl shadow-float border border-border py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3.5 py-2.5 border-b border-border">
                <p className="text-xs font-semibold text-neutral-900">{user?.name || 'User'}</p>
                <p className="text-[11px] text-neutral-500 truncate">{user?.email || 'user@test.com'}</p>
                <div className="mt-1.5 sm:hidden">
                  <Badge variant={getRoleBadgeVariant()} size="sm" dot>
                    {getRoleDisplay()}
                  </Badge>
                </div>
              </div>

              <div className="py-1">
                <Link
                  to={`/app/${role || 'user'}/settings`}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-neutral-700 hover:bg-surface-muted transition-colors"
                >
                  <Settings className="h-4 w-4 text-neutral-400" />
                  <span>Account Settings</span>
                </Link>
              </div>

              <div className="border-t border-border pt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-error-600 hover:bg-error-50 transition-colors text-left"
                >
                  <LogOut className="h-4 w-4 text-error-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
