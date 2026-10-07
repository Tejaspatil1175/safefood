import React from 'react';
import { Users, UserCheck, AlertTriangle, Sliders, ShieldCheck, Activity } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import StatCard from '../../components/common/StatCard';
import Card, { CardHeader } from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/common/Table';

export const AdminDashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Admin Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-primary-950 via-neutral-900 to-primary-900 text-white rounded-2xl shadow-card">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-300">
            System Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
            {user?.name || 'Administrator Console'}
          </h1>
          <p className="text-sm text-neutral-300 max-w-xl mt-1">
            Global Legal Metrology PCR 2011 rule engine configuration, audit surveillance, and user directory.
          </p>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <StatCard
          title="Total Registered Users"
          value="1,248"
          change="+18% this month"
          trend="up"
          icon={Users}
          variant="primary"
        />
        <StatCard
          title="Active Officers"
          value="42"
          change="8 State Zones"
          trend="neutral"
          icon={UserCheck}
          variant="success"
        />
        <StatCard
          title="System Grievances"
          value="156"
          change="89% resolved"
          trend="up"
          icon={AlertTriangle}
          variant="warning"
        />
        <StatCard
          title="PCR Rule Engine"
          value="v2.4 Active"
          change="8 Mandatory declarations"
          trend="neutral"
          icon={Sliders}
          variant="neutral"
        />
      </div>

      {/* Recent System Activity */}
      <Card className="p-0 overflow-hidden">
        <div className="p-6 pb-4">
          <h3 className="text-lg font-semibold text-neutral-900">Recent Platform Audit Logs</h3>
          <p className="text-xs text-neutral-500 mt-0.5">Real-time system events, PCR threshold updates, and role allocations</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow hover={false}>
              <TableHead>Event ID</TableHead>
              <TableHead>Action / Description</TableHead>
              <TableHead>Performed By</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { id: 'EVT-892', action: 'PCR Rule Update: Unit Sale Price mandatory tolerance updated', actor: 'Admin Dr. Gupta', time: '10 mins ago', status: 'compliant' },
              { id: 'EVT-891', action: 'Officer Account Verified: Inspector S. Rane', actor: 'Admin Dr. Gupta', time: '1 hour ago', status: 'active' },
              { id: 'EVT-890', action: 'Automated OCR Audit: 42 batch labels processed', actor: 'OCR AI Engine', time: '2 hours ago', status: 'compliant' },
            ].map((evt) => (
              <TableRow key={evt.id}>
                <TableCell className="font-mono text-xs font-semibold text-primary-700">
                  {evt.id}
                </TableCell>
                <TableCell className="font-medium text-neutral-900">{evt.action}</TableCell>
                <TableCell className="text-xs text-neutral-600">{evt.actor}</TableCell>
                <TableCell className="text-xs text-neutral-500">{evt.time}</TableCell>
                <TableCell>
                  <StatusBadge status={evt.status} size="sm" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;
