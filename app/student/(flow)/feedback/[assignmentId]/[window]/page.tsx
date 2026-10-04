import Link from 'next/link';
import { buttonStyles } from '@/components/ui/button';

/** Placeholder. The feedback flow is built in Stage 3. */
export default async function FeedbackPlaceholderPage({
  params,
}: {
  params: Promise<{ assignmentId: string; window: string }>;
}) {
  const { assignmentId, window } = await params;
  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-extrabold tracking-tight">Feedback</h1>
      <p className="text-muted mt-2">
        {window} feedback for {assignmentId} is coming in the next stage.
      </p>
      <Link href="/student" className={buttonStyles({ className: 'mt-6' })}>
        Back to home
      </Link>
    </main>
  );
}
