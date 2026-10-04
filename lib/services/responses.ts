/**
 * RESPONSE CONTENT. What a student wrote, with no way to tell who wrote it.
 *
 * Anonymity rule: an AnonymousResponse never holds a student identifier, and never a
 * precise timestamp (a time could be matched against sign-in logs). The link between a
 * student and a response lives ONLY in lib/services/receipts.ts, under a different storage
 * key. In production these would be two separate, access-controlled stores, so that
 * reading response content never gives you identities and vice versa.
 *
 * Do not import receipts from this file, and do not add identity fields here.
 */
import { KEYS, storage } from '@/lib/storage';
import type { AnonymousResponse } from '@/lib/types';

type ResponseStore = Record<string, AnonymousResponse>;

export async function getResponse(responseId: string): Promise<AnonymousResponse | null> {
  return storage.get<ResponseStore>(KEYS.responses, {})[responseId] ?? null;
}

export async function getAllResponses(): Promise<AnonymousResponse[]> {
  return Object.values(storage.get<ResponseStore>(KEYS.responses, {}));
}

export async function saveResponse(response: AnonymousResponse): Promise<void> {
  const store = storage.get<ResponseStore>(KEYS.responses, {});
  store[response.id] = response;
  storage.set(KEYS.responses, store);
}

export async function deleteResponses(ids: ReadonlySet<string>): Promise<void> {
  const store = storage.get<ResponseStore>(KEYS.responses, {});
  for (const id of ids) delete store[id];
  storage.set(KEYS.responses, store);
}
