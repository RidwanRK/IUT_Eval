import type { ReactNode } from 'react';
import { RequireStudent } from '@/components/layout/require-student';

/** The feedback flow runs full screen, without the tab bar, so nothing competes with it. */
export default function StudentFlowLayout({ children }: { children: ReactNode }) {
  return <RequireStudent>{children}</RequireStudent>;
}
