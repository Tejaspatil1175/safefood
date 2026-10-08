import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Camera,
  FileText,
  Clock,
  Plus,
  Inbox,
  Eye,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import scanService from '../../services/scan';
import complaintsService from '../../services/complaints';
import StatCard from '../../components/common/StatCard';
import Card, { CardHeader } from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import { ComplaintStatusBadge } from '../../components/complaints';
import { SkeletonCard, SkeletonList } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';

export const UserDashboardPage = () => {
  const { user } = useAuth();

  const [recentScans, setRecentScans] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [scansRes, complaintsRes] = await Promise.all([
          scanService.getScanHistory({ limit: 4 }),
          complaintsService.getMyComplaints(user?.id),
        ]);

        setRecentScans(scansRes.scans?.slice(0, 4) || []);
        setRecentComplaints(complaintsRes.complaints?.slice(0, 3) || []);
      } catch (err) {
        console.warn('Failed to load user dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user]);

  const totalScans = recentScans.length > 0 ? 12 : 0;
  const looksGood = 8;
  const possibleIssues = 4;

  return (
    <div className="space-y-6">
      {/* ─── Citizen Welcome Greeting ─── */}
      <div className="p-6 sm:p-7 bg-gradient-to-r from-primary-950 via-primary-900 to-neutral-900 text-white rounded-2xl shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-300">
            Citizen Consumer Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Welcome, {user?.name || 'Citizen'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mt-1">
            Check any packaged product label for Legal Metrology compliance, detect missing declarations, and report statutory violations.
          </p>
        </div>

        <Link to="/app/user/scan">
          <Button
            variant="secondary"
            size="lg"
            icon={ScanLine}
            className="whitespace-nowrap bg-white text-primary-950 hover:bg-neutral-100 shadow-md font-bold text-sm"
          >
            Scan a Label
          </Button>
        </Link>
      </div>

      {/* ─── 3 Stat Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="My Scans"
          value={totalScans}
          change="Checked by you"
          trend="up"
          icon={ScanLine}
          variant="primary"
        />
        <StatCard
          title="Looks Good"
          value={looksGood}
          change="Compliant labels"
          trend="up"
          icon={CheckCircle2}
          variant="success"
        />
        <StatCard
          title="Possible Issues"
          value={possibleIssues}
          change="Violations or warnings"
          trend="down"
          icon={AlertTriangle}
          variant="warning"
        />
      </div>

      {/* ─── Big "Scan a Label" Call To Action Banner ─── */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-primary-600 via-primary-500 to-indigo-600 text-white shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="h-3.5 w-3.5" /> Instant AI Label Verification
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Bought a product with suspicious pricing or missing info?
          </h2>
          <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
            Take a photo of any grocery, beverage, or packaged item. Our AI will automatically verify MRP, Unit Sale Price (USP), Net Quantity, Expiry, and Manufacturer details.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 z-10 shrink-0">
          <Link to="/app/user/scan">
            <Button
              variant="secondary"
              size="lg"
              icon={Camera}
              className="bg-white text-primary-900 hover:bg-neutral-100 font-bold shadow-md"
            >
              Scan Label Now
            </Button>
          </Link>
          <Link to="/app/user/complaints/new">
            <Button
              variant="ghost"
              size="lg"
              icon={Plus}
              className="text-white border border-white/30 hover:bg-white/10"
            >
              Raise a Complaint
            </Button>
          </Link>
        </div>

        {/* Decorative background blur circle */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* ─── 2 Column Layout: Recent Scans & Recent Complaints ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: My Recent Scans */}
        <Card className="shadow-card">
          <CardHeader
            title="My Recent Scans"
            subtitle="Recent product packages you have verified"
            action={
              <Link to="/app/user/history">
                <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
                  View All
                </Button>
              </Link>
            }
          />

          {loading ? (
            <SkeletonList count={3} />
          ) : recentScans.length === 0 ? (
            <EmptyState
              icon={ScanLine}
              title="No scans yet"
              description="Upload your first product package to check its Legal Metrology compliance."
              actionLabel="Scan a Label"
              onAction={() => window.location.assign('/app/user/scan')}
            />
          ) : (
            <div className="space-y-3">
              {recentScans.map((item) => (
                <Link
                  key={item.id}
                  to={`/app/user/report/${item.id}`}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-surface-subtle hover:bg-surface-muted transition-colors group block"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-surface border border-border flex items-center justify-center text-primary-600 font-bold shrink-0 group-hover:scale-105 transition-transform">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
                        {item.product}
                      </h4>
                      <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                        {item.brand ? `${item.brand} • ` : ''}{item.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <StatusBadge status={item.status} size="sm" />
                    <Eye className="h-4 w-4 text-neutral-400 group-hover:text-neutral-700" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Right: My Recent Complaints */}
        <Card className="shadow-card">
          <CardHeader
            title="My Recent Complaints"
            subtitle="Track grievances you reported to Legal Metrology"
            action={
              <Link to="/app/user/complaints">
                <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
                  View All
                </Button>
              </Link>
            }
          />

          {loading ? (
            <SkeletonList count={3} />
          ) : recentComplaints.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No complaints submitted"
              description="Found a non-compliant or over-priced product? Report it directly to enforcement officers."
              actionLabel="Report a Product"
              actionIcon={Plus}
              onAction={() => window.location.assign('/app/user/complaints/new')}
            />
          ) : (
            <div className="space-y-3">
              {recentComplaints.map((item) => (
                <Link
                  key={item.id}
                  to={`/app/user/complaints/${item.id}`}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-surface-subtle hover:bg-surface-muted transition-colors group block"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-surface border border-border flex items-center justify-center text-amber-600 font-bold shrink-0 group-hover:scale-105 transition-transform">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                        Product: {item.productName} • {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <ComplaintStatusBadge status={item.status} size="sm" />
                    <Eye className="h-4 w-4 text-neutral-400 group-hover:text-neutral-700" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default UserDashboardPage;
