/**
 * Storage adapter around localStorage.
 *
 * - Keys are namespaced and versioned (`iuteval:v1:<name>`). Bump STORAGE_VERSION to
 *   start fresh when a stored shape changes.
 * - Every call has a safe fallback: if localStorage is missing, blocked or full, we use
 *   an in-memory map so the app keeps working (it just will not survive a refresh).
 * - Writes notify subscribers, so screens can refetch after a change.
 *
 * Only /lib/services should import this. Components never touch storage directly.
 */

export const STORAGE_VERSION = 'v1';
const PREFIX = `iuteval:${STORAGE_VERSION}:`;
const CHANGE_EVENT = 'iuteval:storage-change';

const memory = new Map<string, string>();

function fullKey(key: string): string {
  return `${PREFIX}${key}`;
}

function getBackend(): Storage | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

function emitChange(key?: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { key } }));
}

export const storage = {
  get<T>(key: string, fallback: T): T {
    const k = fullKey(key);
    try {
      const backend = getBackend();
      const raw = backend ? backend.getItem(k) : (memory.get(k) ?? null);
      if (raw === null) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  set<T>(key: string, value: T): void {
    const k = fullKey(key);
    const raw = JSON.stringify(value);
    try {
      const backend = getBackend();
      if (backend) backend.setItem(k, raw);
      else memory.set(k, raw);
    } catch {
      // Blocked or full. Keep the value in memory so this session still works.
      memory.set(k, raw);
    }
    emitChange(key);
  },

  remove(key: string): void {
    const k = fullKey(key);
    try {
      getBackend()?.removeItem(k);
    } catch {
      /* ignore */
    }
    memory.delete(k);
    emitChange(key);
  },

  /** Removes every key this app owns (all versions). */
  clearAll(): void {
    try {
      const backend = getBackend();
      if (backend) {
        const toRemove: string[] = [];
        for (let i = 0; i < backend.length; i++) {
          const k = backend.key(i);
          if (k && k.startsWith('iuteval:')) toRemove.push(k);
        }
        toRemove.forEach((k) => backend.removeItem(k));
      }
    } catch {
      /* ignore */
    }
    memory.clear();
    emitChange();
  },

  subscribe(listener: () => void): () => void {
    if (typeof window === 'undefined') return () => {};
    const handler = () => listener();
    window.addEventListener(CHANGE_EVENT, handler);
    // Changes made in another tab.
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(CHANGE_EVENT, handler);
      window.removeEventListener('storage', handler);
    };
  },
};

/** Storage key names live here so they are easy to audit. */
export const KEYS = {
  session: 'session',
  profile: 'profile',
  enrollments: 'enrollments',
  drafts: 'drafts',
  /** Response content. NEVER holds a student id. Separate from receipts on purpose. */
  responses: 'responses.anonymous',
  /** Student-to-response links. Separate from response content on purpose. */
  receipts: 'receipts.submission',
  notificationsRead: 'notifications.read',
  reminderPrefs: 'reminder-prefs',
  clockOverride: 'clock.override',
  historySeeded: 'seeded.history',
  scenario: 'prototype.scenario',
} as const;
