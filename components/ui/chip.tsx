'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * A selectable pill (a toggle). Selected state is solid red with a check icon,
 * so it never relies on colour alone. Use Badge for non-interactive labels.
 */
export const Chip = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean }
>(function Chip({ selected = false, className, children, type = 'button', ...props }, ref) {
  return (
    <button
      ref={ref}
      type={type}
      aria-pressed={selected}
      className={cn(
        'inline-flex min-h-12 items-center gap-2 rounded-full border px-4 text-[0.95rem] font-semibold transition-colors duration-150 active:scale-[0.98] disabled:opacity-50 motion-reduce:active:scale-100',
        selected
          ? 'border-brand bg-brand text-white'
          : 'border-line-strong bg-surface text-ink hover:bg-sunken',
        className,
      )}
      {...props}
    >
      {selected && <Check className="size-4 shrink-0" strokeWidth={3} aria-hidden />}
      {children}
    </button>
  );
});
