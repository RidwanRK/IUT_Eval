/**
 * Mock history. In production, past submissions already exist on the server. For the demo
 * we pretend the student gave feedback for most past windows and skipped a few, so the
 * History screen has both states. Deterministic, so a reset always gives the same history.
 */
import { getQuestionSet } from '@/config/questions';
import { getCatalog } from '@/lib/mock/catalog';
import type {
  Answer,
  AnonymousResponse,
  Enrollment,
  Student,
  SubmissionReceipt,
  WindowType,
} from '@/lib/types';
import { saveReceipt } from './receipts';
import { saveResponse } from './responses';

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const SAMPLE_COMMENTS = [
  'The examples in class made the hard parts much easier to follow.',
  'Sharing the slides a day earlier would help a lot.',
  'Loved the practice problems before the exam.',
];

/** Plausible, deterministic answers for a seeded past response. Skips a few questions. */
function mockAnswers(seed: string, window: WindowType): Answer[] {
  const answers: Answer[] = [];
  for (const question of getQuestionSet(window).questions) {
    const h = hash(`${seed}:${question.id}`);
    if (h % 9 === 0) continue; // skipped
    switch (question.type) {
      case 'scale': {
        const n = question.options.length;
        // Lean towards the upper-middle options.
        const index = Math.min(n - 1, Math.floor((n - 1) / 2) + (h % 3) - (h % 7 === 0 ? 1 : 0));
        answers.push({ questionId: question.id, value: question.options[Math.max(0, index)]!.id });
        break;
      }
      case 'chips': {
        const count = 1 + (h % 3);
        const picked = question.options
          .filter((o) => !o.exclusive)
          .filter((_, i) => (i + h) % 4 === 0)
          .slice(0, count);
        if (picked.length > 0)
          answers.push({ questionId: question.id, value: picked.map((o) => o.id) });
        break;
      }
      case 'slider':
        answers.push({ questionId: question.id, value: 3 + (h % 9) });
        break;
      case 'text':
        if (h % 2 === 0) answers.push({ questionId: question.id, value: SAMPLE_COMMENTS[h % 3]! });
        break;
    }
  }
  return answers;
}

/** Skips roughly one in five past windows. */
function wasSubmitted(assignmentId: string, window: WindowType): boolean {
  return hash(`${assignmentId}:${window}`) % 5 !== 0;
}

export async function seedHistory(
  student: Student,
  enrollments: readonly Enrollment[],
): Promise<void> {
  const catalog = getCatalog();

  for (const enrollment of enrollments) {
    const offering = catalog.offerings[enrollment.offeringId];
    const semester = catalog.semesters.find((s) => s.id === offering?.semesterId);
    if (!offering || !semester || semester.isCurrent) continue;

    for (const assignmentId of catalog.assignmentsByOffering[offering.id] ?? []) {
      for (const type of ['midterm', 'final'] as const) {
        if (!wasSubmitted(assignmentId, type)) continue;
        const window = catalog.windows[`win-${offering.id}-${type}`];
        if (!window) continue;

        const response: AnonymousResponse = {
          id: `rsp-seed-${hash(`${student.id}:${assignmentId}:${type}`).toString(36)}`,
          assignmentId,
          window: type,
          version: 1,
          answers: mockAnswers(`${assignmentId}:${type}`, type),
        };
        const receipt: SubmissionReceipt = {
          id: `rcp-seed-${hash(`${student.id}:${assignmentId}:${type}:r`).toString(36)}`,
          studentId: student.id,
          assignmentId,
          window: type,
          responseId: response.id,
          status: 'submitted',
          updatedOn: window.closesAt.slice(0, 10),
        };
        await saveResponse(response);
        await saveReceipt(receipt);
      }
    }
  }
}
