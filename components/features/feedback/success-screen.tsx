'use client';

import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { copy } from '@/config/copy';
import { buttonStyles } from '@/components/ui/button';
import { useService } from '@/lib/hooks/use-service';
import { getNextPendingFeedback } from '@/lib/services/feedback';
import { formatShortDate } from '@/lib/services/window-logic';
import type { AnswerMap, WindowType } from '@/lib/types';
import { ClassSnapshotCard } from './class-snapshot';

const t = copy.flow.success;

export function SuccessScreen({
  assignmentId,
  window,
  updated,
  closesAt,
  answers,
}: {
  assignmentId: string;
  window: WindowType;
  updated: boolean;
  closesAt: string;
  answers: AnswerMap;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { data: next, loading } = useService(() =>
    getNextPendingFeedback({ assignmentId, window }),
  );

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="pt-2 text-center">
        <span className="bg-ok-bg text-ok-ink mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
          <CheckCircle2 className="size-9" aria-hidden />
        </span>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-3xl font-extrabold tracking-tight outline-none"
        >
          {updated ? t.updatedTitle : t.title}
        </h1>
        <p className="text-muted mt-2">{updated ? t.updatedBody : t.body}</p>
        <p className="mt-2 font-semibold">{t.editUntil(formatShortDate(closesAt))}</p>
      </div>

      <ClassSnapshotCard assignmentId={assignmentId} window={window} ownAnswers={answers} />

      <div className="flex flex-col gap-3">
        <Link href="/student" className={buttonStyles({ size: 'lg', block: true })}>
          {t.backHome}
        </Link>
        {next ? (
          <Link
            href={`/student/feedback/${next.assignmentId}/${next.window}`}
            className={buttonStyles({ variant: 'secondary', block: true })}
          >
            {t.another}
          </Link>
        ) : (
          !loading && <p className="text-muted text-center text-sm">{t.nothingElse}</p>
        )}
      </div>
    </div>
  );
}
