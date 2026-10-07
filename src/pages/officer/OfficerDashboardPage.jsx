import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Clock, FileText, CheckCircle2, ScanLine, ArrowRight } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import StatCard from '../../components/common/StatCard';
import Card, { CardHeader } from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/common/Table';

export const OfficerDashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Officer Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-neutral-900 via-neutral-800 to-primary-950 text-white rounded-2xl shadow-card">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-warning-400">
            Enforcement Officer Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
            {user?.name || 'Inspector Priya Verma'}
          </h1>
          <p className="text-sm text-neutral-300 max-w-xl mt-1">
            Enforcement Cell • Legal Metrology (Packaged Commodities) Field Operations
          </p>
        </div>
        <Link to="/app/officer/scan">
          <Button
            variant="secondary"
            size="lg"
            icon={ScanLine}
            className="whitespace-nowrap bg-white text-neutral-900 hover:bg-neutral-100 shadow-md font-semibold"
          >
            Field Audit Scan
          </Button>
        </Link>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <StatCard
          title="Active Violations"
          value="8"
          change="+2 new today"
          trend="up"
          icon={ShieldAlert}
          variant="error"
        />
        <StatCard
          title="Under Investigation"
          value="5"
          change="Assigned to you"
          trend="neutral"
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Notices Issued"
          value="14"
          change="Section 39/53 PCR"
          trend="neutral"
          icon={FileText}
          variant="primary"
        />
        <StatCard
          title="Resolved Audits"
          value="31"
          change="92% closure rate"
          trend="up"
          icon={CheckCircle2}
          variant="success"
        />
      </div>

      {/* Grievance Triage Queue */}
      <Card className="p-0 overflow-hidden">
        <div className="p-6 pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Priority Investigation Queue</h3>
            <p className="text-xs text-neutral-500 mt-0.5">Citizen grievances and non-compliance audits requiring statutory verification</p>
          </div>
          <Link to="/app/officer/investigations">
            <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
              View All
            </Button>
          </Link>
        </div>

        <Table>
          <TableHeader>
            <TableRow hover={false}>
              <TableHead>Case ID</TableHead>
              <TableHead>Commodity / Brand</TableHead>
              <TableHead>Violation Type</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { id: 'INV-402', product: 'Sunrise Sunflower Oil 1L', issue: 'Under-weight declaration (890ml)', severity: 'non-compliant', status: 'under-review' },
              { id: 'INV-401', product: 'Deluxe Basmati Rice 5kg', issue: 'Missing USP & Non-standard pack size', severity: 'warning', status: 'pending' },
              { id: 'INV-398', product: 'imported Hazelnut Spread 350g', issue: 'No Importer Name & FSSAI on label', severity: 'non-compliant', status: 'under-review' },
            ].map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-mono text-xs font-semibold text-primary-700">
                  {inv.id}
                </TableCell>
                <TableCell className="font-semibold text-neutral-900">{inv.product}</TableCell>
                <TableCell className="text-xs text-neutral-600">{inv.issue}</TableCell>
                <TableCell>
                  <StatusBadge status={inv.severity} size="sm" />
                </TableCell>
                <TableCell>
                  <StatusBadge status={inv.status} size="sm" />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="primary" size="sm">
                    Inspect
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default OfficerDashboardPage;
