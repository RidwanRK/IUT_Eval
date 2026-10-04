'use client';

import { useSearchParams } from 'next/navigation';
import type { WindowType } from '@/lib/types';
import { FeedbackFlow } from './feedback-flow';

/** Reads `?view=answers` (used by History) and renders the flow. */
export function FeedbackRoute({
  assignmentId,
  window,
}: {
  assignmentId: string;
  window: WindowType;
}) {
  const params = useSearchParams();
  return (
    <FeedbackFlow
      assignmentId={assignmentId}
      window={window}
      viewAnswers={params.get('view') === 'answers'}
    />
  );
}
