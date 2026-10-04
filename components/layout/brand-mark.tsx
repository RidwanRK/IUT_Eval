import { institution } from '@/config/institution';
import { cn } from '@/lib/utils';

/** The app mark: a red rounded square with a white monogram, plus the app name. */
export function BrandMark({
  showName = true,
  size = 'md',
  className,
}: {
  showName?: boolean;
  size?: 'md' | 'lg';
  className?: string;
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span
        aria-hidden
        className={cn(
          'bg-brand flex items-center justify-center rounded-xl font-extrabold tracking-tight text-white',
          size === 'lg' ? 'size-14 text-xl' : 'size-10 text-base',
        )}
      >
        IE
      </span>
      {showName && (
        <span
          className={cn('font-extrabold tracking-tight', size === 'lg' ? 'text-3xl' : 'text-lg')}
        >
          {institution.appName}
        </span>
      )}
    </span>
  );
}
