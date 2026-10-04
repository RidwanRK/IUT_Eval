'use client';

import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';
import { ToastProvider } from '@/components/ui/toast';

/** App-wide providers. `reducedMotion="user"` makes Framer Motion respect the OS setting. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>{children}</ToastProvider>
    </MotionConfig>
  );
}
