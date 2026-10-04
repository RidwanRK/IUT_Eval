/**
 * Drafts: answers a student has started but not sent. They live only on this device,
 * keyed by assignment and window, and hold no student identifier.
 */
import { KEYS, storage } from '@/lib/storage';
import type { Draft, WindowType } from '@/lib/types';

type DraftStore = Record<string, Draft>;

function draftKey(assignmentId: string, window: WindowType): string {
  return `${assignmentId}:${window}`;
}

export async function getDraft(assignmentId: string, window: WindowType): Promise<Draft | null> {
  const store = storage.get<DraftStore>(KEYS.drafts, {});
  return store[draftKey(assignmentId, window)] ?? null;
}

export async function getAllDrafts(): Promise<Draft[]> {
  return Object.values(storage.get<DraftStore>(KEYS.drafts, {}));
}

export async function saveDraft(draft: Draft): Promise<void> {
  const store = storage.get<DraftStore>(KEYS.drafts, {});
  store[draftKey(draft.assignmentId, draft.window)] = draft;
  storage.set(KEYS.drafts, store);
}

export async function clearDraft(assignmentId: string, window: WindowType): Promise<void> {
  const store = storage.get<DraftStore>(KEYS.drafts, {});
  delete store[draftKey(assignmentId, window)];
  storage.set(KEYS.drafts, store);
}

/** Removes drafts for the given assignments. */
export async function clearDraftsFor(assignmentIds: ReadonlySet<string>): Promise<void> {
  const store = storage.get<DraftStore>(KEYS.drafts, {});
  for (const key of Object.keys(store)) {
    if (assignmentIds.has(store[key]!.assignmentId)) delete store[key];
  }
  storage.set(KEYS.drafts, store);
}
