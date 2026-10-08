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
  AlertTriangle,
  Flag,
} from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import Badge from '../common/Badge';
import ProductInfoCard from './ProductInfoCard';
import ComplianceChecklistCard from './ComplianceChecklistCard';
import IssueCard from './IssueCard';

/**
 * ComplianceResult component rendering the audit dossier after scanning
 * Supports `simplified={true}` for citizen/consumer user experience
 */
export const ComplianceResult = ({
  scanData,
  onScanAnother,
  historyUrl = '/app/officer/history',
  simplified = false,
}) => {
  if (!scanData) return null;

  const isCompliant = Boolean(scanData.isCompliant);
  const productName = scanData.productInfo?.productName || scanData.product || 'Sampled Product';
  const scanId = scanData.id || 'SCN-2026-001';

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
                Scan #{scanId}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {simplified
                ? isCompliant
                  ? 'This label looks fine!'
                  : 'We found possible problems with this label'
                : isCompliant
                ? 'This product label meets the required declarations'
                : 'Potential compliance issues were detected'}
            </h2>

            <p className="text-xs sm:text-sm text-neutral-200 max-w-2xl leading-relaxed">
              {simplified
                ? isCompliant
                  ? 'All standard mandatory consumer declarations (MRP, Quantity, Manufacturer info) are present and verified.'
                  : 'This packaging may violate Legal Metrology rules (e.g. missing Unit Sale Price or font size issues). You can submit a citizen grievance below.'
                : scanData.summaryMessage ||
                  (isCompliant
                    ? 'All mandatory Legal Metrology (Packaged Commodities) Rules 2011 declarations verified.'
                    : 'Action required: Review highlighted statutory violations below.')}
            </p>
          </div>
        </div>

        {/* Compliance Score Pill */}
        <div className="self-stretch md:self-auto bg-black/25 backdrop-blur-xs p-4 rounded-xl border border-white/10 flex md:flex-col items-center justify-between md:justify-center text-center min-w-[120px]">
          <span className="text-[11px] uppercase tracking-wider text-neutral-300 font-bold">
            Compliance Score
          </span>
          <span className="text-2xl sm:text-3xl font-black text-white">
            {scanData.score !== undefined ? `${scanData.score}%` : '100%'}
          </span>
        </div>
      </div>

      {/* ─── Simplified Report CTA for Citizen if Non-Compliant ─── */}
      {simplified && !isCompliant && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-950">
                Want to report this product to Legal Metrology officers?
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                Our enforcement team investigates verified consumer complaints and issues statutory notices.
              </p>
            </div>
          </div>

          <Link
            to={`/app/user/complaints/new?product=${encodeURIComponent(productName)}&scanId=${encodeURIComponent(scanId)}`}
            className="w-full sm:w-auto shrink-0"
          >
            <Button
              variant="primary"
              size="md"
              icon={Flag}
              className="bg-amber-700 hover:bg-amber-800 text-white font-bold w-full sm:w-auto shadow-sm"
            >
              Report this Product
            </Button>
          </Link>
        </div>
      )}

      {/* ─── Product Information Card ─── */}
      <ProductInfoCard info={scanData.productInfo || {}} />

      {/* ─── Simplified Checklist Card ─── */}
      <ComplianceChecklistCard checklist={scanData.checklist || []} />

      {/* ─── Issues List (Only if present) ─── */}
      {scanData.issues && scanData.issues.length > 0 && (
        <IssueCard issues={scanData.issues || []} />
      )}

      {/* ─── Action Footer ─── */}
      <Card className="p-4 sm:p-6 bg-surface-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
          <Calendar className="h-4 w-4" />
          <span>
            Verified on {new Date(scanData.scanDate || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
          {/* Report CTA in footer if non-compliant and in simplified mode */}
          {simplified && !isCompliant && (
            <Link
              to={`/app/user/complaints/new?product=${encodeURIComponent(productName)}&scanId=${encodeURIComponent(scanId)}`}
              className="w-full sm:w-auto"
            >
              <Button
                variant="primary"
                size="md"
                icon={Flag}
                className="bg-error-600 hover:bg-error-700 text-white font-bold w-full sm:w-auto"
              >
                Report Product
              </Button>
            </Link>
          )}

          {/* View Scan History */}
          <Link to={historyUrl} className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="md"
              icon={History}
              className="w-full sm:w-auto"
            >
              My History
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
