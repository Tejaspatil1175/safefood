import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Sparkles,
  Eye,
  RotateCcw,
  Inbox,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Calendar,
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

export const UserHistoryPage = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

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

  const fetchScans = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await scanService.getScanHistory({
        page: currentPage,
        limit: 8,
        search: debouncedSearch,
        status: statusFilter,
      });

      setScans(res.scans || []);
      setTotalPages(res.totalPages || 1);
      setTotalItems(res.total || 0);
    } catch (err) {
      console.error('Failed to load user scan history', err);
      setError('Unable to fetch your scan history. Please try again.');
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

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            My Scan History
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Review past packaged commodity labels you have checked for Legal Metrology compliance.
          </p>
        </div>

        <Link to="/app/user/scan">
          <Button variant="primary" size="md" icon={Sparkles}>
            Scan New Label
          </Button>
        </Link>
      </div>

      {/* ─── Search & Tab Controls ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-surface rounded-xl border border-border overflow-x-auto shadow-2xs">
          {[
            { key: 'all', label: 'All Scans' },
            { key: 'compliant', label: 'Compliant' },
            { key: 'non-compliant', label: 'Possible Issues' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setStatusFilter(tab.key);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.key
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-surface-muted'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search product or Scan ID..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-surface text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors shadow-2xs"
          />
        </div>
      </div>

      {/* ─── History Table & Cards ─── */}
      <Card className="p-0 overflow-hidden shadow-card">
        {loading ? (
          <div className="p-6">
            <SkeletonTable rows={5} cols={5} />
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
              title="No scan records found"
              description={
                searchTerm || statusFilter !== 'all'
                  ? 'No scans match your search and filter criteria.'
                  : 'You have not scanned any product labels yet.'
              }
              actionLabel={searchTerm || statusFilter !== 'all' ? 'Clear Filters' : 'Scan a Label'}
              actionIcon={searchTerm || statusFilter !== 'all' ? RotateCcw : Sparkles}
              onAction={
                searchTerm || statusFilter !== 'all'
                  ? handleClearFilters
                  : () => window.location.assign('/app/user/scan')
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
                    <TableHead>Product / Brand</TableHead>
                    <TableHead>Result Status</TableHead>
                    <TableHead>Date Scanned</TableHead>
                    <TableHead>Scan Reference</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scans.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <span className="font-bold text-neutral-900 block leading-tight">
                            {item.product}
                          </span>
                          <span className="text-xs text-neutral-500">
                            {item.brand || 'Packaged Commodity'}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <StatusBadge status={item.status} size="sm" />
                      </TableCell>

                      <TableCell className="text-xs text-neutral-600 font-medium">
                        {item.date}
                      </TableCell>

                      <TableCell className="font-mono text-xs font-semibold text-primary-700">
                        {item.id}
                      </TableCell>

                      <TableCell className="text-right">
                        <Link to={`/app/user/report/${item.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={ArrowRight}
                            iconPosition="right"
                            className="text-primary-700 font-semibold"
                          >
                            View Result
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
              {scans.map((item) => (
                <Link
                  key={item.id}
                  to={`/app/user/report/${item.id}`}
                  className="p-4 flex flex-col gap-2 bg-surface hover:bg-surface-muted transition-colors block"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-neutral-900 leading-snug">
                      {item.product}
                    </h3>
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                  <p className="text-xs text-neutral-500">{item.brand}</p>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-border/60 text-neutral-500">
                    <span className="font-mono text-primary-700 font-medium">{item.id}</span>
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
                itemsPerPage={8}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default UserHistoryPage;
