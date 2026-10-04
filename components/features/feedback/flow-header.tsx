import { X } from 'lucide-react';
import Link from 'next/link';
import { copy } from '@/config/copy';
import { ProgressBar } from '@/components/ui/progress-bar';

const t = copy.flow;

/** Slim header: leave button, section name, time left, and a progress bar. */
export function FlowHeader({
  sectionTitle,
  progress,
  total,
  minutesLeft,
  counter,
  leaveHref = '/student',
}: {
  sectionTitle: string;
  progress: number;
  total: number;
  minutesLeft: number | null;
  counter?: string;
  leaveHref?: string;
}) {
  return (
    <div className="mx-auto w-full max-w-xl px-2 pt-1 pb-3 sm:px-4">
      <div className="flex items-center gap-1">
        <Link
          href={leaveHref}
          aria-label={`${t.exit}. ${t.exitHint}`}
          className="hover:bg-sunken flex size-12 shrink-0 items-center justify-center rounded-full"
        >
          <X className="size-5" aria-hidden />
        </Link>
        <div className="flex min-w-0 flex-1 items-baseline justify-between gap-3 pr-2">
          <p className="truncate text-sm font-bold">{sectionTitle}</p>
          <p className="text-muted tabular shrink-0 text-sm">
            {counter && <span className="sr-only">{counter}. </span>}
            {minutesLeft !== null && t.question.minutesLeft(minutesLeft)}
          </p>
        </div>
      </div>
      <div className="px-2 sm:px-0">
        <ProgressBar value={progress} max={total} label={t.question.progress} className="h-1.5" />
      </div>
    </div>
  );
}
