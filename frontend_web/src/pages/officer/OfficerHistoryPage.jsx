import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  ArrowRight,
  Eye,
  RotateCcw,
  Inbox,
  AlertTriangle,
  Calendar,
  Sparkles,
  ChevronRight,
  Download,
} from 'lucide-react';
import scanService from '../../services/scan';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/common/Table';
import { SkeletonTable } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

export const OfficerHistoryPage = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Pagination States
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [counts, setCounts] = useState({ all: 0, compliant: 0, nonCompliant: 0, warnings: 0 });

  const searchDebounceTimerRef = useRef(null);

  // Debounce search input
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);

    if (searchDebounceTimerRef.current) {
      clearTimeout(searchDebounceTimerRef.current);
    }

    searchDebounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(val);
      setCurrentPage(1); // Reset to first page on search change
    }, 300);
  };

  const handleStatusTabChange = (newStatus) => {
    setStatusFilter(newStatus);
    setCurrentPage(1); // Reset to first page on tab change
  };

  const fetchScans = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await scanService.getScanHistory({
        page: currentPage,
        limit: 10,
        search: debouncedSearch,
        status: statusFilter,
      });

      setScans(response.scans || response.inspections || []);
      setTotalPages(response.totalPages || 1);
      setTotalItems(response.total || 0);
      if (response.counts) {
        setCounts(response.counts);
      }
    } catch (err) {
      console.error('Failed to load scan history', err);
      setError('Unable to fetch inspection records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScans();
  }, [currentPage, debouncedSearch, statusFilter]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  const tabs = [
    { key: 'all', label: 'All Inspections', count: counts.all },
    { key: 'compliant', label: 'Compliant', count: counts.compliant },
    { key: 'non-compliant', label: 'Non-Compliant', count: counts.nonCompliant },
    { key: 'warnings', label: 'Warnings', count: counts.warnings },
  ];

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Statutory Inspection History
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Browse and inspect all verified packaged commodity declarations and audit dossiers.
          </p>
        </div>

        <Link to="/app/officer/scan">
          <Button variant="primary" size="md" icon={Sparkles}>
            New Field Scan
          </Button>
        </Link>
      </div>

      {/* ─── Controls: Filter Tabs & Search Bar ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-surface rounded-xl border border-border overflow-x-auto max-w-full">
          {tabs.map((tab) => {
            const isActive = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleStatusTabChange(tab.key)}
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

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search product or Scan ID..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-surface text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
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
              title="Failed to Load History"
              description={error}
              onRetry={fetchScans}
            />
          </div>
        ) : scans.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Inbox}
              title="No inspection records found"
              description={
                searchTerm || statusFilter !== 'all'
                  ? 'No results matched your active search and filter criteria.'
                  : 'Start your first product label verification to populate inspection history.'
              }
              actionLabel={searchTerm || statusFilter !== 'all' ? 'Clear Filters' : 'Start Inspection'}
              actionIcon={searchTerm || statusFilter !== 'all' ? RotateCcw : Sparkles}
              onAction={
                searchTerm || statusFilter !== 'all'
                  ? handleClearFilters
                  : () => window.location.assign('/app/officer/scan')
              }
            />
          </div>
        ) : (
          <>
            {/* Desktop Table View (Visible on md and up) */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow hover={false}>
                    <TableHead>Product / Commodity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Scan ID</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scans.map((item) => (
                    <TableRow key={item.id}>
                      {/* Product & Outlet */}
                      <TableCell>
                        <div>
                          <span className="font-bold text-neutral-900 block">
                            {item.product}
                          </span>
                          <span className="text-xs text-neutral-500">
                            {item.brand ? `${item.brand} • ` : ''}{item.outlet || 'Surveillance Sample'}
                          </span>
                        </div>
                      </TableCell>

                      {/* Status Badge */}
                      <TableCell>
                        <StatusBadge status={item.status} size="sm" />
                      </TableCell>

                      {/* Date */}
                      <TableCell className="text-xs text-neutral-600 font-medium">
                        {item.date}
                      </TableCell>

                      {/* Scan ID */}
                      <TableCell className="font-mono text-xs font-semibold text-primary-700">
                        {item.id}
                      </TableCell>

                      {/* View Action */}
                      <TableCell className="text-right">
                        <Link to={`/app/officer/report/${item.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={ArrowRight}
                            iconPosition="right"
                            className="text-primary-700 font-semibold"
                          >
                            View Report
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Stacked Card View (Visible on screens below md) */}
            <div className="md:hidden divide-y divide-border">
              {scans.map((item) => (
                <Link
                  key={item.id}
                  to={`/app/officer/report/${item.id}`}
                  className="p-4 flex flex-col gap-2.5 bg-surface hover:bg-surface-muted transition-colors block"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-neutral-900 leading-tight truncate">
                        {item.product}
                      </h3>
                      <p className="text-xs text-neutral-500 truncate mt-0.5">
                        {item.brand ? `${item.brand} • ` : ''}{item.outlet || 'Field Inspection'}
                      </p>
                    </div>
                    <StatusBadge status={item.status} size="sm" />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-border/60 text-neutral-500">
                    <span className="font-mono font-medium text-primary-700">
                      {item.id}
                    </span>
                    <div className="flex items-center gap-1 font-semibold text-neutral-800">
                      <span>{item.date}</span>
                      <ChevronRight className="h-4 w-4 text-neutral-400" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-border bg-surface-subtle">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={10}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default OfficerHistoryPage;
