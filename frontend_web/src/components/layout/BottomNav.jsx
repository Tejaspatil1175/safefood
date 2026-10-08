import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { getNavItemsForRole } from './navConfig';

/**
 * Mobile Bottom Navigation Bar
 */
export const BottomNav = ({ menuConfig }) => {
  const { role } = useAuth();
  const navItems = menuConfig || getNavItemsForRole(role);

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border px-2 py-1.5 flex items-center justify-around shadow-float"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors text-[10px] font-medium gap-1 ${
                isActive
                  ? 'text-primary font-bold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate max-w-[60px]">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default BottomNav;
