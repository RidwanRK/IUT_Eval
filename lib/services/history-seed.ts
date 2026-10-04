/**
 * Mock history. In production, past submissions already exist on the server. For the demo
 * we pretend the student gave feedback for most past windows and skipped a few, so the
 * History screen has both states. Deterministic, so a reset always gives the same history.
 */
import { getCatalog } from '@/lib/mock/catalog';
import type {
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
          answers: [],
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
