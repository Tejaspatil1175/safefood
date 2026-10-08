import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Printer,
  Download,
  Calendar,
  User,
  MapPin,
  Cpu,
  Store,
  FileCheck2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  FileText,
} from 'lucide-react';
import scanService from '../../services/scan';
import Card, { CardHeader } from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import Badge from '../../components/common/Badge';
import { SkeletonCard } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import {
  ProductInfoCard,
  ComplianceChecklistCard,
  IssueCard,
  RecommendationCard,
} from '../../components/reports';
import { useToast } from '../../components/common/Toast';

export const OfficerReportPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await scanService.getScanById(id);
      if (!data) {
        setError('Report not found');
      } else {
        setReport(data);
      }
    } catch (err) {
      console.error('Failed to fetch inspection report', err);
      setError('Report not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleIssueNotice = () => {
    toast.info(`Statutory Rectification Notice drafted for ${report?.productName || 'Commodity'}.`, 'Statutory Notice Drafted');
  };

  // ─── Loading Skeleton ───
  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
        <div className="flex items-center justify-between">
          <SkeletonCard className="h-10 w-48" />
          <SkeletonCard className="h-10 w-32" />
        </div>
        <SkeletonCard className="h-40" />
        <SkeletonCard className="h-60" />
        <SkeletonCard className="h-60" />
      </div>
    );
  }

  // ─── 404 / Not Found State ───
  if (error || !report) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <EmptyState
          icon={AlertTriangle}
          title="Inspection Report Not Found"
          description={`No Legal Metrology audit record exists for reference ID "${id}". It may have been archived or removed.`}
          actionLabel="Back to Scan History"
          actionIcon={ArrowLeft}
          onAction={() => navigate('/app/officer/history')}
        />
      </div>
    );
  }

  const isCompliant = Boolean(report.isCompliant);

  return (
    <div className="space-y-8 max-w-5xl mx-auto print:p-0">
      {/* ─── Breadcrumb & Top Bar (Hidden on print) ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <Link
          to="/app/officer/history"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Scan History</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            icon={Printer}
            onClick={handlePrint}
          >
            Print Dossier
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            disabled
            title="Download signed statutory PDF"
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* ─── Report Header ─── */}
      <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-border shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div
            className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
              isCompliant
                ? 'bg-success-50 text-success-700 border border-success-500/30'
                : 'bg-error-50 text-error-700 border border-error-500/30'
            }`}
          >
            {isCompliant ? (
              <ShieldCheck className="h-8 w-8" />
            ) : (
              <ShieldAlert className="h-8 w-8" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-700">
                Official Legal Metrology Audit
              </span>
              <span className="text-xs font-mono text-neutral-400">•</span>
              <span className="text-xs font-mono font-bold text-neutral-800">
                {report.id}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              TrustLabel Inspection Report
            </h1>

            <p className="text-xs sm:text-sm text-neutral-500">
              Audited on {new Date(report.scanDate || Date.now()).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-2">
          <StatusBadge status={report.verdict || (isCompliant ? 'compliant' : 'non-compliant')} size="lg" />
          <span className="text-xs font-semibold text-neutral-500">
            PCR Score: <strong className="text-neutral-900">{report.score || 100}%</strong>
          </span>
        </div>
      </div>

      {/* ─── Section 1: Scan & Inspection Metadata ─── */}
      <Card className="p-6">
        <CardHeader
          title="1. Inspection Metadata & Statutory Jurisdiction"
          subtitle="Chain-of-custody details for statutory surveillance record"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-surface-subtle border border-border flex items-start gap-2.5">
            <User className="h-4 w-4 text-primary-600 mt-0.5 shrink-0" />
            <div>
              <span className="text-[11px] text-neutral-500 block">Inspected By</span>
              <span className="font-semibold text-neutral-900">
                {report.inspectedBy || 'Inspector Priya Verma'}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-subtle border border-border flex items-start gap-2.5">
            <MapPin className="h-4 w-4 text-primary-600 mt-0.5 shrink-0" />
            <div>
              <span className="text-[11px] text-neutral-500 block">Jurisdiction Zone</span>
              <span className="font-semibold text-neutral-900">
                {report.jurisdiction || 'State Legal Metrology Cell - North Division'}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-subtle border border-border flex items-start gap-2.5">
            <Store className="h-4 w-4 text-primary-600 mt-0.5 shrink-0" />
            <div>
              <span className="text-[11px] text-neutral-500 block">Sampled Retail Premises</span>
              <span className="font-semibold text-neutral-900">
                {report.outlet || 'Metro Mart Supermarket #14'}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-subtle border border-border flex items-start gap-2.5">
            <Calendar className="h-4 w-4 text-primary-600 mt-0.5 shrink-0" />
            <div>
              <span className="text-[11px] text-neutral-500 block">Sampling Timestamp</span>
              <span className="font-semibold text-neutral-900">
                {new Date(report.scanDate || Date.now()).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-subtle border border-border flex items-start gap-2.5">
            <Cpu className="h-4 w-4 text-primary-600 mt-0.5 shrink-0" />
            <div>
              <span className="text-[11px] text-neutral-500 block">OCR Vision Confidence</span>
              <span className="font-semibold text-success-700">
                {report.ocrConfidence || '98.8%'}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-subtle border border-border flex items-start gap-2.5">
            <FileText className="h-4 w-4 text-primary-600 mt-0.5 shrink-0" />
            <div>
              <span className="text-[11px] text-neutral-500 block">Governing Rule</span>
              <span className="font-semibold text-neutral-900">
                PCR Rules 2011 (Rule 6 to 12)
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* ─── Section 2 & 3: Product Information & Extracted Declarations ─── */}
      <ProductInfoCard info={report.productInfo || {}} />

      {/* ─── Section 4: Statutory Compliance Checklist ─── */}
      <ComplianceChecklistCard checklist={report.checklist || []} />

      {/* ─── Section 5: Detected Issues ─── */}
      <IssueCard issues={report.issues || []} />

      {/* ─── Section 6: Statutory Recommendations ─── */}
      <RecommendationCard
        isCompliant={isCompliant}
        recommendations={report.recommendations || []}
      />

      {/* ─── Section 7: Report Actions ─── */}
      <Card className="p-6 bg-surface-subtle flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <div>
          <h4 className="text-sm font-bold text-neutral-900">
            Enforcement Officer Actions
          </h4>
          <p className="text-xs text-neutral-500 mt-0.5">
            Take statutory administrative action on this inspection record
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          <Link to="/app/officer/history">
            <Button variant="secondary" size="md" icon={ArrowLeft}>
              Back to History
            </Button>
          </Link>

          {!isCompliant && (
            <Button
              variant="danger"
              size="md"
              icon={ShieldAlert}
              onClick={handleIssueNotice}
            >
              Issue Notice
            </Button>
          )}

          <Link to="/app/officer/scan">
            <Button variant="primary" size="md" icon={Sparkles}>
              Inspect Another Label
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default OfficerReportPage;
