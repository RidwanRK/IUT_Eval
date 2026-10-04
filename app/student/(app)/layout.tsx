import type { ReactNode } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { RequireStudent } from '@/components/layout/require-student';

export default function StudentAppLayout({ children }: { children: ReactNode }) {
  return (
    <RequireStudent>
      <AppShell>{children}</AppShell>
    </RequireStudent>
  );
}
