import React, { useState, useEffect, useRef } from 'react';
import {
  UserCheck,
  Search,
  Plus,
  Briefcase,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Calendar,
  RotateCcw,
  Inbox,
  FileText,
  BadgeAlert,
  AlertCircle,
} from 'lucide-react';
import adminService from '../../services/admin';
import complaintsService from '../../services/complaints';
import { useToast } from '../../components/common/Toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { ComplaintStatusBadge } from '../../components/complaints';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/common/Table';
import { SkeletonTable } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

export const AdminOfficersPage = () => {
  const toast = useToast();

  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Officer Detail Modal
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [officerComplaints, setOfficerComplaints] = useState([]);
  const [loadingOfficerComplaints, setLoadingOfficerComplaints] = useState(false);

  // Add Officer Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newOfficerData, setNewOfficerData] = useState({
    name: '',
    email: '',
    temporaryPassword: '',
    badgeNumber: '',
    jurisdiction: 'State Legal Metrology Cell - North Division',
    phone: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [creating, setCreating] = useState(false);

  const searchTimerRef = useRef(null);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);

    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(val);
    }, 250);
  };

  const fetchOfficers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getOfficers({ search: debouncedSearch });
      setOfficers(res.officers || []);
    } catch (err) {
      console.error('Failed to load officers', err);
      setError('Unable to load enforcement officers directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficers();
  }, [debouncedSearch]);

  const handleRowClick = async (officer) => {
    setSelectedOfficer(officer);
    setLoadingOfficerComplaints(true);
    try {
      const res = await complaintsService.getAssignedComplaints(officer.id);
      setOfficerComplaints(res.complaints || []);
    } catch {
      setOfficerComplaints([]);
    } finally {
      setLoadingOfficerComplaints(false);
    }
  };

  const handleCreateOfficer = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!newOfficerData.name.trim()) errs.name = 'Officer full name is required.';
    if (!newOfficerData.email.trim() || !newOfficerData.email.includes('@')) errs.email = 'Valid email is required.';
    if (!newOfficerData.badgeNumber.trim()) errs.badgeNumber = 'Statutory badge number is required.';
    if (!newOfficerData.temporaryPassword || newOfficerData.temporaryPassword.length < 6) {
      errs.temporaryPassword = 'Password must be at least 6 characters.';
    }

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    setCreating(true);
    try {
      const created = await adminService.createOfficer(newOfficerData);
      toast.success(
        `Inspector ${created.name} registered with badge ${created.badgeNumber}.`,
        'Officer Enrolled'
      );
      setAddModalOpen(false);
      setNewOfficerData({
        name: '',
        email: '',
        temporaryPassword: '',
        badgeNumber: '',
        jurisdiction: 'State Legal Metrology Cell - North Division',
        phone: '',
      });
      fetchOfficers();
    } catch (err) {
      toast.error(err.message || 'Failed to create officer', 'Error');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Enforcement Officers & Inspectors Directory
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Manage authorized state Legal Metrology inspectors, monitor active case workloads, and enroll field staff.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => setAddModalOpen(true)}
          className="font-bold shadow-md"
        >
          Add Enforcement Officer
        </Button>
      </div>

      {/* ─── Search Bar ─── */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by inspector name, badge, jurisdiction..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-surface text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors shadow-2xs"
          />
        </div>
      </div>

      {/* ─── Officers Table ─── */}
      <Card className="p-0 overflow-hidden shadow-card">
        {loading ? (
          <div className="p-6">
            <SkeletonTable rows={5} cols={6} />
          </div>
        ) : error ? (
          <div className="p-6">
            <ErrorState
              title="Failed to Load Officers"
              description={error}
              onRetry={fetchOfficers}
            />
          </div>
        ) : officers.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Inbox}
              title="No officers found"
              description="No inspector records matched your search query."
            />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow hover={false}>
                <TableHead>Inspector & Badge</TableHead>
                <TableHead>State Jurisdiction</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Scans Conducted</TableHead>
                <TableHead>Current Workload</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {officers.map((item) => {
                const activeCases = item.activeWorkload ?? 0;
                const completedCases = item.complaintsCompleted ?? 0;

                return (
                  <TableRow
                    key={item.id}
                    onClick={() => handleRowClick(item)}
                    className="cursor-pointer hover:bg-neutral-50/80"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl bg-primary-100 text-primary-800 font-extrabold text-xs flex items-center justify-center shrink-0">
                          {item.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <span className="font-bold text-neutral-900 block leading-tight">
                            {item.name}
                          </span>
                          <span className="font-mono text-[11px] text-primary-700 font-semibold">
                            Badge #{item.badgeNumber}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-neutral-700 max-w-xs">
                      <span className="line-clamp-1">{item.jurisdiction}</span>
                    </TableCell>

                    <TableCell className="text-xs text-neutral-600">
                      <span className="block font-medium">{item.email}</span>
                      <span className="text-[11px] text-neutral-500">{item.phone}</span>
                    </TableCell>

                    <TableCell className="text-xs font-semibold text-neutral-800">
                      {item.totalScansDone} Field Scans
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-neutral-700">
                            {activeCases} Active Cases
                          </span>
                          <span className="text-emerald-700 font-medium">
                            {completedCases} Done
                          </span>
                        </div>
                        {/* Workload Progress Bar */}
                        <div className="w-28 h-2 bg-neutral-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              activeCases > 3 ? 'bg-amber-500' : 'bg-primary-600'
                            }`}
                            style={{
                              width: `${Math.min(100, Math.max(15, activeCases * 25))}%`,
                            }}
                          />
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRowClick(item)}
                        className="text-primary-700 font-semibold text-xs"
                      >
                        Inspect Cases
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* ─── Add Officer Modal ─── */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Enroll Enforcement Officer"
        description="Register an authorized state Legal Metrology field inspector."
        size="md"
      >
        <form onSubmit={handleCreateOfficer} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Officer Full Name <span className="text-error-600">*</span>
            </label>
            <input
              type="text"
              value={newOfficerData.name}
              onChange={(e) => setNewOfficerData({ ...newOfficerData, name: e.target.value })}
              placeholder="e.g., Insp. Vikramaditya Singh"
              className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-surface text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {formErrors.name && <p className="text-xs text-error-600 mt-1">{formErrors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Official Email <span className="text-error-600">*</span>
              </label>
              <input
                type="email"
                value={newOfficerData.email}
                onChange={(e) => setNewOfficerData({ ...newOfficerData, email: e.target.value })}
                placeholder="officer@legalmetrology.gov.in"
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-surface text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {formErrors.email && <p className="text-xs text-error-600 mt-1">{formErrors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Statutory Badge ID <span className="text-error-600">*</span>
              </label>
              <input
                type="text"
                value={newOfficerData.badgeNumber}
                onChange={(e) => setNewOfficerData({ ...newOfficerData, badgeNumber: e.target.value })}
                placeholder="e.g., LM-DEL-922"
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-surface text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
              />
              {formErrors.badgeNumber && <p className="text-xs text-error-600 mt-1">{formErrors.badgeNumber}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Temporary Password <span className="text-error-600">*</span>
              </label>
              <input
                type="password"
                value={newOfficerData.temporaryPassword}
                onChange={(e) => setNewOfficerData({ ...newOfficerData, temporaryPassword: e.target.value })}
                placeholder="Min 6 characters"
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-surface text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {formErrors.temporaryPassword && (
                <p className="text-xs text-error-600 mt-1">{formErrors.temporaryPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={newOfficerData.phone}
                onChange={(e) => setNewOfficerData({ ...newOfficerData, phone: e.target.value })}
                placeholder="+91 98111 00000"
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-surface text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Assigned Legal Jurisdiction
            </label>
            <input
              type="text"
              value={newOfficerData.jurisdiction}
              onChange={(e) => setNewOfficerData({ ...newOfficerData, jurisdiction: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-surface text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="pt-2 border-t border-border flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => setAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={creating}
              className="font-bold shadow-md"
            >
              Enroll Inspector
            </Button>
          </div>
        </form>
      </Modal>

      {/* ─── Officer Detail Modal / Drawer ─── */}
      <Modal
        isOpen={Boolean(selectedOfficer)}
        onClose={() => setSelectedOfficer(null)}
        title={selectedOfficer ? `${selectedOfficer.name}'s Enforcement Profile` : 'Officer Details'}
        description={`Badge Number: ${selectedOfficer?.badgeNumber}`}
        size="lg"
      >
        {selectedOfficer && (
          <div className="space-y-5">
            {/* Metas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-surface-muted border border-border text-xs">
              <div>
                <span className="text-neutral-400 font-medium block">Jurisdiction:</span>
                <span className="font-bold text-neutral-900 mt-0.5 block truncate">
                  {selectedOfficer.jurisdiction}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 font-medium block">Email:</span>
                <span className="font-bold text-neutral-900 mt-0.5 block truncate">
                  {selectedOfficer.email}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 font-medium block">Active Cases:</span>
                <span className="font-bold text-amber-700 mt-0.5 block">
                  {selectedOfficer.activeWorkload || 0} Cases
                </span>
              </div>
              <div>
                <span className="text-neutral-400 font-medium block">Completed Audits:</span>
                <span className="font-bold text-emerald-700 mt-0.5 block">
                  {selectedOfficer.complaintsCompleted || 0} Resolved
                </span>
              </div>
            </div>

            {/* Complaints assigned to this Officer */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-primary-600" />
                <span>Assigned Grievances Queue ({officerComplaints.length})</span>
              </h4>

              {loadingOfficerComplaints ? (
                <div className="py-6 text-center text-xs text-neutral-400">Loading cases...</div>
              ) : officerComplaints.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-border text-center text-xs text-neutral-400">
                  No grievances assigned to this inspector currently.
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {officerComplaints.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 rounded-xl border border-border bg-surface flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-primary-700">{c.id}</span>
                          <span className="font-bold text-neutral-900 truncate max-w-xs">{c.title}</span>
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          Product: {c.productName} • Location: {c.storeOrLocation}
                        </p>
                      </div>
                      <ComplaintStatusBadge status={c.status} size="sm" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-border flex justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedOfficer(null)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminOfficersPage;
