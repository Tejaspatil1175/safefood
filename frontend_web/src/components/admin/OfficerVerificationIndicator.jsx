import React from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  UserX,
  UserCheck,
  UserPlus,
} from 'lucide-react';

/**
 * Reusable Officer Verification Indicator
 * Shows officer's name PLUS a live statutory verification status indicator
 */
export const OfficerVerificationIndicator = ({
  officer,
  status = 'submitted',
  onAssign,
  compact = false,
  className = '',
}) => {
  // If no officer is assigned
  if (!officer || !officer.name || status === 'submitted') {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        {onAssign ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAssign();
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200 transition-colors shadow-2xs"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Assign</span>
          </button>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-neutral-400 italic">
            <UserX className="h-3.5 w-3.5" />
            <span>Unassigned</span>
          </span>
        )}
      </div>
    );
  }

  const officerName = officer.name;

  // Normalized status determination
  const normalized = String(status || '').toLowerCase();

  if (normalized === 'verified_genuine' || normalized === 'genuine') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 ${className}`}
        title="Complaint verified - the complaint is genuine"
      >
        <span className="text-xs font-semibold text-neutral-800 truncate max-w-[130px]">
          {officerName}
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          <span>Verified Genuine</span>
        </span>
      </div>
    );
  }

  if (normalized === 'verified_not_genuine' || normalized === 'not_genuine' || normalized === 'dismissed') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 ${className}`}
        title="Investigated - complaint not genuine"
      >
        <span className="text-xs font-semibold text-neutral-800 truncate max-w-[130px]">
          {officerName}
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300 shrink-0">
          <XCircle className="h-3.5 w-3.5 text-rose-600" />
          <span>Not Genuine</span>
        </span>
      </div>
    );
  }

  if (normalized === 'under_investigation' || normalized === 'investigating') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 ${className}`}
        title="Field investigation currently in progress"
      >
        <span className="text-xs font-semibold text-neutral-800 truncate max-w-[130px]">
          {officerName}
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 shrink-0">
          <Search className="h-3 w-3 text-amber-600" />
          <span>Investigating</span>
        </span>
      </div>
    );
  }

  // Assigned (pending audit)
  return (
    <div
      className={`inline-flex items-center gap-1.5 ${className}`}
      title="Officer assigned - pending field audit"
    >
      <span className="text-xs font-semibold text-neutral-800 truncate max-w-[130px]">
        {officerName}
      </span>
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-neutral-100 text-neutral-600 border border-neutral-300 shrink-0">
        <Clock className="h-3 w-3 text-neutral-500" />
        <span>Pending Audit</span>
      </span>
    </div>
  );
};

export default OfficerVerificationIndicator;
