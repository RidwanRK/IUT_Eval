'use client';

import { ChevronDown } from 'lucide-react';
import { forwardRef, useId, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Field, controlClasses, describedBy } from './field';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  label: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  options: readonly SelectOption[];
}

/**
 * A styled native select. On phones the native picker is the easiest thing to use
 * one-handed, and it is fully accessible for free.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, placeholder, options, className, value, ...props },
  ref,
) {
  const id = useId();
  return (
    <Field id={id} label={label} hint={hint} error={error} className={className}>
      <div className="relative">
        <select
          ref={ref}
          id={id}
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          className={cn(
            controlClasses,
            'h-12 appearance-none pr-11',
            (value === '' || value === undefined) && 'text-subtle',
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value} className="text-ink">
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="text-muted pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2"
          aria-hidden
        />
      </div>
    </Field>
  );
});
