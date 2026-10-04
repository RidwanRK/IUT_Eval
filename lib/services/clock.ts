/**
 * The one place that knows what time it is.
 *
 * Window status is always computed from opensAt/closesAt compared with getNow().
 * Mock mode: time is frozen at a demo date unless the prototype scenario picker overrides
 * it. A real backend would return the real server time (or simply `new Date()`).
 */
import { MOCK_DEFAULT_NOW } from '@/lib/mock/catalog';
import { KEYS, storage } from '@/lib/storage';

export async function getNow(): Promise<Date> {
  const override = storage.get<string | null>(KEYS.clockOverride, null);
  return new Date(override ?? MOCK_DEFAULT_NOW);
}

/** Pass null to go back to the default demo date. */
export async function setClockOverride(iso: string | null): Promise<void> {
  if (iso === null) storage.remove(KEYS.clockOverride);
  else storage.set(KEYS.clockOverride, iso);
}
