import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { FeedbackRoute } from '@/components/features/feedback/feedback-route';

export const metadata: Metadata = { title: 'Feedback' };

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ assignmentId: string; window: string }>;
}) {
  const { assignmentId, window } = await params;
  if (window !== 'midterm' && window !== 'final') notFound();

  return (
    <Suspense fallback={null}>
      <FeedbackRoute assignmentId={assignmentId} window={window} />
    </Suspense>
  );
}
