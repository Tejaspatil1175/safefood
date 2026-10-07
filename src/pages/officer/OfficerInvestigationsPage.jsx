import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  ArrowRight,
  Eye,
  RotateCcw,
  Inbox,
  AlertCircle,
  FileCheck2,
  Clock,
  ShieldAlert,
  SearchCheck,
  UserCheck,
  MapPin,
  Calendar,
  Sparkles,
  ChevronRight,
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

export const OfficerInvestigationsPage = () => {
  const { user } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [counts, setCounts] = useState({
    all: 0,
    assigned: 0,
    underInvestigation: 0,
    completed: 0,
  });

  const searchTimerRef = useRef(null);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(val);
    }, 250);
  };

  const fetchComplaints = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await complaintsService.getAssignedComplaints(user?.id, {
        search: debouncedSearch,
        tab: activeTab,
      });

      setComplaints(res.complaints || []);
      if (res.counts) {
        setCounts(res.counts);
      }
    } catch (err) {
      console.error('Failed to load officer investigations', err);
      setError('Unable to load assigned complaints. Please verify network connectivity.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [debouncedSearch, activeTab]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setActiveTab('all');
  };

  const tabs = [
    { key: 'all', label: 'All Cases', count: counts.all },
    { key: 'assigned', label: 'Assigned', count: counts.assigned },
    { key: 'under_investigation', label: 'Under Investigation', count: counts.underInvestigation },
    { key: 'completed', label: 'Completed', count: counts.completed },
  ];

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight flex items-center gap-2.5">
            <span>Enforcement Investigations & Grievances</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Review consumer complaints assigned to you, inspect product packaging declarations, and issue formal compliance findings.
          </p>
        </div>

        <Link to="/app/officer/scan">
          <Button variant="primary" size="md" icon={Sparkles}>
            Launch Label Scanner
          </Button>
        </Link>
      </div>

      {/* ─── Controls: Filter Tabs & Search Bar ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-surface rounded-xl border border-border overflow-x-auto max-w-full shadow-2xs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
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

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search ID, product, store..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-surface text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors shadow-2xs"
          />
        </div>
      </div>

      {/* ─── Main Content Container ─── */}
      <Card className="p-0 overflow-hidden shadow-card">
        {loading ? (
          <div className="p-6">
            <SkeletonTable rows={6} cols={5} />
          </div>
        ) : error ? (
          <div className="p-6">
            <ErrorState
              title="Failed to Load Investigations"
              description={error}
              onRetry={fetchComplaints}
            />
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Inbox}
              title="No complaint cases found"
              description={
                searchTerm || activeTab !== 'all'
                  ? 'No grievances match your current search or active filter tab.'
                  : 'You do not have any pending or assigned investigations right now.'
              }
              actionLabel={searchTerm || activeTab !== 'all' ? 'Reset Filters' : 'Refresh Queue'}
              actionIcon={RotateCcw}
              onAction={searchTerm || activeTab !== 'all' ? handleResetFilters : fetchComplaints}
            />
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow hover={false}>
                    <TableHead>Case ID</TableHead>
                    <TableHead>Alleged Issue & Product</TableHead>
                    <TableHead>Retail Location</TableHead>
                    <TableHead>Raised By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complaints.map((item) => (
                    <TableRow key={item.id}>
                      {/* Case ID */}
                      <TableCell className="font-mono text-xs font-bold text-primary-700">
                        {item.id}
                      </TableCell>

                      {/* Title & Product */}
                      <TableCell>
                        <div className="max-w-md">
                          <span className="font-bold text-neutral-900 block leading-tight">
                            {item.title}
                          </span>
                          <span className="text-xs text-neutral-500 mt-0.5 block truncate">
                            Product: <strong className="text-neutral-700 font-medium">{item.productName}</strong>
                          </span>
                        </div>
                      </TableCell>

                      {/* Location */}
                      <TableCell className="text-xs text-neutral-600 max-w-xs">
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                          <span className="truncate">{item.storeOrLocation || 'Retail Market'}</span>
                        </div>
                      </TableCell>

                      {/* Raised By */}
                      <TableCell>
                        <div className="text-xs">
                          <span className="font-semibold text-neutral-800 block">
                            {item.raisedBy?.name || 'Consumer'}
                          </span>
                          <span className="text-[11px] text-neutral-500">
                            {formatDate(item.createdAt)}
                          </span>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <ComplaintStatusBadge status={item.status} size="sm" />
                      </TableCell>

                      {/* Action */}
                      <TableCell className="text-right">
                        <Link to={`/app/officer/investigations/${item.id}`}>
                          <Button
                            variant="primary"
                            size="sm"
                            icon={ArrowRight}
                            iconPosition="right"
                            className="font-semibold shadow-2xs"
                          >
                            {item.status === 'assigned'
                              ? 'Start Investigation'
                              : item.status === 'under_investigation'
                              ? 'Inspect & Decide'
                              : 'View Dossier'}
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Stacked Cards View */}
            <div className="md:hidden divide-y divide-border">
              {complaints.map((item) => (
                <Link
                  key={item.id}
                  to={`/app/officer/investigations/${item.id}`}
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

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-border/60 text-neutral-500">
                    <span>By: {item.raisedBy?.name || 'Citizen'}</span>
                    <div className="flex items-center gap-1 font-semibold text-primary-700">
                      <span>Inspect</span>
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

export default OfficerInvestigationsPage;
