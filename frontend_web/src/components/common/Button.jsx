import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable accessible Button component
 * @param {'primary'|'secondary'|'danger'|'ghost'|'outline'} [variant='primary']
 * @param {'sm'|'md'|'lg'} [size='md']
 * @param {boolean} [isLoading=false]
 * @param {boolean} [disabled=false]
 * @param {React.ElementType} [icon]
 * @param {'left'|'right'} [iconPosition='left']
 */
export const Button = forwardRef(({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  loadingText,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg select-none focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-md h-8',
    md: 'text-sm px-4 py-2 gap-2 rounded-lg h-10',
    lg: 'text-base px-5 py-2.5 gap-2.5 rounded-xl h-12',
  };

  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm focus:ring-primary-500 border border-transparent',
    secondary: 'bg-surface text-neutral-700 border border-border hover:bg-surface-muted hover:text-neutral-900 active:bg-neutral-200 focus:ring-primary-500 shadow-xs',
    outline: 'border border-primary-600 text-primary-600 bg-transparent hover:bg-primary-50 active:bg-primary-100 focus:ring-primary-500',
    danger: 'bg-error-600 text-white hover:bg-error-700 active:bg-error-800 shadow-sm focus:ring-error-500 border border-transparent',
    ghost: 'text-neutral-600 bg-transparent hover:bg-surface-muted hover:text-neutral-900 focus:ring-neutral-400 border border-transparent',
  };

  const isBtnDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isBtnDisabled}
      aria-busy={isLoading}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
          <span>{loadingText || children}</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
