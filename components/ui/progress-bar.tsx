'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/** A slim progress bar. `label` is read out by screen readers. */
export function ProgressBar({
  value,
  max = 100,
  label,
  className,
}: {
  value: number;
  max?: number;
  label: string;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, max === 0 ? 0 : (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Math.round(value)}
      className={cn('bg-sunken h-2 w-full overflow-hidden rounded-full', className)}
    >
      <motion.div
        className="bg-brand h-full rounded-full"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </div>
  );
}
