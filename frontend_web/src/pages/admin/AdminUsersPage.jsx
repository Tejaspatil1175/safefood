import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  Search,
  UserCheck,
  UserX,
  RotateCcw,
  Inbox,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  ScanLine,
  Eye,
  ShieldAlert,
} from 'lucide-react';
import adminService from '../../services/admin';
import complaintsService from '../../services/complaints';
import { useToast } from '../../components/common/Toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import { ComplaintStatusBadge } from '../../components/complaints';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/common/Table';
import { SkeletonTable } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

export const AdminUsersPage = () => {
  const toast = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // User Detail Drawer / Modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [userComplaints, setUserComplaints] = useState([]);
  const [loadingUserComplaints, setLoadingUserComplaints] = useState(false);

  // Status Toggle Confirmation Modal
  const [userToToggle, setUserToToggle] = useState(null);
  const [toggling, setToggling] = useState(false);

  const searchTimerRef = useRef(null);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);

    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(val);
      setCurrentPage(1);
    }, 250);
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getUsers({
        search: debouncedSearch,
        status: statusFilter,
        page: currentPage,
        limit: 8,
      });
      setUsers(res.users || []);
      setTotalPages(res.totalPages || 1);
      setTotalItems(res.total || 0);
    } catch (err) {
      console.error('Failed to load users', err);
      setError('Unable to retrieve user registry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [debouncedSearch, statusFilter, currentPage]);

  const handleRowClick = async (user) => {
    setSelectedUser(user);
    setLoadingUserComplaints(true);
    try {
      const res = await complaintsService.getMyComplaints(user.id);
      setUserComplaints(res.complaints || []);
    } catch {
      setUserComplaints([]);
    } finally {
      setLoadingUserComplaints(false);
    }
  };

  const handleConfirmToggle = async () => {
    if (!userToToggle) return;
    setToggling(true);
    try {
      const updated = await adminService.toggleUserStatus(userToToggle.id);
      toast.success(
        `User ${updated.name} has been ${updated.status === 'Active' ? 'activated' : 'suspended'}.`,
        'User Status Updated'
      );

      // Update in local state
      setUsers((prev) =>
        prev.map((u) => (u.id === updated.id ? { ...u, status: updated.status } : u))
      );
      if (selectedUser?.id === updated.id) {
        setSelectedUser((prev) => ({ ...prev, status: updated.status }));
      }
      setUserToToggle(null);
    } catch (err) {
      toast.error(err.message || 'Failed to update user status', 'Error');
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Registered Consumers Directory
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Manage citizen accounts, audit grievance history, and control portal access permissions.
          </p>
        </div>
      </div>

      {/* ─── Filter & Search ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-surface rounded-xl border border-border shadow-2xs">
          {['all', 'active', 'suspended'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => {
                setStatusFilter(st);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                statusFilter === st
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-surface-muted'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by name, email, or city..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-surface text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors shadow-2xs"
          />
        </div>
      </div>

      {/* ─── Users Table Card ─── */}
      <Card className="p-0 overflow-hidden shadow-card">
        {loading ? (
          <div className="p-6">
            <SkeletonTable rows={6} cols={6} />
          </div>
        ) : error ? (
          <div className="p-6">
            <ErrorState
              title="Failed to Load Users"
              description={error}
              onRetry={fetchUsers}
            />
          </div>
        ) : users.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Inbox}
              title="No users found"
              description="No registered consumer profiles match your search criteria."
            />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow hover={false}>
                  <TableHead>User ID & Name</TableHead>
                  <TableHead>Email & Contact</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((item) => (
                  <TableRow
                    key={item.id}
                    onClick={() => handleRowClick(item)}
                    className="cursor-pointer hover:bg-neutral-50/80"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-800 font-bold text-xs flex items-center justify-center shrink-0">
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-neutral-900 block leading-tight">
                            {item.name}
                          </span>
                          <span className="font-mono text-[11px] text-neutral-400">
                            {item.id} • {item.city}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-neutral-700">
                      <span className="font-medium block">{item.email}</span>
                      <span className="text-[11px] text-neutral-500">{item.phone}</span>
                    </TableCell>

                    <TableCell className="text-xs text-neutral-600 font-medium">
                      {item.joinedAt}
                    </TableCell>

                    <TableCell className="text-xs">
                      <span className="text-neutral-700 font-semibold block">
                        {item.totalScans} Scans
                      </span>
                      <span className="text-amber-700 text-[11px]">
                        {item.complaintsRaised} Grievances
                      </span>
                    </TableCell>

                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          item.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {item.status === 'Active' ? (
                          <UserCheck className="h-3.5 w-3.5" />
                        ) : (
                          <UserX className="h-3.5 w-3.5" />
                        )}
                        <span>{item.status}</span>
                      </span>
                    </TableCell>

                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRowClick(item)}
                          className="text-primary-700 font-semibold text-xs"
                        >
                          Details
                        </Button>
                        <Button
                          variant={item.status === 'Active' ? 'danger' : 'primary'}
                          size="sm"
                          onClick={() => setUserToToggle(item)}
                          className="text-xs"
                        >
                          {item.status === 'Active' ? 'Suspend' : 'Activate'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="p-4 border-t border-border bg-surface-subtle">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={8}
                onPageChange={(p) => setCurrentPage(p)}
              />
            </div>
          </>
        )}
      </Card>

      {/* ─── User Detail Modal / Drawer ─── */}
      <Modal
        isOpen={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        title={selectedUser ? `${selectedUser.name}'s Profile` : 'User Details'}
        description={`Consumer ID: ${selectedUser?.id}`}
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-5">
            {/* User Metas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-surface-muted border border-border text-xs">
              <div>
                <span className="text-neutral-400 font-medium block">Email:</span>
                <span className="font-bold text-neutral-900 mt-0.5 block truncate">
                  {selectedUser.email}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 font-medium block">Phone:</span>
                <span className="font-bold text-neutral-900 mt-0.5 block">
                  {selectedUser.phone}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 font-medium block">Location:</span>
                <span className="font-bold text-neutral-900 mt-0.5 block">
                  {selectedUser.city}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 font-medium block">Account Status:</span>
                <span
                  className={`font-bold mt-0.5 block ${
                    selectedUser.status === 'Active' ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {selectedUser.status}
                </span>
              </div>
            </div>

            {/* Complaints Raised by this User */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-primary-600" />
                <span>Grievances Lodged by this Consumer ({userComplaints.length})</span>
              </h4>

              {loadingUserComplaints ? (
                <div className="py-6 text-center text-xs text-neutral-400">Loading grievances...</div>
              ) : userComplaints.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-border text-center text-xs text-neutral-400">
                  No grievances raised by this user yet.
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {userComplaints.map((c) => (
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
                          Product: {c.productName} • {new Date(c.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <ComplaintStatusBadge status={c.status} size="sm" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-2 border-t border-border flex items-center justify-between">
              <Button
                variant={selectedUser.status === 'Active' ? 'danger' : 'primary'}
                size="sm"
                onClick={() => {
                  setUserToToggle(selectedUser);
                }}
              >
                {selectedUser.status === 'Active' ? 'Suspend Account' : 'Reactivate Account'}
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ─── Toggle Status Confirmation Modal ─── */}
      <Modal
        isOpen={Boolean(userToToggle)}
        onClose={() => setUserToToggle(null)}
        title={userToToggle?.status === 'Active' ? 'Suspend User Access?' : 'Reactivate User?'}
        description={`Confirm status update for ${userToToggle?.name} (${userToToggle?.email})`}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-neutral-600 leading-relaxed">
            {userToToggle?.status === 'Active'
              ? 'Suspending this user will prevent them from logging in, scanning products, and submitting new Legal Metrology grievances.'
              : 'Reactivating this user will restore their ability to access the citizen portal and scan product labels.'}
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setUserToToggle(null)}
              disabled={toggling}
            >
              Cancel
            </Button>
            <Button
              variant={userToToggle?.status === 'Active' ? 'danger' : 'primary'}
              size="md"
              loading={toggling}
              onClick={handleConfirmToggle}
            >
              Confirm {userToToggle?.status === 'Active' ? 'Suspension' : 'Activation'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUsersPage;
