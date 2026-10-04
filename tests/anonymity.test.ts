import { beforeEach, describe, expect, it } from 'vitest';
import { KEYS, storage } from '@/lib/storage';
import { getAllResponses } from '@/lib/services/responses';
import { getReceipts } from '@/lib/services/receipts';
import { FeedbackError, getFeedbackSession, submitFeedback } from '@/lib/services/feedback';
import { saveProfile } from '@/lib/services/profile';
import { getAssignmentContexts } from '@/lib/services/teaching';
import { setClockOverride } from '@/lib/services/clock';
import type { Student } from '@/lib/types';

let student: Student;
let assignmentId: string;

beforeEach(async () => {
  storage.clearAll();
  student = await saveProfile({
    displayName: 'Test Student',
    studentId: '200041123',
    department: 'CSE',
    level: 7,
    avatar: { kind: 'initials', color: '#c8102e' },
  });
  const contexts = await getAssignmentContexts();
  assignmentId = contexts.find((c) => c.semester.isCurrent)!.assignment.id;
  // Default demo date: midterm window open.
  await setClockOverride(null);
});

describe('anonymity of stored responses', () => {
  it('stores an AnonymousResponse that contains no student identifier', async () => {
    await submitFeedback(assignmentId, 'midterm', {
      m01: 'good',
      m03: 'just-right',
      m14: 6,
      m15: ['clear-explanations'],
      m17: 'More examples please.',
    });

    const responses = await getAllResponses();
    const mine = responses.find((r) => r.assignmentId === assignmentId && r.window === 'midterm');
    expect(mine).toBeDefined();

    // Exactly these fields: no student id, no timestamp.
    expect(Object.keys(mine!).sort()).toEqual([
      'answers',
      'assignmentId',
      'id',
      'version',
      'window',
    ]);

    // Neither the internal id nor the visible student ID appears anywhere in response storage.
    const raw = JSON.stringify(storage.get(KEYS.responses, {}));
    expect(raw).not.toContain(student.id);
    expect(raw).not.toContain(student.studentId);
    expect(raw.toLowerCase()).not.toContain('studentid');
    expect(raw).not.toContain('Test Student');
  });

  it('keeps the link between student and response in the receipt store only', async () => {
    await submitFeedback(assignmentId, 'midterm', { m01: 'good' });

    const [receipt] = (await getReceipts(student.id)).filter(
      (r) => r.assignmentId === assignmentId,
    );
    expect(receipt?.studentId).toBe(student.id);

    const response = (await getAllResponses()).find((r) => r.id === receipt?.responseId);
    expect(response).toBeDefined();

    // Separate storage keys.
    expect(KEYS.responses).not.toBe(KEYS.receipts);
    // The receipt holds no answers.
    expect(JSON.stringify(receipt)).not.toContain('"answers"');
  });

  it('does not store a precise timestamp with the response', async () => {
    await submitFeedback(assignmentId, 'midterm', { m01: 'good' });
    const raw = JSON.stringify(storage.get(KEYS.responses, {}));
    expect(raw).not.toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/);
  });
});

describe('sending and editing', () => {
  it('replaces the earlier response when the student edits, keeping one response', async () => {
    const first = await submitFeedback(assignmentId, 'midterm', { m01: 'good' });
    expect(first.updated).toBe(false);

    const second = await submitFeedback(assignmentId, 'midterm', {
      m01: 'excellent',
      m03: 'too-fast',
    });
    expect(second.updated).toBe(true);

    const mine = (await getAllResponses()).filter(
      (r) => r.assignmentId === assignmentId && r.window === 'midterm',
    );
    expect(mine).toHaveLength(1);
    expect(mine[0]?.version).toBe(2);
    expect(mine[0]?.answers.find((a) => a.questionId === 'm01')?.value).toBe('excellent');

    const session = await getFeedbackSession(assignmentId, 'midterm');
    expect(session?.sentAnswers).toMatchObject({ m01: 'excellent', m03: 'too-fast' });
  });

  it('needs at least one answer', async () => {
    await expect(submitFeedback(assignmentId, 'midterm', {})).rejects.toMatchObject({
      code: 'NO_ANSWERS',
    });
    // Unknown or invalid answers do not count.
    await expect(
      submitFeedback(assignmentId, 'midterm', { m01: 'not-an-option', zzz: 'x', m17: '   ' }),
    ).rejects.toBeInstanceOf(FeedbackError);
  });

  it('refuses to send after the window has closed', async () => {
    await setClockOverride('2027-01-15T06:00:00.000Z');
    await expect(submitFeedback(assignmentId, 'midterm', { m01: 'good' })).rejects.toMatchObject({
      code: 'WINDOW_NOT_OPEN',
    });
  });

  it('refuses to send before the window has opened', async () => {
    await expect(submitFeedback(assignmentId, 'final', { f01: 'good' })).rejects.toMatchObject({
      code: 'WINDOW_NOT_OPEN',
    });
  });

  it('cleans answers before storing them', async () => {
    await submitFeedback(assignmentId, 'midterm', {
      m01: 'good',
      m14: 99, // above the slider max
      m15: ['clear-explanations', 'good-examples', 'well-prepared', 'fair-exams'], // over the max of 3
      m17: 'x'.repeat(900), // over 500 characters
    });
    const session = await getFeedbackSession(assignmentId, 'midterm');
    const sent = session!.sentAnswers!;
    expect(sent.m14).toBe(15);
    expect((sent.m15 as string[]).length).toBe(3);
    expect((sent.m17 as string).length).toBe(500);
  });
});
