import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Shield,
  Moon,
  Sun,
  Bell,
  Globe,
  Lock,
  LogOut,
  Save,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Card, { CardHeader } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import Modal, { ModalHeader, ModalBody, ModalFooter } from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';

/**
 * Shared SettingsPage reusable across Officer, User, and Admin panels
 */
export const SettingsPage = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // Profile Form State
  const [name, setName] = useState(user?.name || 'Inspector Priya Verma');
  const [email] = useState(user?.email || 'officer@test.com');
  const [jurisdiction, setJurisdiction] = useState(
    role === 'officer'
      ? 'State Legal Metrology Cell - North Division'
      : role === 'admin'
      ? 'National Central Administration'
      : 'General Public Consumer'
  );

  // Preferences State
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState('en');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [violationAlerts, setViolationAlerts] = useState(true);

  // Logout Modal State
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const getRoleLabel = () => {
    const r = (role || 'user').toLowerCase();
    if (r === 'admin') return 'System Administrator';
    if (r === 'officer') return 'Enforcement Officer';
    return 'Consumer User';
  };

  const getRoleBadgeVariant = () => {
    const r = (role || 'user').toLowerCase();
    if (r === 'admin') return 'error';
    if (r === 'officer') return 'warning';
    return 'primary';
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Your profile settings have been updated.', 'Settings Saved');
    }, 400);
  };

  const handleLogout = async () => {
    setLogoutModalOpen(false);
    await logout();
    toast.info('You have been logged out of TrustLabel.', 'Signed Out');
    navigate('/login');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* ─── Header ─── */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
          Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Manage your personal profile, notifications, and application preferences.
        </p>
      </div>

      {/* ─── Section 1: Profile Information ─── */}
      <Card className="p-6 sm:p-8">
        <CardHeader
          title="Profile Information"
          subtitle="Your identity details and role credentials across the platform"
        />

        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Avatar & Role Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b border-border">
            <div className="h-16 w-16 rounded-2xl bg-primary-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
              {name ? name.charAt(0).toUpperCase() : 'U'}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-neutral-900">{name}</h3>
                <Badge variant={getRoleBadgeVariant()} size="sm" dot>
                  {getRoleLabel()}
                </Badge>
              </div>
              <p className="text-xs text-neutral-500">{email}</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              icon={User}
            />

            <Input
              label="Email Address (Read-only)"
              type="email"
              value={email}
              disabled
              helperText="Tied to your authenticated credentials"
              icon={Mail}
            />

            <div className="sm:col-span-2">
              <Input
                label="Department / Assigned Jurisdiction"
                type="text"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                placeholder="e.g. State Legal Metrology Cell"
                icon={Shield}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Save}
              isLoading={isSaving}
            >
              Save Profile
            </Button>
          </div>
        </form>
      </Card>

      {/* ─── Section 2: Application Preferences ─── */}
      <Card className="p-6 sm:p-8">
        <CardHeader
          title="Application Preferences"
          subtitle="Customize interface appearance, language, and compliance alerts"
        />

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Theme Select */}
            <Select
              label="Interface Appearance Theme"
              value={theme}
              onChange={(e) => {
                setTheme(e.target.value);
                toast.info(`Theme preference switched to ${e.target.value}.`, 'Theme Updated');
              }}
              options={[
                { value: 'light', label: 'Light Mode (Default)' },
                { value: 'dark', label: 'Dark Mode (Beta)' },
                { value: 'system', label: 'Match System Theme' },
              ]}
            />

            {/* Language Select */}
            <Select
              label="Preferred Language"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                toast.info(`Language set to ${e.target.value === 'hi' ? 'Hindi' : 'English'}.`, 'Language Updated');
              }}
              options={[
                { value: 'en', label: 'English (India)' },
                { value: 'hi', label: 'Hindi (हिंदी)' },
                { value: 'mr', label: 'Marathi (मराठी)' },
              ]}
            />
          </div>

          {/* Notifications Toggles */}
          <div className="pt-4 border-t border-border space-y-3">
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Statutory Notifications
            </h4>

            {/* Email Alerts Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-surface-subtle">
              <div className="flex items-start gap-3">
                <Bell className="h-4 w-4 text-primary-600 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-neutral-900">Email Notification Digests</p>
                  <p className="text-[11px] text-neutral-500">Receive weekly summaries of statutory label audits and grievances</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="h-4 w-4 text-primary-600 rounded border-border focus:ring-primary-500"
              />
            </div>

            {/* Critical Violation Alerts */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-surface-subtle">
              <div className="flex items-start gap-3">
                <ShieldAlert className="h-4 w-4 text-error-600 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-neutral-900">Critical Non-Compliance Alerts</p>
                  <p className="text-[11px] text-neutral-500">Real-time alerts when high-severity packaging violations are detected</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={violationAlerts}
                onChange={(e) => setViolationAlerts(e.target.checked)}
                className="h-4 w-4 text-primary-600 rounded border-border focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* ─── Section 3: Account & Authentication ─── */}
      <Card className="p-6 sm:p-8 border-error-100">
        <CardHeader
          title="Account & Security"
          subtitle="Manage session security and platform authentication"
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-surface-subtle">
          <div>
            <h4 className="text-sm font-bold text-neutral-900">Sign Out of Session</h4>
            <p className="text-xs text-neutral-500 mt-0.5">
              Safely end your current session and return to the login portal.
            </p>
          </div>

          <Button
            type="button"
            variant="danger"
            size="sm"
            icon={LogOut}
            onClick={() => setLogoutModalOpen(true)}
          >
            Sign Out
          </Button>
        </div>
      </Card>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title="Confirm Sign Out"
        description="Are you sure you want to log out of TrustLabel?"
        size="sm"
      >
        <p className="text-xs text-neutral-600 mb-4">
          You will need to re-authenticate with your credentials to access your dashboard again.
        </p>

        <ModalFooter className="px-0 pb-0 pt-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setLogoutModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={LogOut}
            onClick={handleLogout}
          >
            Confirm Sign Out
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default SettingsPage;
