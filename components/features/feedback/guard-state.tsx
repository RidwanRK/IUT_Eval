import { CalendarClock, Lock, SearchX } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { copy } from '@/config/copy';
import { Button, buttonStyles } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import type { AssignmentContext } from '@/lib/services/teaching';
import { formatShortDate } from '@/lib/services/window-logic';
import type { WindowType } from '@/lib/types';

const t = copy.flow.guard;

function Shell({ children }: { children: ReactNode }) {
  return <Card className="mt-4">{children}</Card>;
}

const home = (
  <Link href="/student" className={buttonStyles({ variant: 'secondary' })}>
    {t.backHome}
  </Link>
);

export function UpcomingState({
  context,
  window,
}: {
  context: AssignmentContext;
  window: WindowType;
}) {
  return (
    <Shell>
      <EmptyState
        icon={CalendarClock}
        title={t.upcomingTitle}
        body={t.upcomingBody(
          copy.windows[window],
          formatShortDate(context.windows[window].opensAt),
        )}
        action={home}
      />
    </Shell>
  );
}

export function ClosedState({
  context,
  window,
  submitted,
  onViewAnswers,
}: {
  context: AssignmentContext;
  window: WindowType;
  submitted: boolean;
  onViewAnswers: () => void;
}) {
  const date = formatShortDate(context.windows[window].closesAt);
  return (
    <Shell>
      <EmptyState
        icon={Lock}
        title={t.closedTitle}
        body={submitted ? t.closedSubmittedBody(date) : t.closedBody(date)}
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            {submitted && <Button onClick={onViewAnswers}>{t.viewAnswers}</Button>}
            {home}
          </div>
        }
      />
    </Shell>
  );
}

export function NotFoundState() {
  return (
    <Shell>
      <EmptyState icon={SearchX} title={t.notFoundTitle} body={t.notFoundBody} action={home} />
    </Shell>
  );
}
