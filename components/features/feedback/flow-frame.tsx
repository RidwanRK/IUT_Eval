import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Full-screen frame for the feedback flow: a header, a scrolling middle and a bottom action
 * bar that respects the phone's safe area. The middle scrolls on its own, so short landscape
 * phones still reach every control.
 */
export function FlowFrame({
  header,
  footer,
  children,
  className,
}: {
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="bg-canvas flex h-dvh flex-col">
      {header && (
        <header
          className="border-line bg-surface shrink-0 border-b"
          style={{ paddingTop: 'var(--safe-top)' }}
        >
          {header}
        </header>
      )}
      <main id="main" className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className={cn('mx-auto w-full max-w-xl px-4 py-6 sm:py-10', className)}>
          {children}
        </div>
      </main>
      {footer && (
        <footer
          className="border-line bg-surface shrink-0 border-t"
          style={{ paddingBottom: 'var(--safe-bottom)' }}
        >
          <div className="mx-auto w-full max-w-xl px-4 py-3">{footer}</div>
        </footer>
      )}
    </div>
  );
}
