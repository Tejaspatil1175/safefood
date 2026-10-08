import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  AlertTriangle,
  RotateCcw,
  Inbox,
  UserPlus,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  MapPin,
  Calendar,
} from 'lucide-react';
import complaintsService from '../../services/complaints';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import { ComplaintStatusBadge } from '../../components/complaints';
import { OfficerVerificationIndicator, AssignComplaintModal } from '../../components/admin';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/common/Table';
import { SkeletonTable } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

export const AdminComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [counts, setCounts] = useState({
    all: 0,
    unassigned: 0,
    assigned: 0,
    underInvestigation: 0,
    verifiedGenuine: 0,
    verifiedNotGenuine: 0,
  });

  // Assign / Reassign Modal State
  const [selectedToAssign, setSelectedToAssign] = useState(null);

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

  const fetchComplaints = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await complaintsService.getAllComplaints({
        search: debouncedSearch,
        status: statusFilter,
        page: currentPage,
        limit: 8,
      });

      setComplaints(res.complaints || []);
      setTotalPages(res.totalPages || 1);
      setTotalItems(res.total || 0);
      if (res.counts) {
        setCounts(res.counts);
      }
    } catch (err) {
      console.error('Failed to load complaints queue', err);
      setError('Unable to fetch grievances registry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [debouncedSearch, statusFilter, currentPage]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  const tabs = [
    { key: 'all', label: 'All Cases', count: counts.all },
    { key: 'unassigned', label: 'Unassigned', count: counts.unassigned },
    { key: 'assigned', label: 'Assigned', count: counts.assigned },
    { key: 'under_investigation', label: 'Under Investigation', count: counts.underInvestigation },
    { key: 'verified_genuine', label: 'Verified Genuine', count: counts.verifiedGenuine },
    { key: 'verified_not_genuine', label: 'Not Genuine', count: counts.verifiedNotGenuine },
  ];

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Citizen Grievances & Enforcement Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Dispatch consumer packaging complaints to authorized field officers and track statutory verifications end-to-end.
          </p>
        </div>
      </div>

      {/* ─── Filter Tabs & Search Bar ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-surface rounded-xl border border-border overflow-x-auto shadow-2xs max-w-full">
          {tabs.map((tab) => {
            const isActive = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setStatusFilter(tab.key);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-surface-muted'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search ID, title, product, or citizen..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-surface text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors shadow-2xs"
          />
        </div>
      </div>

      {/* ─── Complaints Table Card ─── */}
      <Card className="p-0 overflow-hidden shadow-card">
        {loading ? (
          <div className="p-6">
            <SkeletonTable rows={6} cols={7} />
          </div>
        ) : error ? (
          <div className="p-6">
            <ErrorState
              title="Failed to Load Grievances"
              description={error}
              onRetry={fetchComplaints}
            />
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Inbox}
              title="No complaints in this category"
              description="No grievances match the active filter criteria."
              actionLabel="Reset Filters"
              actionIcon={RotateCcw}
              onAction={handleResetFilters}
            />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow hover={false}>
                    <TableHead>Case ID</TableHead>
                    <TableHead>Complaint & Product</TableHead>
                    <TableHead>Raised By</TableHead>
                    <TableHead>Date Filed</TableHead>
                    <TableHead>Investigation Status</TableHead>
                    <TableHead>Assigned Officer & Verification</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complaints.map((item) => {
                    const canReassign = item.status === 'assigned';
                    const isUnassigned = !item.assignedOfficer || item.status === 'submitted';

                    return (
                      <TableRow key={item.id}>
                        {/* ID */}
                        <TableCell className="font-mono text-xs font-bold text-primary-700">
                          {item.id}
                        </TableCell>

                        {/* Title & Product */}
                        <TableCell>
                          <div className="max-w-xs">
                            <span className="font-bold text-neutral-900 block leading-tight truncate">
                              {item.title}
                            </span>
                            <span className="text-xs text-neutral-500 truncate block">
                              Product: <strong>{item.productName}</strong>
                            </span>
                          </div>
                        </TableCell>

                        {/* Raised By */}
                        <TableCell className="text-xs">
                          <span className="font-semibold text-neutral-800 block">
                            {item.raisedBy?.name || 'Citizen'}
                          </span>
                          <span className="text-[11px] text-neutral-500 truncate block">
                            {item.raisedBy?.email}
                          </span>
                        </TableCell>

                        {/* Date */}
                        <TableCell className="text-xs text-neutral-600 font-medium">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <ComplaintStatusBadge status={item.status} size="sm" />
                        </TableCell>

                        {/* Assigned Officer with Verification Indicator */}
                        <TableCell>
                          <OfficerVerificationIndicator
                            officer={item.assignedOfficer}
                            status={item.status}
                            onAssign={() => setSelectedToAssign(item)}
                          />
                        </TableCell>

                        {/* Action Buttons */}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isUnassigned && (
                              <Button
                                variant="primary"
                                size="sm"
                                icon={UserPlus}
                                onClick={() => setSelectedToAssign(item)}
                                className="text-xs font-bold shadow-2xs"
                              >
                                Assign
                              </Button>
                            )}

                            {canReassign && (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setSelectedToAssign(item)}
                                className="text-xs"
                              >
                                Reassign
                              </Button>
                            )}

                            <Link to={`/app/admin/complaints/${item.id}`}>
                              <Button variant="ghost" size="sm" icon={Eye}>
                                View
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

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

      {/* ─── Assign / Reassign Modal ─── */}
      <AssignComplaintModal
        isOpen={Boolean(selectedToAssign)}
        onClose={() => setSelectedToAssign(null)}
        complaint={selectedToAssign}
        onAssigned={fetchComplaints}
      />
    </div>
  );
};

export default AdminComplaintsPage;
