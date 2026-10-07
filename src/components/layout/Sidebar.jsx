import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ShieldCheck, X } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { getNavItemsForRole } from './navConfig';
import Badge from '../common/Badge';

/**
 * Responsive Sidebar Navigation
 * Desktop: Fixed left navigation
 * Tablet/Mobile: Collapsible slide-over drawer
 */
export const Sidebar = ({ isOpen, onClose, menuConfig }) => {
  const { role } = useAuth();
  const navItems = menuConfig || getNavItemsForRole(role);

  const getRoleLabel = () => {
    const r = (role || 'user').toLowerCase();
    if (r === 'admin') return 'Admin Console';
    if (r === 'officer') return 'Officer Portal';
    return 'Consumer Hub';
  };

  const linkClass = ({ isActive }) =>
    `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
      isActive
        ? 'bg-primary-50 text-primary-700 font-semibold shadow-2xs border border-primary-100'
        : 'text-neutral-600 hover:bg-surface-muted hover:text-neutral-900 border border-transparent'
    }`;

  return (
    <>
      {/* Tablet/Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`
          fixed md:sticky top-0 z-50 md:z-0 h-screen md:h-[calc(100vh-4rem)]
          w-64 bg-surface border-r border-border p-4 flex flex-col justify-between
          transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="space-y-6">
          {/* Logo & Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border/80">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight text-neutral-900 flex items-center">
                  Trust<span className="text-primary-600">Label</span>
                </span>
              </div>
            </Link>

            {/* Close button for mobile drawer */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-surface-muted md:hidden"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Role Header */}
          <div className="px-2 flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              {getRoleLabel()}
            </span>
            <Badge variant="neutral" size="sm">
              v1.0
            </Badge>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => onClose && onClose()}
                  className={linkClass}
                >
                  <Icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Legal Metrology Footer Card */}
        <div className="p-3 bg-surface-muted rounded-xl border border-border/80">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800">
            <ShieldCheck className="h-3.5 w-3.5 text-primary-600" />
            <span>PCR 2011 Compliant</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Legal Metrology (Packaged Commodities) Rules
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
