import { AlertTriangle } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Shared control styling. Borders hold 3:1 against white. */
export const controlClasses =
  'block w-full rounded-control border border-control bg-surface px-4 text-base text-ink placeholder:text-subtle transition-colors focus:border-ink focus-visible:outline-offset-1 disabled:bg-sunken disabled:text-muted';

/**
 * Label, control slot, hint and message. Validation messages use an amber treatment
 * with an icon and text, never red.
 */
export function Field({
  id,
  label,
  hint,
  error,
  children,
  className,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={id} className="text-[0.95rem] font-semibold">
          {label}
        </label>
      )}
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-muted text-sm">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${id}-error`}
          className="bg-warn-bg text-warn-ink flex items-start gap-2 rounded-lg px-3 py-2 text-sm font-medium"
        >
          <AlertTriangle className="text-warn-icon mt-0.5 size-4 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}

export function describedBy(id: string, hint?: string, error?: string): string | undefined {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}
