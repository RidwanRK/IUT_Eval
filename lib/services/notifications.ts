import { KEYS, storage } from '@/lib/storage';
import type { AppNotification } from '@/lib/types';
import { getNow } from './clock';
import { generateNotifications, type PendingItem } from './notification-rules';
import { requireProfile } from './profile';
import { getReceipts } from './receipts';
import { getReminderPrefs } from './reminders';
import { getAssignmentContexts } from './teaching';

export async function getNotifications(): Promise<AppNotification[]> {
  const [student, now, contexts, prefs] = await Promise.all([
    requireProfile(),
    getNow(),
    getAssignmentContexts(),
    getReminderPrefs(),
  ]);
  const receipts = await getReceipts(student.id);
  const submitted = new Set(receipts.map((r) => `${r.assignmentId}:${r.window}`));
  const readIds = new Set(storage.get<string[]>(KEYS.notificationsRead, []));

  const items: PendingItem[] = contexts
    .filter((c) => c.semester.isCurrent)
    .flatMap((c) =>
      (['midterm', 'final'] as const).map((type) => ({
        assignmentId: c.assignment.id,
        offeringId: c.offering.id,
        courseTitle: c.course.title,
        instructorName: c.instructor.name,
        window: c.windows[type],
        submitted: submitted.has(`${c.assignment.id}:${type}`),
      })),
    );

  return generateNotifications({ items, prefs, readIds, now });
}

export async function markNotificationsRead(ids: readonly string[]): Promise<void> {
  if (ids.length === 0) return;
  const current = new Set(storage.get<string[]>(KEYS.notificationsRead, []));
  ids.forEach((id) => current.add(id));
  storage.set(KEYS.notificationsRead, [...current]);
}
