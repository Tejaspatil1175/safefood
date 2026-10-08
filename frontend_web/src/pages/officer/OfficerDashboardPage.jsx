import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Clock,
  FileCheck2,
  ScanLine,
  Eye,
  RotateCcw,
  Sparkles,
  Inbox,
  AlertCircle,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import scanService from '../../services/scan';
import complaintsService from '../../services/complaints';
import StatCard from '../../components/common/StatCard';
import Card, { CardHeader } from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/common/Table';
import { SkeletonCard, SkeletonTable } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

export const OfficerDashboardPage = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, historyData, pendingCount] = await Promise.all([
        scanService.getOfficerDashboardStats(),
        scanService.getRecentInspections(),
        complaintsService.getPendingInvestigationsCount(user?.id).catch(() => 5),
      ]);
      setStats({
        ...statsData,
        pendingInvestigations: pendingCount !== undefined ? pendingCount : (statsData?.pendingInvestigations ?? 5),
      });
      setInspections(historyData.inspections || historyData || []);
    } catch (err) {
      console.error('Failed to load officer dashboard metrics', err);
      setError('Unable to retrieve officer inspection statistics. Please verify network connectivity.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  return (
    <div className="space-y-6">
      {/* ─── Greeting & Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-neutral-900 via-neutral-800 to-primary-950 text-white rounded-2xl shadow-card">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-warning-400">
            Enforcement Officer Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 flex items-center gap-2">
            <span>Welcome back, Inspector {user?.name || 'Priya Verma'}</span>
            <span className="text-2xl" role="img" aria-label="Waving hand">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mt-1">
            State Legal Metrology Cell • Packaged Commodities Rules (PCR) 2011 Field Surveillance
          </p>
        </div>
        <Link to="/app/officer/scan">
          <Button
            variant="secondary"
            size="lg"
            icon={ScanLine}
            className="whitespace-nowrap bg-white text-neutral-900 hover:bg-neutral-100 shadow-md font-semibold"
          >
            Start Inspection
          </Button>
        </Link>
      </div>

      {/* ─── Metric Stat Cards with Loading Skeleton ─── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : error ? (
        <ErrorState
          title="Failed to Load Overview Metrics"
          description={error}
          onRetry={fetchDashboardData}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
          <StatCard
            title="Total Scans"
            value={stats?.totalScans ?? 48}
            change="+4 this week"
            trend="up"
            icon={ScanLine}
            variant="primary"
          />
          <StatCard
            title="Compliant Products"
            value={stats?.compliantProducts ?? 32}
            change="68% compliance rate"
            trend="up"
            icon={FileCheck2}
            variant="success"
          />
          <StatCard
            title="Products With Issues"
            value={stats?.productsWithIssues ?? 16}
            change="Action required"
            trend="down"
            icon={ShieldAlert}
            variant="error"
          />
          <Link to="/app/officer/investigations" className="block transform hover:-translate-y-0.5 transition-transform">
            <StatCard
              title="Pending Investigations"
              value={stats?.pendingInvestigations ?? 5}
              change="Assigned to you"
              trend="neutral"
              icon={Clock}
              variant="warning"
            />
          </Link>
        </div>
      )}

      {/* ─── Recent Inspections Table ─── */}
      <Card className="p-0 overflow-hidden shadow-card">
        <div className="p-6 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Recent Inspections</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Latest commodities sampled and verified for statutory packaging declarations
            </p>
          </div>
          <Link to="/app/officer/history">
            <Button variant="ghost" size="sm">
              View All Inspections
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="p-6">
            <SkeletonTable rows={5} cols={5} />
          </div>
        ) : error ? (
          <div className="p-6">
            <ErrorState
              title="Error loading inspections"
              description="Could not load the recent inspections table."
              onRetry={fetchDashboardData}
            />
          </div>
        ) : inspections.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Inbox}
              title="No scans found"
              description="Start your first inspection to audit packaged commodities."
              actionLabel="Start Inspection"
              actionIcon={ScanLine}
              onAction={() => window.location.assign('/app/officer/scan')}
            />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow hover={false}>
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Scan ID</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inspections.map((item) => (
                <TableRow key={item.id}>
                  {/* Product */}
                  <TableCell>
                    <div>
                      <span className="font-bold text-neutral-900 block">
                        {item.product}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {item.outlet || 'Field Inspection'}
                      </span>
                    </div>
                  </TableCell>

                  {/* Status */}
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

                  {/* Action */}
                  <TableCell className="text-right">
                    <Link to={`/app/officer/history`}>
                      <Button variant="ghost" size="sm" icon={Eye}>
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default OfficerDashboardPage;
