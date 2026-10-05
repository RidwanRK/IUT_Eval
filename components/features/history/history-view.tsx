'use client';

import * as Collapsible from '@radix-ui/react-collapsible';
import { motion } from 'framer-motion';
import { Check, ChevronDown, ChevronRight, History as HistoryIcon, Minus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { copy } from '@/config/copy';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useService } from '@/lib/hooks/use-service';
import { getHistory, type HistoryRow, type HistoryWindow } from '@/lib/services/history';
import { cn } from '@/lib/utils';

const t = copy.history;

function WindowStatusLine({ row, window }: { row: HistoryRow; window: HistoryWindow }) {
  const label = copy.windows[window.type];
  if (!window.submitted) {
    return (
      <div className="flex min-h-12 items-center justify-between gap-3 py-1">
        <span className="font-semibold">{label}</span>
        <Badge icon={<Minus className="size-3.5" aria-hidden />}>{t.notSubmitted}</Badge>
      </div>
    );
  }
  // Submitted rows link to the read-only answers view.
  return (
    <Link
      href={`/student/feedback/${row.assignment.id}/${window.type}?view=answers`}
      aria-label={`${t.viewAnswers}, ${label.toLowerCase()}, ${row.course.title}, ${row.instructor.name}`}
      className="hover:bg-canvas -mx-2 flex min-h-12 items-center justify-between gap-3 rounded-xl px-2 py-1"
    >
      <span className="font-semibold">{label}</span>
      <span className="flex items-center gap-2">
        <Badge tone="success" icon={<Check className="size-3.5" strokeWidth={3} aria-hidden />}>
          {t.submitted}
        </Badge>
        <ChevronRight className="text-muted size-5" aria-hidden />
      </span>
    </Link>
  );
}

function SemesterGroup({
  label,
  rows,
}: {
  label: string;
  rows: HistoryRow[];
}) {
  const [open, setOpen] = useState(false);
  const courseCount = new Set(rows.map((r) => r.course.id)).size;

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} asChild>
      <Card padded={false} className="overflow-hidden">
        <h2>
          <Collapsible.Trigger className="hover:bg-canvas flex min-h-16 w-full items-center justify-between gap-3 px-5 py-3 text-left sm:px-6">
            <span>
              <span className="block text-lg font-extrabold tracking-tight">{label}</span>
              <span className="text-muted block text-sm">{t.courseCount(courseCount)}</span>
            </span>
            <ChevronDown
              className={cn('text-muted size-5 transition-transform', open && 'rotate-180')}
              aria-hidden
            />
          </Collapsible.Trigger>
        </h2>
        <Collapsible.Content>
          <ul className="divide-line border-line divide-y border-t">
            {rows.map((row) => (
              <li key={row.assignment.id} className="px-5 py-4 sm:px-6">
                <p className="text-muted tabular text-sm font-semibold">{row.course.code}</p>
                <p className="font-bold">{row.course.title}</p>
                <p className="text-muted mb-2 flex flex-wrap items-center gap-x-2 text-sm">
                  {row.instructor.name}
                  <Badge>{copy.windows.roles[row.assignment.role]}</Badge>
                  {row.assignment.note && <span>{row.assignment.note}</span>}
                </p>
                <div className="divide-line divide-y">
                  <WindowStatusLine row={row} window={row.windows.midterm} />
                  <WindowStatusLine row={row} window={row.windows.final} />
                </div>
              </li>
            ))}
          </ul>
        </Collapsible.Content>
      </Card>
    </Collapsible.Root>
  );
}

export function HistoryView() {
  const { data, error, loading, reload } = useService(getHistory);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">{t.title}</h1>
        <p className="text-muted mt-1">{t.subtitle}</p>
      </header>

      {error ? (
        <ErrorState title={t.errorTitle} onRetry={reload} />
      ) : loading && !data ? (
        <div role="status" aria-label={copy.common.loading} className="flex flex-col gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : data && data.length === 0 ? (
        <Card>
          <EmptyState icon={HistoryIcon} title={t.emptyTitle} body={t.emptyBody} />
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mx-auto flex w-full max-w-2xl flex-col gap-4 lg:mx-0"
        >
          {data?.map((group) => (
            <SemesterGroup
              key={group.semester.id}
              label={group.semester.label}
              rows={group.rows}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
