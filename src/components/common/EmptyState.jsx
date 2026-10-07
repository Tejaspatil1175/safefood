import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';

/**
 * EmptyState component for empty lists, scans, grievances, tables
 */
export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No items found',
  description = 'There are currently no records available to display.',
  actionLabel,
  onAction,
  actionIcon,
  className = '',
  children,
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl border border-dashed border-border bg-surface-subtle ${className}`}>
      <div className="h-12 w-12 rounded-2xl bg-neutral-100 border border-neutral-200 text-neutral-500 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>

      <h3 className="text-base font-semibold text-neutral-900 tracking-tight">
        {title}
      </h3>

      {description && (
        <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mt-1 mb-5">
          {description}
        </p>
      )}

      {children}

      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant="primary"
          size="sm"
          icon={actionIcon}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
