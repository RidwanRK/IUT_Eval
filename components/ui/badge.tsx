import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type BadgeTone = 'neutral' | 'brand' | 'success' | 'warn' | 'ink';

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-sunken text-muted',
  brand: 'bg-brand-50 text-brand',
  success: 'bg-ok-bg text-ok-ink',
  warn: 'bg-warn-bg text-warn-ink',
  ink: 'bg-ink text-white',
};

/** A small non-interactive label. Always pair colour with text (and usually an icon). */
export function Badge({
  tone = 'neutral',
  icon,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone; icon?: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs leading-none font-semibold whitespace-nowrap',
        tones[tone],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </span>
  );
}
