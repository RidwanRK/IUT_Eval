/**
 * Mock sign-in. There is no real authentication: any input works.
 * A real implementation would call the university's sign-in and return a token.
 */
import { KEYS, storage } from '@/lib/storage';
import { getProfile } from './profile';

interface Session {
  signedIn: true;
  signedInAt: string;
}

export async function getSession(): Promise<Session | null> {
  return storage.get<Session | null>(KEYS.session, null);
}

export async function signIn(
  // Ignored in the prototype. Kept so the real call has the same shape.
  _studentId: string,
  _password: string,
): Promise<{ hasProfile: boolean }> {
  void _studentId;
  void _password;
  storage.set<Session>(KEYS.session, { signedIn: true, signedInAt: new Date().toISOString() });
  const profile = await getProfile();
  return { hasProfile: profile !== null };
}

/** Signs out but keeps the profile, so signing back in goes straight to home. */
export async function signOut(): Promise<void> {
  storage.remove(KEYS.session);
}
