import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldAlert,
  Download,
  History,
  RotateCcw,
  Calendar,
  Barcode,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import Badge from '../common/Badge';
import ProductInfoCard from './ProductInfoCard';
import ComplianceChecklistCard from './ComplianceChecklistCard';
import IssueCard from './IssueCard';

/**
 * ComplianceResult component rendering the complete audit dossier after scanning
 */
export const ComplianceResult = ({
  scanData,
  onScanAnother,
  historyUrl = '/app/officer/history',
}) => {
  if (!scanData) return null;

  const isCompliant = Boolean(scanData.isCompliant);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ─── Status Header Banner ─── */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
          isCompliant
            ? 'bg-gradient-to-r from-success-900 via-success-800 to-emerald-950 text-white border-success-700'
            : 'bg-gradient-to-r from-error-950 via-error-900 to-neutral-900 text-white border-error-700'
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
              isCompliant
                ? 'bg-success-500/30 text-success-300 border border-success-400/40'
                : 'bg-error-500/30 text-error-300 border border-error-400/40'
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
              <span
                className={`text-xs font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                  isCompliant
                    ? 'bg-success-500 text-white'
                    : 'bg-error-600 text-white'
                }`}
              >
                {isCompliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
              </span>
              <span className="text-xs font-mono text-neutral-300">
                Scan #{scanData.id || 'SCN-2026-001'}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {isCompliant
                ? 'This product label meets the required declarations'
                : 'Potential compliance issues were detected'}
            </h2>

            <p className="text-xs sm:text-sm text-neutral-200 max-w-2xl leading-relaxed">
              {scanData.summaryMessage ||
                (isCompliant
                  ? 'All mandatory Legal Metrology (Packaged Commodities) Rules 2011 declarations verified.'
                  : 'Action required: Review highlighted statutory violations below.')}
            </p>
          </div>
        </div>

        {/* Compliance Score Pill */}
        <div className="self-stretch md:self-auto bg-black/25 backdrop-blur-xs p-4 rounded-xl border border-white/10 flex md:flex-col items-center justify-between md:justify-center text-center min-w-[120px]">
          <span className="text-[11px] uppercase tracking-wider text-neutral-300 font-bold">
            PCR Score
          </span>
          <span className="text-2xl sm:text-3xl font-black text-white">
            {scanData.score !== undefined ? `${scanData.score}%` : '100%'}
          </span>
        </div>
      </div>

      {/* ─── Grid: Extracted Declarations & Statutory Checklist ─── */}
      <ProductInfoCard info={scanData.productInfo || {}} />

      <ComplianceChecklistCard checklist={scanData.checklist || []} />

      {/* ─── Issues List ─── */}
      <IssueCard issues={scanData.issues || []} />

      {/* ─── Action Footer ─── */}
      <Card className="p-4 sm:p-6 bg-surface-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
          <Calendar className="h-4 w-4" />
          <span>
            Audited on {new Date(scanData.scanDate || Date.now()).toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
          {/* Download Report (Disabled placeholder) */}
          <Button
            variant="secondary"
            size="md"
            icon={Download}
            disabled
            title="Statutory PDF Report Generation is available for official enforcement logs"
            className="w-full sm:w-auto"
          >
            Download Report (PDF)
          </Button>

          {/* View Scan History */}
          <Link to={historyUrl} className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="md"
              icon={History}
              className="w-full sm:w-auto"
            >
              View History
            </Button>
          </Link>

          {/* Scan Another Label */}
          {onScanAnother && (
            <Button
              variant="primary"
              size="md"
              icon={RotateCcw}
              onClick={onScanAnother}
              className="w-full sm:w-auto shadow-md"
            >
              Scan Another Label
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ComplianceResult;
