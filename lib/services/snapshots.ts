/**
 * Classmate snapshot: how the class answered a few questions, shown right after sending.
 *
 * Mock: classmate counts are generated, not stored. A real backend would compute aggregates
 * on the server and apply the same minimum-responses rule there, so small groups are never
 * revealed and individual answers never leave the server.
 */
import { REVEAL_MIN_RESPONSES, getQuestionSet } from '@/config/questions';
import type { ClassSnapshot, ScaleQuestion, WindowType } from '@/lib/types';
import { getAssignmentContext } from './teaching';
import { getFeedbackSession } from './feedback';

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic pseudo-random in [0, 1). */
function rand(seed: string): number {
  return (hash(seed) % 10_000) / 10_000;
}

/**
 * Labs have small groups, so they fall below the minimum and show the "once more classmates
 * have responded" line. Everything else has a healthy count.
 */
function mockClassmateCount(
  assignmentId: string,
  role: 'theory' | 'lab',
  window: WindowType,
): number {
  if (role === 'lab') return 3 + Math.floor(rand(`${assignmentId}:${window}:n`) * 5); // 3 to 7
  return 18 + Math.floor(rand(`${assignmentId}:${window}:n`) * 30); // 18 to 47
}

/** Weights peak near the middle option, with some noise, so bars look like real classes. */
function mockCounts(question: ScaleQuestion, total: number, seed: string): number[] {
  const n = question.options.length;
  const peak = (n - 1) / 2 + (rand(`${seed}:peak`) - 0.5) * 1.2;
  const weights = question.options.map((_, i) => {
    const distance = Math.abs(i - peak);
    return Math.exp(-distance * 0.9) * (0.7 + rand(`${seed}:${i}`) * 0.6);
  });
  const sum = weights.reduce((a, b) => a + b, 0);
  const counts = weights.map((w) => Math.floor((w / sum) * total));
  // Hand the leftover to the biggest bucket so counts add up to the total.
  let leftover = total - counts.reduce((a, b) => a + b, 0);
  const order = weights.map((w, i) => [w, i] as const).sort((a, b) => b[0] - a[0]);
  for (let k = 0; leftover > 0; k = (k + 1) % order.length, leftover--) counts[order[k]![1]]!++;
  return counts;
}

/**
 * The snapshot for one assignment and window. `items` is empty when the class is below
 * REVEAL_MIN_RESPONSES. The student's own response counts as one of the responses.
 */
export async function getClassSnapshot(
  assignmentId: string,
  window: WindowType,
): Promise<ClassSnapshot> {
  const [context, session] = await Promise.all([
    getAssignmentContext(assignmentId),
    getFeedbackSession(assignmentId, window),
  ]);
  if (!context) return { assignmentId, window, responseCount: 0, items: [] };

  const classmates = mockClassmateCount(assignmentId, context.assignment.role, window);
  const mine = session?.sentAnswers ?? null;
  const responseCount = classmates + (mine ? 1 : 0);

  if (responseCount < REVEAL_MIN_RESPONSES) {
    return { assignmentId, window, responseCount, items: [] };
  }

  const set = getQuestionSet(window);
  const items = set.revealQuestions.slice(0, 3).flatMap((questionId) => {
    const question = set.questions.find((q) => q.id === questionId);
    if (!question || question.type !== 'scale') return [];
    const counts = mockCounts(question, classmates, `${assignmentId}:${window}:${questionId}`);
    const own = mine?.[questionId];
    const ownIndex = question.options.findIndex((o) => o.id === own);
    if (ownIndex >= 0) counts[ownIndex]!++;
    return [{ questionId, counts, total: counts.reduce((a, b) => a + b, 0) }];
  });

  return { assignmentId, window, responseCount, items };
}
