import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Plus,
  ArrowRight,
  ChevronRight,
  Inbox,
  RotateCcw,
  FileText,
  MapPin,
  Calendar,
  Sparkles,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import complaintsService from '../../services/complaints';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { ComplaintStatusBadge } from '../../components/complaints';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/common/Table';
import { SkeletonTable } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

export const UserComplaintsPage = () => {
  const { user } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [counts, setCounts] = useState({
    all: 0,
    submitted: 0,
    inProgress: 0,
    resolved: 0,
  });

  const searchTimerRef = useRef(null);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);

    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(val);
    }, 250);
  };

  const fetchComplaints = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await complaintsService.getMyComplaints(user?.id, {
        search: debouncedSearch,
        status: statusFilter,
      });

      setComplaints(res.complaints || []);
      if (res.counts) {
        setCounts(res.counts);
      }
    } catch (err) {
      console.error('Failed to load user complaints', err);
      setError('Unable to load your complaints. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [user, debouncedSearch, statusFilter]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setStatusFilter('all');
  };

  const tabs = [
    { key: 'all', label: 'All Complaints', count: counts.all },
    { key: 'submitted', label: 'Submitted', count: counts.submitted },
    { key: 'in_progress', label: 'In Progress', count: counts.inProgress },
    { key: 'resolved', label: 'Resolved', count: counts.resolved },
  ];

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            My Product Grievances & Complaints
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Track investigations conducted by Legal Metrology officers on packaged commodities you reported.
          </p>
        </div>

        <Link to="/app/user/complaints/new">
          <Button variant="primary" size="md" icon={Plus}>
            Raise a Complaint
          </Button>
        </Link>
      </div>

      {/* ─── Controls: Filter Tabs & Search Bar ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-surface rounded-xl border border-border overflow-x-auto shadow-2xs max-w-full">
          {tabs.map((tab) => {
            const isActive = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key)}
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
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search complaint or product..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-surface text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors shadow-2xs"
          />
        </div>
      </div>

      {/* ─── Complaints List Card ─── */}
      <Card className="p-0 overflow-hidden shadow-card">
        {loading ? (
          <div className="p-6">
            <SkeletonTable rows={4} cols={5} />
          </div>
        ) : error ? (
          <div className="p-6">
            <ErrorState
              title="Failed to Load Complaints"
              description={error}
              onRetry={fetchComplaints}
            />
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Inbox}
              title="No complaints found"
              description={
                searchTerm || statusFilter !== 'all'
                  ? 'No grievances match your search or selected filter.'
                  : 'You have not raised any product complaints yet.'
              }
              actionLabel={searchTerm || statusFilter !== 'all' ? 'Reset Filters' : 'Raise a Complaint'}
              actionIcon={searchTerm || statusFilter !== 'all' ? RotateCcw : Plus}
              onAction={
                searchTerm || statusFilter !== 'all'
                  ? handleResetFilters
                  : () => window.location.assign('/app/user/complaints/new')
              }
            />
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow hover={false}>
                    <TableHead>Complaint ID</TableHead>
                    <TableHead>Subject & Product</TableHead>
                    <TableHead>Purchase Location</TableHead>
                    <TableHead>Date Filed</TableHead>
                    <TableHead>Investigation Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complaints.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-xs font-bold text-primary-700">
                        {item.id}
                      </TableCell>

                      <TableCell>
                        <div>
                          <span className="font-bold text-neutral-900 block leading-tight">
                            {item.title}
                          </span>
                          <span className="text-xs text-neutral-500">
                            Product: <strong className="text-neutral-700">{item.productName}</strong>
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-xs text-neutral-600 max-w-xs">
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                          <span className="truncate">{item.storeOrLocation}</span>
                        </div>
                      </TableCell>

                      <TableCell className="text-xs text-neutral-600 font-medium">
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </TableCell>

                      <TableCell>
                        <ComplaintStatusBadge status={item.status} size="sm" />
                      </TableCell>

                      <TableCell className="text-right">
                        <Link to={`/app/user/complaints/${item.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={ArrowRight}
                            iconPosition="right"
                            className="text-primary-700 font-semibold"
                          >
                            Track Progress
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Stacked Cards */}
            <div className="md:hidden divide-y divide-border">
              {complaints.map((item) => (
                <Link
                  key={item.id}
                  to={`/app/user/complaints/${item.id}`}
                  className="p-4 flex flex-col gap-2.5 bg-surface hover:bg-surface-muted transition-colors block"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-primary-700">
                      {item.id}
                    </span>
                    <ComplaintStatusBadge status={item.status} size="sm" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-600 mt-1">
                      Product: <strong>{item.productName}</strong>
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-neutral-400 shrink-0" />
                      <span className="truncate">{item.storeOrLocation}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1.5 border-t border-border/60 text-neutral-500">
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    <div className="flex items-center gap-1 font-semibold text-primary-700">
                      <span>Track</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default UserComplaintsPage;
