import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * SaaS Metric StatCard component
 */
export const StatCard = ({
  title,
  value,
  change,
  trend = 'neutral', // 'up' | 'down' | 'neutral'
  changeLabel = 'vs last month',
  icon: Icon,
  variant = 'primary', // 'primary' | 'success' | 'warning' | 'error' | 'neutral'
  className = '',
  loading = false,
}) => {
  const iconVariantStyles = {
    primary: 'bg-primary-50 text-primary-600 border-primary-200/60',
    success: 'bg-success-50 text-success-600 border-success-500/20',
    warning: 'bg-warning-50 text-warning-600 border-warning-500/20',
    error: 'bg-error-50 text-error-600 border-error-500/20',
    neutral: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  };

  const getTrendBadge = () => {
    if (!change) return null;

    if (trend === 'up') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-success-600">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>{change}</span>
        </span>
      );
    }
    if (trend === 'down') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-error-600">
          <TrendingDown className="h-3.5 w-3.5" />
          <span>{change}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-500">
        <Minus className="h-3.5 w-3.5" />
        <span>{change}</span>
      </span>
    );
  };

  if (loading) {
    return (
      <div className={`p-6 rounded-xl border border-border bg-surface shadow-card animate-pulse ${className}`}>
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-neutral-200 rounded" />
          <div className="h-10 w-10 bg-neutral-200 rounded-xl" />
        </div>
        <div className="h-8 w-16 bg-neutral-200 rounded mt-3" />
        <div className="h-3 w-32 bg-neutral-200 rounded mt-2" />
      </div>
    );
  }

  return (
    <div
      className={`p-6 rounded-xl border border-border bg-surface shadow-card hover:shadow-card-hover transition-all duration-200 ${className}`}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div
            className={`h-10 w-10 rounded-xl border flex items-center justify-center shrink-0 ${iconVariantStyles[variant] || iconVariantStyles.primary}`}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="mt-2">
        <p className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
          {value}
        </p>
      </div>

      {(change || changeLabel) && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-neutral-500">
          {getTrendBadge()}
          {changeLabel && <span>{changeLabel}</span>}
        </div>
      )}
    </div>
  );
};

export default StatCard;
