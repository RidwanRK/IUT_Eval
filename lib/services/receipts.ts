/**
 * SUBMISSION RECEIPTS. The only place that links a student to a response.
 *
 * A receipt says "this student sent feedback for this assignment and window, and the
 * response is <id>". It powers completion tracking, "edit until close" and administrator
 * lookups (only to handle abuse or misconduct). It holds no answers.
 *
 * It is kept apart from response content (lib/services/responses.ts) on purpose, under its
 * own storage key. In production these would be separate, access-controlled stores.
 */
import { KEYS, storage } from '@/lib/storage';
import type { SubmissionReceipt, WindowType } from '@/lib/types';

type ReceiptStore = Record<string, SubmissionReceipt>;

function receiptKey(studentId: string, assignmentId: string, window: WindowType): string {
  return `${studentId}:${assignmentId}:${window}`;
}

export async function getReceipts(studentId: string): Promise<SubmissionReceipt[]> {
  return Object.values(storage.get<ReceiptStore>(KEYS.receipts, {})).filter(
    (r) => r.studentId === studentId,
  );
}

export async function getReceipt(
  studentId: string,
  assignmentId: string,
  window: WindowType,
): Promise<SubmissionReceipt | null> {
  const store = storage.get<ReceiptStore>(KEYS.receipts, {});
  return store[receiptKey(studentId, assignmentId, window)] ?? null;
}

export async function saveReceipt(receipt: SubmissionReceipt): Promise<void> {
  const store = storage.get<ReceiptStore>(KEYS.receipts, {});
  store[receiptKey(receipt.studentId, receipt.assignmentId, receipt.window)] = receipt;
  storage.set(KEYS.receipts, store);
}

/** Removes receipts for the given assignments and returns their response ids. */
export async function deleteReceiptsFor(
  studentId: string,
  assignmentIds: ReadonlySet<string>,
): Promise<string[]> {
  const store = storage.get<ReceiptStore>(KEYS.receipts, {});
  const removed: string[] = [];
  for (const key of Object.keys(store)) {
    const r = store[key]!;
    if (r.studentId === studentId && assignmentIds.has(r.assignmentId)) {
      removed.push(r.responseId);
      delete store[key];
    }
  }
  storage.set(KEYS.receipts, store);
  return removed;
}
