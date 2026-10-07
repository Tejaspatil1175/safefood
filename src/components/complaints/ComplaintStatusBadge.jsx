import React from 'react';
import {
  Clock,
  UserCheck,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';

/**
 * Complaint Status Badge
 * Handles statuses:
 * - submitted: Gray/Amber
 * - assigned: Blue
 * - under_investigation: Amber/Indigo
 * - verified_genuine: Emerald Green
 * - verified_not_genuine: Rose Red
 */
export const ComplaintStatusBadge = ({ status = 'submitted', className = '', size = 'md' }) => {
  const normalized = String(status || '').toLowerCase().replace(/[\s-]+/g, '_');

  let config = {
    label: 'Submitted',
    variant: 'bg-neutral-100 text-neutral-700 border-neutral-300',
    icon: Clock,
  };

  switch (normalized) {
    case 'submitted':
    case 'pending':
      config = {
        label: 'Submitted',
        variant: 'bg-neutral-100 text-neutral-700 border-neutral-300',
        icon: Clock,
      };
      break;

    case 'assigned':
      config = {
        label: 'Assigned to Officer',
        variant: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: UserCheck,
      };
      break;

    case 'under_investigation':
    case 'investigating':
    case 'in_progress':
      config = {
        label: 'Under Investigation',
        variant: 'bg-amber-50 text-amber-800 border-amber-300',
        icon: Search,
      };
      break;

    case 'verified_genuine':
    case 'genuine':
    case 'violation_confirmed':
      config = {
        label: 'Verified Genuine',
        variant: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        icon: CheckCircle2,
      };
      break;

    case 'verified_not_genuine':
    case 'not_genuine':
    case 'dismissed':
    case 'rejected':
      config = {
        label: 'Marked Not Genuine',
        variant: 'bg-rose-50 text-rose-800 border-rose-300',
        icon: XCircle,
      };
      break;

    default:
      config = {
        label: status,
        variant: 'bg-neutral-100 text-neutral-700 border-neutral-300',
        icon: AlertTriangle,
      };
  }

  const IconComponent = config.icon;

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-0.5 gap-1.5',
    lg: 'text-sm px-3.5 py-1 gap-2',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border shadow-2xs transition-colors ${sizeStyles[size] || sizeStyles.md} ${config.variant} ${className}`}
    >
      <IconComponent className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
};

export default ComplaintStatusBadge;
