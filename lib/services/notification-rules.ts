/**
 * Pure notification generator. Reminders come from window state, never from a stored feed.
 * Only windows the student has NOT submitted produce reminders.
 */
import { copy } from '@/config/copy';
import type { AppNotification, FeedbackWindow, ReminderPrefs, WindowType } from '@/lib/types';
import { closesText, daysUntilClose, getWindowStatus } from './window-logic';

export interface PendingItem {
  assignmentId: string;
  offeringId: string;
  courseTitle: string;
  instructorName: string;
  window: FeedbackWindow;
  submitted: boolean;
}

export interface NotificationInput {
  items: readonly PendingItem[];
  prefs: ReminderPrefs;
  readIds: ReadonlySet<string>;
  now: Date;
}

const windowLabel = (type: WindowType) => copy.windows[type];

export function generateNotifications({
  items,
  prefs,
  readIds,
  now,
}: NotificationInput): AppNotification[] {
  // One reminder per course and window, however many teachers the course has.
  const groups = new Map<string, PendingItem[]>();
  for (const item of items) {
    if (item.submitted) continue;
    if (getWindowStatus(item.window, now) !== 'open') continue;
    const key = `${item.offeringId}:${item.window.type}`;
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }

  const result: AppNotification[] = [];
  for (const group of groups.values()) {
    const first = group[0]!;
    const { window } = first;
    const days = daysUntilClose(window, now);
    const closingSoon = days <= 1;

    const href =
      group.length === 1 ? `/student/feedback/${first.assignmentId}/${window.type}` : '/student';
    const detail =
      group.length === 1
        ? `${first.instructorName}. ${closesText(window, now)}`
        : `${copy.notifications.teachersWaiting(group.length)}. ${closesText(window, now)}`;

    let notification: AppNotification | null = null;
    if (closingSoon && prefs.inApp.closingSoon) {
      notification = {
        id: `closing-soon:${first.offeringId}:${window.type}`,
        kind: 'closing-soon',
        offeringId: first.offeringId,
        window: window.type,
        title: copy.notifications.closingSoon(
          days <= 0 ? copy.notifications.closesTodayShort : copy.notifications.closesTomorrowShort,
          first.courseTitle,
          windowLabel(window.type),
        ),
        body: detail,
        href,
        read: false,
      };
    } else if (prefs.inApp.windowOpens) {
      notification = {
        id: `window-open:${first.offeringId}:${window.type}`,
        kind: 'window-open',
        offeringId: first.offeringId,
        window: window.type,
        title: copy.notifications.windowOpen(windowLabel(window.type), first.courseTitle),
        body: detail,
        href,
        read: false,
      };
    }

    if (notification) result.push({ ...notification, read: readIds.has(notification.id) });
  }

  // Closing soon first, then by course.
  return result.sort(
    (a, b) =>
      Number(b.kind === 'closing-soon') - Number(a.kind === 'closing-soon') ||
      a.title.localeCompare(b.title),
  );
}
