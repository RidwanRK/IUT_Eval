import {
  CalendarClock,
  CheckCircle2,
  MessageSquareText,
  Moon,
  type LucideIcon,
} from 'lucide-react';
import { copy } from '@/config/copy';
import type { DashboardSummary } from '@/lib/services/dashboard-summary';
import { formatShortDate } from '@/lib/services/window-logic';

const t = copy.dashboard.summary;

/** A calm one-liner. Never guilt, never a count of what was missed. */
export function SummaryLine({ summary }: { summary: DashboardSummary }) {
  let Icon: LucideIcon = MessageSquareText;
  let title: string | null = null;
  let body: string;

  switch (summary.kind) {
    case 'open':
      body = t.open(summary.courses, summary.minutes);
      break;
    case 'caught-up':
      Icon = CheckCircle2;
      title = t.caughtUpTitle;
      body = t.caughtUpBody;
      break;
    case 'nothing-open':
      Icon = CalendarClock;
      body = `${t.nothingOpen} ${t.nextOpening(formatShortDate(summary.nextOpensAt))}`;
      break;
    case 'closed':
      Icon = Moon;
      body = t.allClosed;
      break;
  }

  return (
    <div className="bg-brand-50 rounded-card flex items-start gap-3 p-4 sm:p-5">
      <span className="text-brand mt-0.5 shrink-0">
        <Icon className="size-6" aria-hidden />
      </span>
      <div>
        {title && <p className="font-bold">{title}</p>}
        <p className={title ? 'text-muted' : 'font-medium'}>{body}</p>
      </div>
    </div>
  );
}
