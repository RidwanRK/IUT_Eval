import { Clock, Lock, PencilLine } from 'lucide-react';
import Link from 'next/link';
import { copy } from '@/config/copy';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { AssignmentContext } from '@/lib/services/teaching';
import type { WindowType } from '@/lib/types';

const t = copy.flow.intro;

export function IntroCard({
  context,
  window,
  minutes,
  draftPosition,
  onStart,
  onContinue,
  onStartOver,
}: {
  context: AssignmentContext;
  window: WindowType;
  minutes: number;
  /** Zero-based index to continue from, if a draft exists. */
  draftPosition: number | null;
  onStart: () => void;
  onContinue: () => void;
  onStartOver: () => void;
}) {
  const { course, instructor, assignment, semester } = context;

  return (
    <Card className="p-6 sm:p-8">
      <p className="text-brand text-sm font-bold">
        {t.eyebrow(copy.windows[window], semester.label)}
      </p>
      <h1 className="mt-2 text-3xl leading-tight font-extrabold tracking-tight">{course.title}</h1>
      <p className="text-muted tabular mt-1 font-semibold">{course.code}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1">
        <p className="font-bold">{instructor.name}</p>
        <Badge>{copy.windows.roles[assignment.role]}</Badge>
        {assignment.note && <span className="text-muted text-sm">{assignment.note}</span>}
      </div>

      <p className="text-muted mt-5">{t.blurb[window]}</p>

      <ul className="mt-5 flex flex-col gap-3 text-[0.95rem]">
        <li className="flex items-start gap-3">
          <Clock className="text-muted mt-0.5 size-5 shrink-0" aria-hidden />
          <span>
            <span className="font-bold">{t.about(minutes)}.</span> {t.skipNote}
          </span>
        </li>
        <li className="bg-sunken flex items-start gap-3 rounded-xl p-3.5">
          <Lock className="text-muted mt-0.5 size-5 shrink-0" aria-hidden />
          <span>
            {copy.flow.anonymity}{' '}
            <Link
              href="/student/help"
              className="text-brand font-semibold underline underline-offset-2"
            >
              {copy.flow.helpLink}
            </Link>
          </span>
        </li>
      </ul>

      <div className="mt-7 flex flex-col gap-3">
        {draftPosition !== null ? (
          <>
            <p className="text-muted flex items-center gap-2 text-sm font-medium">
              <PencilLine className="size-4" aria-hidden />
              {t.draftFound}
            </p>
            <Button size="lg" block onClick={onContinue}>
              {t.continueFrom(draftPosition + 1)}
            </Button>
            <Button variant="secondary" block onClick={onStartOver}>
              {t.startOver}
            </Button>
          </>
        ) : (
          <Button size="lg" block onClick={onStart}>
            {t.start}
          </Button>
        )}
      </div>
    </Card>
  );
}
