import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const Card = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { padded?: boolean; raised?: boolean }
>(function Card({ className, padded = true, raised = false, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-card border-line bg-surface border',
        raised ? 'shadow-raised' : 'shadow-card',
        padded && 'p-5 sm:p-6',
        className,
      )}
      {...props}
    />
  );
});

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-lg font-bold tracking-tight', className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-muted text-[0.95rem]', className)} {...props} />;
}
