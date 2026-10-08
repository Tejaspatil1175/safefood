import React, { forwardRef, useId } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

/**
 * Accessible Dropdown / Select component
 */
export const Select = forwardRef(({
  id: customId,
  label,
  options = [],
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const generatedId = useId();
  const selectId = customId || generatedId;
  const errorId = `${selectId}-error`;
  const helperId = `${selectId}-helper`;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-semibold text-neutral-700 tracking-wide flex items-center gap-1"
        >
          <span>{label}</span>
          {required && <span className="text-error-600 font-bold" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        <select
          ref={ref}
          id={selectId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`
            w-full appearance-none rounded-lg border bg-surface px-3 py-2 text-sm text-neutral-900
            transition-colors duration-150 pr-9
            focus:outline-none focus:ring-2 focus:ring-offset-1
            disabled:bg-surface-muted disabled:text-neutral-400 disabled:cursor-not-allowed
            ${error
              ? 'border-error-500 text-error-900 focus:border-error-500 focus:ring-error-500/20'
              : 'border-border focus:border-primary-500 focus:ring-primary-500/20 hover:border-neutral-300'
            }
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            if (typeof opt === 'string') {
              return (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              );
            }
            return (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            );
          })}
        </select>

        <div className="absolute right-3 pointer-events-none text-neutral-400 flex items-center">
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </div>
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

Select.displayName = 'Select';

export default Select;
