import { BellOff, CalendarClock, MessageSquareText } from 'lucide-react';
import Link from 'next/link';
import { copy } from '@/config/copy';
import { cn } from '@/lib/utils';
import type { AppNotification } from '@/lib/types';

/** The list inside the popover (desktop) and bottom sheet (phones). */
export function NotificationList({
  notifications,
  highlightIds,
  onNavigate,
}: {
  notifications: readonly AppNotification[];
  /** Reminders that were unread when the list opened. */
  highlightIds: ReadonlySet<string>;
  onNavigate: () => void;
}) {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center px-4 py-8 text-center">
        <span className="bg-sunken text-muted mb-3 flex size-12 items-center justify-center rounded-full">
          <BellOff className="size-6" aria-hidden />
        </span>
        <p className="font-bold">{copy.notifications.empty}</p>
        <p className="text-muted mt-1 text-sm">{copy.notifications.emptyBody}</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {notifications.map((n) => {
        const isNew = highlightIds.has(n.id);
        const Icon = n.kind === 'closing-soon' ? CalendarClock : MessageSquareText;
        return (
          <li key={n.id}>
            <Link
              href={n.href}
              onClick={onNavigate}
              className={cn(
                'flex min-h-14 items-start gap-3 rounded-2xl p-3 transition-colors',
                isNew ? 'bg-brand-50 hover:bg-brand-100' : 'hover:bg-canvas',
              )}
            >
              <span
                className={cn(
                  'mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full',
                  isNew ? 'bg-brand text-white' : 'bg-sunken text-muted',
                )}
              >
                <Icon className="size-4.5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold">
                  {isNew && <span className="sr-only">New. </span>}
                  {n.title}
                </span>
                <span className="text-muted block text-sm">{n.body}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
