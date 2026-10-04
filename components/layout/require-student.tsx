'use client';

import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { copy } from '@/config/copy';
import { useService } from '@/lib/hooks/use-service';
import { getProfile } from '@/lib/services/profile';
import { getSession } from '@/lib/services/session';
import { ErrorState } from '@/components/ui/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import { StudentProvider } from './student-context';

type Gate =
  | { state: 'ok'; profile: NonNullable<Awaited<ReturnType<typeof getProfile>>> }
  | { state: 'signin' }
  | { state: 'welcome' };

async function loadGate(): Promise<Gate> {
  const [session, profile] = await Promise.all([getSession(), getProfile()]);
  if (!session) return { state: 'signin' };
  if (!profile) return { state: 'welcome' };
  return { state: 'ok', profile };
}

/**
 * Guards student screens. No session goes to sign-in, no profile goes to onboarding.
 * Renders children only when we know who the student is.
 */
export function RequireStudent({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, error, reload } = useService(loadGate);

  useEffect(() => {
    if (data?.state === 'signin') router.replace('/student/sign-in');
    if (data?.state === 'welcome') router.replace('/student/welcome');
  }, [data, router]);

  if (error) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <ErrorState onRetry={reload} />
      </div>
    );
  }

  if (data?.state !== 'ok') {
    return (
      <div
        className="mx-auto max-w-md space-y-4 px-4 py-16"
        role="status"
        aria-label={copy.common.loading}
      >
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return <StudentProvider value={data.profile}>{children}</StudentProvider>;
}
