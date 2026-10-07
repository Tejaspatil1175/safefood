import React from 'react';

/**
 * General Pill & Badge component
 */
export const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-0.5 gap-1.5',
    lg: 'text-sm px-3 py-1 gap-2',
  };

  const variantStyles = {
    primary: 'bg-primary-50 text-primary-700 border border-primary-200/80',
    success: 'bg-success-50 text-success-700 border border-success-500/20',
    warning: 'bg-warning-50 text-warning-700 border border-warning-500/20',
    error: 'bg-error-50 text-error-700 border border-error-500/20',
    info: 'bg-sky-50 text-sky-700 border border-sky-500/20',
    neutral: 'bg-neutral-100 text-neutral-700 border border-neutral-200',
  };

  const dotColorStyles = {
    primary: 'bg-primary-600',
    success: 'bg-success-600',
    warning: 'bg-warning-600',
    error: 'bg-error-600',
    info: 'bg-sky-600',
    neutral: 'bg-neutral-500',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.neutral} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${dotColorStyles[variant] || dotColorStyles.neutral}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
