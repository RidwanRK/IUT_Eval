import { AlertTriangle } from 'lucide-react';
import { copy } from '@/config/copy';
import { Button } from './button';
import { cn } from '@/lib/utils';

/**
 * Something did not load. Amber with an icon and text, never red: red is our brand colour,
 * not an error colour.
 */
export function ErrorState({
  title = copy.common.errorTitle,
  body = copy.common.errorBody,
  onRetry,
  className,
}: {
  title?: string;
  body?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-card border-warn-line bg-warn-bg flex flex-col items-center border px-5 py-8 text-center',
        className,
      )}
    >
      <AlertTriangle className="text-warn-icon mb-3 size-8" aria-hidden />
      <h2 className="text-warn-ink text-lg font-bold tracking-tight">{title}</h2>
      <p className="text-warn-ink mt-1.5 max-w-sm text-[0.95rem]">{body}</p>
      {onRetry && (
        <Button variant="secondary" className="mt-5" onClick={onRetry}>
          {copy.common.retry}
        </Button>
      )}
    </div>
  );
}
