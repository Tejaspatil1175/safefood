import React from 'react';
import { Link } from 'react-router-dom';
import { ScanLine, FileCheck2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import StatCard from '../../components/common/StatCard';
import Card, { CardHeader } from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';

export const UserDashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 text-white rounded-2xl shadow-card">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-200">
            Consumer Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
            Welcome, {user?.name || 'Consumer'}!
          </h1>
          <p className="text-sm text-primary-100 max-w-xl mt-1">
            Scan packaged product labels to verify mandatory declarations against Legal Metrology Rules (Packaged Commodities) 2011.
          </p>
        </div>
        <Link to="/app/user/scan">
          <Button
            variant="secondary"
            size="lg"
            icon={ScanLine}
            className="whitespace-nowrap bg-white text-primary-900 hover:bg-neutral-100 shadow-md font-semibold"
          >
            Scan New Label
          </Button>
        </Link>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Total Scans"
          value="12"
          change="+3 this week"
          trend="up"
          icon={ScanLine}
          variant="primary"
        />
        <StatCard
          title="Compliant Labels"
          value="9"
          change="75% compliance rate"
          trend="up"
          icon={FileCheck2}
          variant="success"
        />
        <StatCard
          title="Reported Violations"
          value="3"
          change="1 notice issued"
          trend="neutral"
          icon={AlertTriangle}
          variant="warning"
        />
      </div>

      {/* Recent Scans Overview */}
      <Card>
        <CardHeader
          title="Recent Label Verifications"
          subtitle="Latest products checked for mandatory Legal Metrology declarations"
          action={
            <Link to="/app/user/history">
              <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
                View All History
              </Button>
            </Link>
          }
        />

        <div className="space-y-3">
          {[
            { name: 'Organic Almond Milk 1L', brand: 'NutriPure Foods', date: 'Today, 2:30 PM', status: 'compliant' },
            { name: 'Imported Belgian Cocoa', brand: 'ChocoArtisan Ltd', date: 'Yesterday', status: 'warning' },
            { name: 'Premium Mustard Oil 500ml', brand: 'Kisan Naturals', date: '3 days ago', status: 'non-compliant' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface-subtle hover:bg-surface-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-surface border border-border flex items-center justify-center text-primary-600 font-bold text-xs">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900">{item.name}</h4>
                  <p className="text-xs text-neutral-500">{item.brand} • {item.date}</p>
                </div>
              </div>
              <StatusBadge status={item.status} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default UserDashboardPage;
