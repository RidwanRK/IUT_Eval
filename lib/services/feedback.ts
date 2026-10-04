/**
 * The feedback flow's service: load what the screen needs, and send answers.
 *
 * Sending writes two things through two separate modules and storage keys:
 * 1. the AnonymousResponse (answers only, no student identifier) via ./responses
 * 2. the SubmissionReceipt (who sent it, for which assignment and window) via ./receipts
 * In production these would be separate, access-controlled stores. Never put a student
 * identifier into the response, and never put answers into the receipt.
 */
import type {
  AnonymousResponse,
  AnswerMap,
  Draft,
  SubmissionReceipt,
  WindowStatus,
  WindowType,
} from '@/lib/types';
import { uid } from '@/lib/utils';
import { answersToMap, sanitizeAnswers } from './answers';
import { getNow } from './clock';
import { getDashboard } from './dashboard';
import { clearDraft, getDraft } from './drafts';
import { requireProfile } from './profile';
import { getReceipt, saveReceipt } from './receipts';
import { getResponse, saveResponse } from './responses';
import { getAssignmentContext, type AssignmentContext } from './teaching';
import { getWindowStatus, toDateOnly } from './window-logic';

export interface FeedbackSession {
  context: AssignmentContext;
  window: WindowType;
  now: Date;
  status: WindowStatus;
  receipt: SubmissionReceipt | null;
  /** The answers already sent, if any. Used to prefill an edit. */
  sentAnswers: AnswerMap | null;
  draft: Draft | null;
}

/** Null when the assignment does not exist or the student is not enrolled in it. */
export async function getFeedbackSession(
  assignmentId: string,
  window: WindowType,
): Promise<FeedbackSession | null> {
  const [student, now, context] = await Promise.all([
    requireProfile(),
    getNow(),
    getAssignmentContext(assignmentId),
  ]);
  if (!context) return null;

  const [receipt, draft] = await Promise.all([
    getReceipt(student.id, assignmentId, window),
    getDraft(assignmentId, window),
  ]);
  const response = receipt ? await getResponse(receipt.responseId) : null;

  return {
    context,
    window,
    now,
    status: getWindowStatus(context.windows[window], now),
    receipt,
    sentAnswers: response ? answersToMap(response.answers) : null,
    draft,
  };
}

export class FeedbackError extends Error {
  constructor(public readonly code: 'WINDOW_NOT_OPEN' | 'NO_ANSWERS' | 'NOT_FOUND' | 'OFFLINE') {
    super(code);
  }
}

export interface SubmitResult {
  /** True when this replaced an earlier response. */
  updated: boolean;
  closesAt: string;
}

export async function submitFeedback(
  assignmentId: string,
  window: WindowType,
  answerMap: AnswerMap,
): Promise<SubmitResult> {
  // Sending needs a connection (a real backend would fail anyway). Drafts stay safe on the device.
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    throw new FeedbackError('OFFLINE');
  }

  const [student, now, context] = await Promise.all([
    requireProfile(),
    getNow(),
    getAssignmentContext(assignmentId),
  ]);
  if (!context) throw new FeedbackError('NOT_FOUND');

  const feedbackWindow = context.windows[window];
  if (getWindowStatus(feedbackWindow, now) !== 'open') throw new FeedbackError('WINDOW_NOT_OPEN');

  const answers = sanitizeAnswers(window, answerMap);
  if (answers.length === 0) throw new FeedbackError('NO_ANSWERS');

  const existingReceipt = await getReceipt(student.id, assignmentId, window);
  const existing = existingReceipt ? await getResponse(existingReceipt.responseId) : null;

  // 1. Response content. Deliberately no student id and no precise timestamp.
  const response: AnonymousResponse = {
    id: existing?.id ?? uid('rsp'),
    assignmentId,
    window,
    version: (existing?.version ?? 0) + 1,
    answers,
  };
  await saveResponse(response);

  // 2. The receipt, kept in its own store: the only link between student and response.
  await saveReceipt({
    id: existingReceipt?.id ?? uid('rcp'),
    studentId: student.id,
    assignmentId,
    window,
    responseId: response.id,
    status: 'submitted',
    updatedOn: toDateOnly(now),
  });

  await clearDraft(assignmentId, window);
  return { updated: existing !== null, closesAt: feedbackWindow.closesAt };
}

/** The next open item the student has not sent yet, other than the one they just finished. */
export async function getNextPendingFeedback(exclude?: {
  assignmentId: string;
  window: WindowType;
}): Promise<{ assignmentId: string; window: WindowType } | null> {
  const { courses } = await getDashboard();
  for (const card of courses) {
    for (const row of card.rows) {
      for (const type of ['midterm', 'final'] as const) {
        const line = row.lines[type];
        if (line.action !== 'start' && line.action !== 'continue') continue;
        if (exclude && exclude.assignmentId === row.assignment.id && exclude.window === type) {
          continue;
        }
        return { assignmentId: row.assignment.id, window: type };
      }
    }
  }
  return null;
}
