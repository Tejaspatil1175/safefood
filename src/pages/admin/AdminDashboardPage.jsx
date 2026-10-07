import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  AlertTriangle,
  Clock,
  Search,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Eye,
  UserPlus,
  Inbox,
  AlertCircle,
} from 'lucide-react';
import adminService from '../../services/admin';
import complaintsService from '../../services/complaints';
import StatCard from '../../components/common/StatCard';
import Card, { CardHeader } from '../../components/common/Card';
import Button from '../../components/common/Button';
import { ComplaintStatusBadge } from '../../components/complaints';
import { OfficerVerificationIndicator, AssignComplaintModal } from '../../components/admin';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/common/Table';
import { SkeletonCard, SkeletonTable } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [unassignedComplaints, setUnassignedComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Assignment Modal
  const [selectedComplaintToAssign, setSelectedComplaintToAssign] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, complaintsData] = await Promise.all([
        adminService.getDashboardStats(),
        complaintsService.getAllComplaints({ limit: 6 }),
      ]);

      setStats(statsData);
      setRecentComplaints(complaintsData.complaints || []);
      setUnassignedComplaints(
        (complaintsData.complaints || []).filter((c) => !c.assignedOfficer || c.status === 'submitted')
      );
    } catch (err) {
      console.error('Failed to load admin dashboard data', err);
      setError('Unable to load administrative overview statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-neutral-900 via-primary-950 to-neutral-900 text-white rounded-2xl shadow-card">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-300">
            System Administration & Oversight
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            TrustLabel Platform Operations Console
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mt-1">
            Real-time compliance surveillance, citizen grievances dispatch, and field enforcement workflow metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/app/admin/complaints">
            <Button
              variant="secondary"
              size="md"
              icon={AlertTriangle}
              className="bg-white text-neutral-900 hover:bg-neutral-100 font-bold shadow-md"
            >
              Manage Grievances
            </Button>
          </Link>
        </div>
      </div>

      {/* ─── 6 Key Operational Stat Cards ─── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : error ? (
        <ErrorState
          title="Failed to Load Operations Metrics"
          description={error}
          onRetry={fetchDashboardData}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <StatCard
            title="Total Registered Users"
            value={stats?.totalUsers ?? 12}
            change="Citizens & consumers"
            trend="up"
            icon={Users}
            variant="primary"
          />
          <StatCard
            title="Enforcement Officers"
            value={stats?.totalOfficers ?? 5}
            change="Active inspectors"
            trend="up"
            icon={UserCheck}
            variant="success"
          />
          <StatCard
            title="Total Complaints Filed"
            value={stats?.totalComplaints ?? 6}
            change="Overall grievances"
            trend="neutral"
            icon={AlertTriangle}
            variant="warning"
          />
          <StatCard
            title="Pending Assignment"
            value={stats?.pendingAssignment ?? 2}
            change="Needs officer assignment"
            trend={stats?.pendingAssignment > 0 ? 'down' : 'neutral'}
            icon={Clock}
            variant={stats?.pendingAssignment > 0 ? 'error' : 'neutral'}
          />
          <StatCard
            title="Under Investigation"
            value={stats?.underInvestigation ?? 2}
            change="Active in-field audits"
            trend="up"
            icon={Search}
            variant="warning"
          />
          <StatCard
            title="Verified Genuine Violations"
            value={stats?.verifiedGenuine ?? 2}
            change="Statutory notices served"
            trend="up"
            icon={CheckCircle2}
            variant="success"
          />
        </div>
      )}

      {/* ─── Needs Attention: Unassigned Complaints Box ─── */}
      {unassignedComplaints.length > 0 && (
        <Card className="border-amber-300 bg-amber-50/60 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-950">
                  Needs Attention: {unassignedComplaints.length} Unassigned Citizen Grievance{unassignedComplaints.length > 1 ? 's' : ''}
                </h3>
                <p className="text-xs text-amber-800">
                  Assign these submitted cases to field officers to begin Legal Metrology verification.
                </p>
              </div>
            </div>

            <Link to="/app/admin/complaints">
              <Button variant="ghost" size="sm" className="text-amber-900 font-semibold text-xs">
                View All Unassigned
              </Button>
            </Link>
          </div>

          <div className="mt-3 divide-y divide-amber-200/60">
            {unassignedComplaints.map((item) => (
              <div
                key={item.id}
                className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-900">{item.id}</span>
                    <span className="font-bold text-neutral-900 text-xs truncate max-w-md">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-600 mt-0.5">
                    Product: <strong>{item.productName}</strong> • {item.storeOrLocation} • Raised by {item.raisedBy?.name}
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  icon={UserPlus}
                  onClick={() => setSelectedComplaintToAssign(item)}
                  className="bg-amber-700 hover:bg-amber-800 text-white font-bold shrink-0 shadow-2xs text-xs"
                >
                  Assign Officer
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ─── Recent Complaints Table ─── */}
      <Card className="p-0 overflow-hidden shadow-card">
        <div className="p-6 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Recent Consumer Grievances</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Live complaints queue with officer verification status indicators
            </p>
          </div>
          <Link to="/app/admin/complaints">
            <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
              View Full Queue
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="p-6">
            <SkeletonTable rows={5} cols={6} />
          </div>
        ) : recentComplaints.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Inbox}
              title="No complaints filed yet"
              description="Citizen grievances will populate here as consumers audit packaging."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow hover={false}>
                  <TableHead>Case ID</TableHead>
                  <TableHead>Subject & Product</TableHead>
                  <TableHead>Raised By</TableHead>
                  <TableHead>Investigation Status</TableHead>
                  <TableHead>Assigned Officer & Verification</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentComplaints.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs font-bold text-primary-700">
                      {item.id}
                    </TableCell>

                    <TableCell>
                      <div className="max-w-xs">
                        <span className="font-bold text-neutral-900 block leading-tight truncate">
                          {item.title}
                        </span>
                        <span className="text-xs text-neutral-500 truncate block">
                          {item.productName}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs">
                      <span className="font-semibold text-neutral-800 block">{item.raisedBy?.name}</span>
                      <span className="text-[11px] text-neutral-500">{item.raisedBy?.email}</span>
                    </TableCell>

                    <TableCell>
                      <ComplaintStatusBadge status={item.status} size="sm" />
                    </TableCell>

                    {/* Assigned Officer with Verification Indicator */}
                    <TableCell>
                      <OfficerVerificationIndicator
                        officer={item.assignedOfficer}
                        status={item.status}
                        onAssign={() => setSelectedComplaintToAssign(item)}
                      />
                    </TableCell>

                    <TableCell className="text-xs text-neutral-600 font-medium">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="text-right">
                      <Link to={`/app/admin/complaints/${item.id}`}>
                        <Button variant="ghost" size="sm" icon={Eye}>
                          Inspect
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* ─── Assignment Modal ─── */}
      <AssignComplaintModal
        isOpen={Boolean(selectedComplaintToAssign)}
        onClose={() => setSelectedComplaintToAssign(null)}
        complaint={selectedComplaintToAssign}
        onAssigned={fetchDashboardData}
      />
    </div>
  );
};

export default AdminDashboardPage;
