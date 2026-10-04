import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  body?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center px-4 py-10 text-center', className)}>
      {Icon && (
        <span className="bg-brand-50 text-brand mb-4 flex size-14 items-center justify-center rounded-full">
          <Icon className="size-7" aria-hidden />
        </span>
      )}
      <h2 className="text-lg font-bold tracking-tight">{title}</h2>
      {body && <p className="text-muted mt-1.5 max-w-sm text-[0.95rem]">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
