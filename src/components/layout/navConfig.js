import {
  LayoutDashboard,
  ScanLine,
  FileCheck2,
  AlertTriangle,
  Users,
  ShieldCheck,
  Settings,
  FolderKanban,
  UserCheck,
} from 'lucide-react';

/**
 * Navigation items configuration grouped by role
 */
export const ROLE_NAVIGATION = {
  user: [
    {
      label: 'Dashboard',
      to: '/app/user/dashboard',
      icon: LayoutDashboard,
      description: 'Overview and quick actions',
    },
    {
      label: 'Scan Label',
      to: '/app/user/scan',
      icon: ScanLine,
      description: 'OCR & Legal Metrology check',
    },
    {
      label: 'My History',
      to: '/app/user/history',
      icon: FileCheck2,
      description: 'Past verified labels',
    },
    {
      label: 'My Complaints',
      to: '/app/user/complaints',
      icon: AlertTriangle,
      description: 'Grievances & violation reports',
    },
    {
      label: 'Settings',
      to: '/app/user/settings',
      icon: Settings,
      description: 'Preferences and account',
    },
  ],

  officer: [
    {
      label: 'Dashboard',
      to: '/app/officer/dashboard',
      icon: LayoutDashboard,
      description: 'Enforcement metrics and alerts',
    },
    {
      label: 'Scan Label',
      to: '/app/officer/scan',
      icon: ScanLine,
      description: 'Field inspection scan',
    },
    {
      label: 'Scan History',
      to: '/app/officer/history',
      icon: FileCheck2,
      description: 'Historical field audits',
    },
    {
      label: 'Assigned Investigations',
      to: '/app/officer/investigations',
      icon: FolderKanban,
      description: 'Citizen grievances queue',
    },
    {
      label: 'Settings',
      to: '/app/officer/settings',
      icon: Settings,
      description: 'Jurisdiction & profile',
    },
  ],

  admin: [
    {
      label: 'Dashboard',
      to: '/app/admin/dashboard',
      icon: LayoutDashboard,
      description: 'System overview & compliance metrics',
    },
    {
      label: 'Users',
      to: '/app/admin/users',
      icon: Users,
      description: 'Manage consumer accounts',
    },
    {
      label: 'Officers',
      to: '/app/admin/officers',
      icon: UserCheck,
      description: 'Enforcement officers directory',
    },
    {
      label: 'Complaints',
      to: '/app/admin/complaints',
      icon: AlertTriangle,
      description: 'System-wide grievances',
    },
    {
      label: 'Settings',
      to: '/app/admin/settings',
      icon: Settings,
      description: 'PCR rules & platform config',
    },
  ],
};

/**
 * Returns navigation items for a given role (case-insensitive)
 */
export const getNavItemsForRole = (role) => {
  const normalized = (role || 'user').toLowerCase();
  return ROLE_NAVIGATION[normalized] || ROLE_NAVIGATION.user;
};

export default ROLE_NAVIGATION;
