import { beforeEach, describe, expect, it } from 'vitest';
import { FINAL_QUESTIONS, REVEAL_MIN_RESPONSES } from '@/config/questions';
import { describeSnapshotItem } from '@/lib/services/snapshot-logic';
import { getClassSnapshot } from '@/lib/services/snapshots';
import { submitFeedback } from '@/lib/services/feedback';
import { saveProfile } from '@/lib/services/profile';
import { setClockOverride } from '@/lib/services/clock';
import { getAssignmentContexts } from '@/lib/services/teaching';
import { storage } from '@/lib/storage';
import type { ScaleQuestion } from '@/lib/types';

const pace = FINAL_QUESTIONS.find((q) => q.id === 'f05') as ScaleQuestion;

describe('describeSnapshotItem', () => {
  it('says what most classmates felt', () => {
    // Too slow 10, Just right 68, Too fast 22 (100 people).
    const view = describeSnapshotItem(
      pace,
      { questionId: 'f05', counts: [10, 68, 22], total: 100 },
      'just-right',
    );
    expect(view?.headline).toBe('Most classmates (68%) felt the pace was just right.');
    expect(view?.yours).toBeNull();
  });

  it("neutrally notes when the student's answer differs", () => {
    const view = describeSnapshotItem(
      pace,
      { questionId: 'f05', counts: [10, 78, 12], total: 100 },
      'too-fast',
    );
    expect(view?.yours).toBe('You’re one of the 12% who felt it was too fast. That’s valid too.');
  });

  it('does not say "most" when the biggest group is under half', () => {
    const view = describeSnapshotItem(
      pace,
      { questionId: 'f05', counts: [30, 40, 30], total: 100 },
      undefined,
    );
    expect(view?.headline).toBe(
      'The biggest group of classmates (40%) felt the pace was just right.',
    );
  });

  it('returns segments that add up to about 100 and mark the top and own answers', () => {
    const view = describeSnapshotItem(
      pace,
      { questionId: 'f05', counts: [1, 3, 1], total: 5 },
      'too-slow',
    )!;
    expect(view.segments.map((s) => s.pct)).toEqual([20, 60, 20]);
    expect(view.segments.find((s) => s.isTop)?.id).toBe('just-right');
    expect(view.segments.find((s) => s.isOwn)?.id).toBe('too-slow');
  });

  it('returns nothing for an empty snapshot', () => {
    expect(
      describeSnapshotItem(pace, { questionId: 'f05', counts: [0, 0, 0], total: 0 }, undefined),
    ).toBeNull();
  });
});

describe('getClassSnapshot', () => {
  let theory: string;
  let lab: string;

  beforeEach(async () => {
    storage.clearAll();
    await saveProfile({
      displayName: 'Test Student',
      studentId: '200041123',
      department: 'CSE',
      level: 7,
      avatar: { kind: 'initials', color: '#c8102e' },
    });
    const current = (await getAssignmentContexts()).filter((c) => c.semester.isCurrent);
    theory = current.find((c) => c.assignment.role === 'theory')!.assignment.id;
    lab = current.find((c) => c.assignment.role === 'lab')!.assignment.id;
    await setClockOverride('2026-12-27T06:00:00.000Z'); // final window open
  });

  it('shows a snapshot for a big class, with only aggregates', async () => {
    await submitFeedback(theory, 'final', { f05: 'just-right' });
    const snapshot = await getClassSnapshot(theory, 'final');
    expect(snapshot.responseCount).toBeGreaterThanOrEqual(REVEAL_MIN_RESPONSES);
    expect(snapshot.items.length).toBeGreaterThan(0);
    expect(snapshot.items.length).toBeLessThanOrEqual(3);
    for (const item of snapshot.items) {
      expect(item.counts.reduce((a, b) => a + b, 0)).toBe(item.total);
    }
    // Aggregates only: nothing that looks like an individual answer.
    expect(Object.keys(snapshot).sort()).toEqual([
      'assignmentId',
      'items',
      'responseCount',
      'window',
    ]);
  });

  it('withholds the snapshot when the class is below the minimum', async () => {
    await submitFeedback(lab, 'final', { f05: 'just-right' });
    const snapshot = await getClassSnapshot(lab, 'final');
    expect(snapshot.responseCount).toBeLessThan(REVEAL_MIN_RESPONSES);
    expect(snapshot.items).toEqual([]);
  });
});
