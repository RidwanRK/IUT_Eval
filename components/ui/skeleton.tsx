import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/** A placeholder block while content loads. Hidden from screen readers. */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn('animate-pulse-soft rounded-control bg-sunken', className)}
      {...props}
    />
  );
}
