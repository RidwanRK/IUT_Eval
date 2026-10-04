'use client';

import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Field, controlClasses, describedBy } from './field';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  hint?: string;
  error?: string;
  /** Extra content on the right inside the box, such as a show/hide button. */
  trailing?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, trailing, className, ...props },
  ref,
) {
  const id = useId();
  return (
    <Field id={id} label={label} hint={hint} error={error} className={className}>
      <div className="relative">
        <input
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          className={cn(controlClasses, 'h-12', trailing && 'pr-14')}
          {...props}
        />
        {trailing && <div className="absolute inset-y-0 right-1 flex items-center">{trailing}</div>}
      </div>
    </Field>
  );
});
