'use client';

import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Field, controlClasses, describedBy } from './field';

export interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string;
  hint?: string;
  error?: string;
  /** Show a live "n / max" counter. */
  showCount?: boolean;
  /** Hide the visible label but keep it for screen readers. */
  hideLabel?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, hint, error, showCount, hideLabel, className, value, maxLength, ...props },
  ref,
) {
  const id = useId();
  const length = typeof value === 'string' ? value.length : 0;
  return (
    <div className={className}>
      {hideLabel ? (
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
      ) : null}
      <Field id={id} label={hideLabel ? '' : label} hint={hint} error={error}>
        <textarea
          ref={ref}
          id={id}
          value={value}
          maxLength={maxLength}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          className={cn(controlClasses, 'min-h-32 resize-y py-3 leading-relaxed')}
          {...props}
        />
        {showCount && maxLength && (
          <p className="tabular text-muted text-right text-sm" aria-live="off">
            {length} / {maxLength}
          </p>
        )}
      </Field>
    </div>
  );
});
