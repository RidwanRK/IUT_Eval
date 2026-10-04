import { describe, expect, it } from 'vitest';
import { generateNotifications, type PendingItem } from '@/lib/services/notification-rules';
import { DEFAULT_REMINDER_PREFS } from '@/lib/services/reminders';
import type { ReminderPrefs } from '@/lib/types';

const at = (iso: string) => new Date(`${iso}T06:00:00.000Z`);

const midterm = {
  id: 'w1',
  offeringId: 'off-1',
  type: 'midterm' as const,
  opensAt: '2026-10-11T18:00:00.000Z',
  closesAt: '2026-10-26T17:59:59.000Z',
};
const final = {
  id: 'w2',
  offeringId: 'off-1',
  type: 'final' as const,
  opensAt: '2026-12-13T18:00:00.000Z',
  closesAt: '2026-12-28T17:59:59.000Z',
};

function item(overrides: Partial<PendingItem> = {}): PendingItem {
  return {
    assignmentId: 'asg-1',
    offeringId: 'off-1',
    courseTitle: 'Operating Systems',
    instructorName: 'Dr. Zephyr Quill',
    window: midterm,
    submitted: false,
    ...overrides,
  };
}

const run = (
  items: PendingItem[],
  now: Date,
  prefs: ReminderPrefs = DEFAULT_REMINDER_PREFS,
  readIds: string[] = [],
) => generateNotifications({ items, prefs, readIds: new Set(readIds), now });

describe('generateNotifications', () => {
  it('says a window is open', () => {
    const [n] = run([item()], at('2026-10-20'));
    expect(n?.kind).toBe('window-open');
    expect(n?.title).toBe('Midterm feedback for Operating Systems is open');
    expect(n?.href).toBe('/student/feedback/asg-1/midterm');
  });

  it('says closes tomorrow, for the final window too', () => {
    const [n] = run([item({ window: final })], at('2026-12-27'));
    expect(n?.kind).toBe('closing-soon');
    expect(n?.title).toBe('Closes tomorrow: Operating Systems final feedback');
  });

  it('says closes today on the last day', () => {
    const [n] = run([item()], at('2026-10-26'));
    expect(n?.title).toBe('Closes today: Operating Systems midterm feedback');
  });

  it('does not nag about submitted windows', () => {
    expect(run([item({ submitted: true })], at('2026-10-25'))).toEqual([]);
  });

  it('ignores upcoming and closed windows', () => {
    expect(run([item()], at('2026-10-05'))).toEqual([]);
    expect(run([item()], at('2026-11-20'))).toEqual([]);
  });

  it('shows one reminder per course and window, however many teachers', () => {
    const list = run(
      [
        item({ assignmentId: 'asg-1' }),
        item({ assignmentId: 'asg-2', instructorName: 'Ms. Tamsin Brookfield' }),
      ],
      at('2026-10-20'),
    );
    expect(list).toHaveLength(1);
    expect(list[0]?.href).toBe('/student');
  });

  it('still reminds about a teacher who has not been rated yet', () => {
    const list = run(
      [item({ assignmentId: 'asg-1', submitted: true }), item({ assignmentId: 'asg-2' })],
      at('2026-10-20'),
    );
    expect(list).toHaveLength(1);
    expect(list[0]?.href).toBe('/student/feedback/asg-2/midterm');
  });

  it('puts closing soon first', () => {
    const list = run(
      [
        item({
          offeringId: 'off-1',
          courseTitle: 'Algorithms',
          window: { ...midterm, offeringId: 'off-1' },
        }),
        item({
          assignmentId: 'asg-9',
          offeringId: 'off-2',
          courseTitle: 'Zoology',
          window: { ...midterm, offeringId: 'off-2', closesAt: '2026-10-25T17:59:59.000Z' },
        }),
      ],
      at('2026-10-24'),
    );
    expect(list[0]?.kind).toBe('closing-soon');
    expect(list[1]?.kind).toBe('window-open');
  });

  it('marks reminders the student has already seen as read', () => {
    const [n] = run([item()], at('2026-10-20'), DEFAULT_REMINDER_PREFS, [
      'window-open:off-1:midterm',
    ]);
    expect(n?.read).toBe(true);
  });

  describe('reminder preferences', () => {
    it('hides "window opens" reminders when switched off', () => {
      const prefs: ReminderPrefs = {
        ...DEFAULT_REMINDER_PREFS,
        inApp: { windowOpens: false, closingSoon: true },
      };
      expect(run([item()], at('2026-10-20'), prefs)).toEqual([]);
      expect(run([item()], at('2026-10-25'), prefs)[0]?.kind).toBe('closing-soon');
    });

    it('hides "closes soon" reminders when switched off, and falls back to the open one', () => {
      const prefs: ReminderPrefs = {
        ...DEFAULT_REMINDER_PREFS,
        inApp: { windowOpens: true, closingSoon: false },
      };
      expect(run([item()], at('2026-10-25'), prefs)[0]?.kind).toBe('window-open');
    });

    it('shows nothing when both are off', () => {
      const prefs: ReminderPrefs = {
        ...DEFAULT_REMINDER_PREFS,
        inApp: { windowOpens: false, closingSoon: false },
      };
      expect(run([item()], at('2026-10-25'), prefs)).toEqual([]);
    });

    it('ignores email preferences for in-app reminders', () => {
      const prefs: ReminderPrefs = {
        inApp: { windowOpens: true, closingSoon: true },
        email: { windowOpens: false, closingSoon: false },
      };
      expect(run([item()], at('2026-10-20'), prefs)).toHaveLength(1);
    });
  });
});
