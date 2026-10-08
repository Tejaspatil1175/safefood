import React from 'react';
import {
  Clock,
  UserCheck,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  User,
  Calendar,
  ShieldAlert,
} from 'lucide-react';
import ComplaintStatusBadge from './ComplaintStatusBadge';

/**
 * Format ISO timestamp into clean user-friendly string
 */
const formatTimestamp = (dateStr) => {
  if (!dateStr) return 'Date unknown';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
};

const getTimelineStepIcon = (status) => {
  const normalized = String(status || '').toLowerCase().replace(/[\s-]+/g, '_');
  switch (normalized) {
    case 'submitted':
      return <Clock className="h-4 w-4 text-neutral-600" />;
    case 'assigned':
      return <UserCheck className="h-4 w-4 text-blue-600" />;
    case 'under_investigation':
      return <Search className="h-4 w-4 text-amber-600" />;
    case 'verified_genuine':
      return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
    case 'verified_not_genuine':
      return <XCircle className="h-4 w-4 text-rose-600" />;
    default:
      return <AlertCircle className="h-4 w-4 text-neutral-600" />;
  }
};

const getTimelineStepBg = (status) => {
  const normalized = String(status || '').toLowerCase().replace(/[\s-]+/g, '_');
  switch (normalized) {
    case 'submitted':
      return 'bg-neutral-100 border-neutral-300 ring-neutral-200';
    case 'assigned':
      return 'bg-blue-50 border-blue-300 ring-blue-100';
    case 'under_investigation':
      return 'bg-amber-50 border-amber-300 ring-amber-100';
    case 'verified_genuine':
      return 'bg-emerald-50 border-emerald-300 ring-emerald-100';
    case 'verified_not_genuine':
      return 'bg-rose-50 border-rose-300 ring-rose-100';
    default:
      return 'bg-neutral-100 border-neutral-300 ring-neutral-200';
  }
};

export const ComplaintTimeline = ({ timeline = [], className = '' }) => {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="py-6 text-center text-xs text-neutral-400">
        No timeline events recorded yet.
      </div>
    );
  }

  return (
    <div className={`relative pl-4 sm:pl-6 ${className}`}>
      {/* Vertical Track Line */}
      <div className="absolute left-[27px] sm:left-[35px] top-4 bottom-4 w-0.5 bg-border -translate-x-1/2 pointer-events-none" />

      <div className="space-y-6">
        {timeline.map((event, index) => {
          const isLatest = index === timeline.length - 1;

          return (
            <div key={index} className="relative flex items-start gap-3 sm:gap-4 group">
              {/* Icon Marker Node */}
              <div
                className={`
                  relative z-10 flex items-center justify-center h-8 w-8 rounded-full border-2 ring-4
                  shrink-0 transition-transform group-hover:scale-105 shadow-xs
                  ${getTimelineStepBg(event.status)}
                `}
              >
                {getTimelineStepIcon(event.status)}
              </div>

              {/* Event Content Box */}
              <div className="flex-1 bg-surface rounded-xl border border-border p-3.5 sm:p-4 shadow-2xs hover:border-neutral-300 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-border/60">
                  <div className="flex items-center gap-2 flex-wrap">
                    <ComplaintStatusBadge status={event.status} size="sm" />
                    {isLatest && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-primary-100 text-primary-800">
                        Current Status
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-medium">
                    <Calendar className="h-3 w-3 text-neutral-400" />
                    <span>{formatTimestamp(event.at)}</span>
                  </div>
                </div>

                {/* Actor & Action Note */}
                <div className="mt-2 text-xs text-neutral-700 leading-relaxed space-y-1.5">
                  {event.note && (
                    <p className="text-neutral-800 font-normal">
                      {event.note}
                    </p>
                  )}
                  {event.by && (
                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 pt-1">
                      <User className="h-3 w-3 text-neutral-400" />
                      <span>Action by: <strong className="text-neutral-700 font-medium">{event.by}</strong></span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComplaintTimeline;
