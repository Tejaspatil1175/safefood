import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Clock, ShieldCheck } from 'lucide-react';

/**
 * Compliance Status Badge
 * compliant=green, non-compliant=red, warning=amber, pending=gray
 */
export const StatusBadge = ({ status = 'pending', className = '', size = 'md' }) => {
  const normalized = String(status || '').toLowerCase().replace(/[\s_]+/g, '-');

  let config = {
    label: 'Pending',
    variant: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    icon: Clock,
  };

  if (
    normalized === 'compliant' ||
    normalized === 'passed' ||
    normalized === 'resolved' ||
    normalized === 'active' ||
    normalized === 'approved'
  ) {
    config = {
      label: 'Compliant',
      variant: 'bg-success-50 text-success-700 border-success-500/20',
      icon: CheckCircle2,
    };
  } else if (
    normalized === 'non-compliant' ||
    normalized === 'violation' ||
    normalized === 'rejected' ||
    normalized === 'failed' ||
    normalized === 'notice-issued'
  ) {
    config = {
      label: 'Non-Compliant',
      variant: 'bg-error-50 text-error-700 border-error-500/20',
      icon: XCircle,
    };
  } else if (
    normalized === 'warning' ||
    normalized === 'partially-compliant' ||
    normalized === 'under-review' ||
    normalized === 'in-progress' ||
    normalized === 'flagged'
  ) {
    config = {
      label: 'Warning',
      variant: 'bg-warning-50 text-warning-700 border-warning-500/20',
      icon: AlertTriangle,
    };
  }

  const IconComponent = config.icon;

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-0.5 gap-1.5',
    lg: 'text-sm px-3 py-1 gap-2',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border shadow-2xs ${sizeStyles[size] || sizeStyles.md} ${config.variant} ${className}`}
    >
      <IconComponent className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
