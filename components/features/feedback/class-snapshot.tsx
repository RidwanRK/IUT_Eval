'use client';

import { Users } from 'lucide-react';
import { copy } from '@/config/copy';
import { REVEAL_MIN_RESPONSES, getQuestionSet } from '@/config/questions';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useService } from '@/lib/hooks/use-service';
import { describeSnapshotItem, type SnapshotView } from '@/lib/services/snapshot-logic';
import { getClassSnapshot } from '@/lib/services/snapshots';
import type { AnswerMap, ScaleQuestion, WindowType } from '@/lib/types';
import { cn } from '@/lib/utils';

const t = copy.flow.snapshot;

function SnapshotBar({ view }: { view: SnapshotView }) {
  const alt = t.chartLabel(
    view.name,
    view.segments.map((s) => t.chartPart(s.label, s.pct)).join('. '),
  );
  return (
    <div>
      <p className="font-bold">{view.headline}</p>
      {view.yours && <p className="text-muted mt-0.5 text-sm">{view.yours}</p>}

      {/* The bar is decorative: the text alternative below carries the same numbers. */}
      <div
        role="img"
        aria-label={alt}
        className="mt-3 flex h-4 w-full gap-0.5 overflow-hidden rounded-full"
      >
        {view.segments.map((s) =>
          s.pct === 0 ? null : (
            <div
              key={s.id}
              style={{ width: `${s.pct}%` }}
              className={cn('h-full', s.isTop ? 'bg-brand' : 'bg-line-strong')}
            />
          ),
        )}
      </div>
      <ul className="text-muted mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm" aria-hidden>
        {view.segments.map((s) => (
          <li key={s.id} className={cn(s.isTop && 'text-ink font-semibold')}>
            {s.label} <span className="tabular">{s.pct}%</span>
            {s.isOwn && <span className="text-brand font-semibold"> ({t.yourAnswerTag})</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A quick look at how classmates answered. Only appears once the class is big enough. */
export function ClassSnapshotCard({
  assignmentId,
  window,
  ownAnswers,
}: {
  assignmentId: string;
  window: WindowType;
  ownAnswers: AnswerMap;
}) {
  const { data, loading } = useService(() => getClassSnapshot(assignmentId, window));

  if (loading && !data) {
    return (
      <Card className="space-y-3" role="status" aria-label={copy.common.loading}>
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </Card>
    );
  }
  if (!data) return null;

  const set = getQuestionSet(window);
  const views = data.items
    .map((item) => {
      const q = set.questions.find((x) => x.id === item.questionId);
      return q && q.type === 'scale'
        ? describeSnapshotItem(q as ScaleQuestion, item, ownAnswers[item.questionId])
        : null;
    })
    .filter((v): v is SnapshotView => v !== null);

  if (data.responseCount < REVEAL_MIN_RESPONSES || views.length === 0) {
    return (
      <p className="text-muted bg-sunken flex items-start gap-3 rounded-xl p-4 text-sm">
        <Users className="mt-0.5 size-5 shrink-0" aria-hidden />
        {t.notEnough}
      </p>
    );
  }

  return (
    <Card className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold tracking-tight">{t.title}</h2>
        <p className="text-muted text-sm">{t.subtitle}</p>
      </div>
      {views.map((v) => (
        <SnapshotBar key={v.questionId} view={v} />
      ))}
    </Card>
  );
}
