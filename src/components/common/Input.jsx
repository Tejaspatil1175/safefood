import React, { forwardRef, useState, useId } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

/**
 * Accessible Input component with label, error, helper text, and password toggle
 */
export const Input = forwardRef(({
  id: customId,
  label,
  type = 'text',
  error,
  helperText,
  icon: Icon,
  required = false,
  disabled = false,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const generatedId = useId();
  const inputId = customId || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-neutral-700 tracking-wide flex items-center gap-1"
        >
          <span>{label}</span>
          {required && <span className="text-error-600 font-bold" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-neutral-400 pointer-events-none flex items-center">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={effectiveType}
          disabled={disabled}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`
            w-full rounded-lg border bg-surface px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400
            transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-offset-1
            disabled:bg-surface-muted disabled:text-neutral-400 disabled:cursor-not-allowed
            ${Icon ? 'pl-9' : 'pl-3'}
            ${isPassword ? 'pr-10' : 'pr-3'}
            ${error
              ? 'border-error-500 text-error-900 focus:border-error-500 focus:ring-error-500/20'
              : 'border-border focus:border-primary-500 focus:ring-primary-500/20 hover:border-neutral-300'
            }
            ${className}
          `}
          {...props}
        />

        {isPassword && !disabled && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 p-1 text-neutral-400 hover:text-neutral-700 focus:outline-none focus:text-neutral-900 rounded transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      {error ? (
        <div id={errorId} className="flex items-center gap-1.5 text-xs text-error-600 font-medium mt-0.5">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-neutral-500 mt-0.5">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
