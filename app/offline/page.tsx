import type { Metadata } from 'next';
import { WifiOff } from 'lucide-react';
import { copy } from '@/config/copy';
import { BrandMark } from '@/components/layout/brand-mark';
import { RetryButton } from './retry-button';

export const metadata: Metadata = { title: 'Offline', robots: { index: false } };

/** Shown by the service worker when a page is not available and there is no connection. */
export default function OfflinePage() {
  const t = copy.offline;
  return (
    <main
      className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 py-12 text-center"
      style={{ paddingBottom: 'max(3rem, var(--safe-bottom))' }}
    >
      <BrandMark />
      <span className="bg-warn-bg text-warn-icon mt-10 flex size-16 items-center justify-center rounded-full">
        <WifiOff className="size-8" aria-hidden />
      </span>
      <h1 className="mt-5 text-3xl font-extrabold tracking-tight">{t.title}</h1>
      <p className="text-muted mt-3">{t.body}</p>
      <p className="text-muted mt-2">{t.sendNote}</p>
      <RetryButton label={t.retry} />
    </main>
  );
}
