import { KEYS, storage } from '@/lib/storage';
import type { ReminderPrefs } from '@/lib/types';

/** In-app reminders start on. Email starts off until the student adds an address and opts in. */
export const DEFAULT_REMINDER_PREFS: ReminderPrefs = {
  inApp: { windowOpens: true, closingSoon: true },
  email: { windowOpens: false, closingSoon: false },
};

export async function getReminderPrefs(): Promise<ReminderPrefs> {
  const stored = storage.get<Partial<ReminderPrefs>>(KEYS.reminderPrefs, {});
  return {
    inApp: { ...DEFAULT_REMINDER_PREFS.inApp, ...stored.inApp },
    email: { ...DEFAULT_REMINDER_PREFS.email, ...stored.email },
  };
}

export async function saveReminderPrefs(prefs: ReminderPrefs): Promise<void> {
  storage.set(KEYS.reminderPrefs, prefs);
}
