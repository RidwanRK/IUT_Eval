import Link from 'next/link';
import { copy } from '@/config/copy';
import { buttonStyles } from '@/components/ui/button';
import type { WindowLine as WindowLineData } from '@/lib/services/dashboard';
import { describeWindow, editableUntilText } from '@/lib/services/window-logic';
import { StatusChip } from './status-chip';

const actionCopy = copy.dashboard.actions;

export function WindowLine({
  line,
  assignmentId,
  context,
  now,
}: {
  line: WindowLineData;
  assignmentId: string;
  /** For screen readers, for example "Database Systems, Prof. Orin Maplewood". */
  context: string;
  now: Date;
}) {
  const href = `/student/feedback/${assignmentId}/${line.type}`;
  const label = copy.windows[line.type];

  // Submitted while open: say how long edits are possible. Otherwise: the relative date text.
  const meta =
    line.action === 'edit' ? editableUntilText(line.window) : describeWindow(line.window, now);

  let button: { text: string; primary: boolean; hint?: string } | null = null;
  if (line.action === 'start') {
    button = {
      text: actionCopy.start,
      primary: true,
      hint: copy.windows.aboutMinutes(line.estimateMinutes),
    };
  } else if (line.action === 'continue' && line.draft) {
    button = {
      text: actionCopy.continue,
      primary: true,
      hint: copy.dashboard.draftProgress(line.draft.answered, line.draft.total),
    };
  } else if (line.action === 'edit') {
    button = { text: actionCopy.edit, primary: false };
  } else if (line.action === 'view') {
    button = { text: actionCopy.view, primary: false };
  }

  return (
    <div className="bg-canvas rounded-2xl p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-bold">{label}</p>
        <StatusChip line={line} />
      </div>
      <p className="text-muted mt-1 text-sm">{meta}</p>
      {button && (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <Link
            href={href}
            aria-label={`${button.text}, ${label.toLowerCase()} feedback, ${context}`}
            className={buttonStyles({
              variant: button.primary ? 'primary' : 'secondary',
              className: 'w-full sm:w-auto',
            })}
          >
            {button.text}
          </Link>
          {button.hint && <span className="text-muted text-sm">{button.hint}</span>}
        </div>
      )}
    </div>
  );
}
