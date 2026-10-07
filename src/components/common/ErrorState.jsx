import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import Button from './Button';

/**
 * ErrorState component with retry action
 */
export const ErrorState = ({
  title = 'Something went wrong',
  description = 'An error occurred while fetching data. Please try again or contact support if the issue persists.',
  onRetry,
  retryLabel = 'Try Again',
  error,
  className = '',
}) => {
  const errorMessage = typeof error === 'string' ? error : error?.message;

  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl border border-error-500/20 bg-error-50/30 ${className}`}>
      <div className="h-12 w-12 rounded-2xl bg-error-100 text-error-600 border border-error-200 flex items-center justify-center mb-4">
        <AlertTriangle className="h-6 w-6" aria-hidden="true" />
      </div>

      <h3 className="text-base font-semibold text-neutral-900 tracking-tight">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-neutral-600 max-w-md mt-1 mb-2">
        {description}
      </p>

      {errorMessage && (
        <div className="text-xs font-mono bg-surface border border-error-200 text-error-700 px-3 py-1.5 rounded-md max-w-md break-all my-3">
          {errorMessage}
        </div>
      )}

      {onRetry && (
        <Button
          onClick={onRetry}
          variant="secondary"
          size="sm"
          icon={RotateCcw}
          className="mt-2"
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
